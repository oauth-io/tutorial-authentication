/*
 * Serve JSON to our AngularJS client
 */

// exports.name = function (req, res) {
//   res.json({
//   	name: 'Bob'
//   });
// };

var request = require('request'),
	user = require('../lib/user'),
	secu = require('../lib/secu'),
	apis = require('../lib/apis')

var accessToken = function(req, res, success, error) {
	console.log("Request param:", req.body)
	request.post({
		url: 'https://oauth.io/auth/access_token',
		form: {
			code: req.body.code,
			key: "MpnCNnhVAq_zL089ua883AevC1o",            // The public key from oauth.io
			secret: "c_QNVPkpy9aUuIIH_lp3hTS-sjE"         // The secret key from oauth.io
		}
	}, function (e,r,body) {
		var data = JSON.parse(body),
			check = secu.check(req, data.state)

		if (check.error) {
			return res.json(check)
		}
		success(data)
	});
}

exports.signin = function (req, res) {
	accessToken(req, res, function(data) {
		var provider = req.body.provider,
			token = data.access_token

		if ( ! data.access_token)
			token = { oauth_token: data.oauth_token, oauth_token_secret: data.oauth_token_secret }

		apis.retrieveUser(token, provider, function(data) {
			user.exists(data.id, provider, function(err, u) {
				var unifiedUser;
				if (u) { //signin
					req.session.user = unifiedUser = u
					res.json({
						success: true,
						user: u
					})
				}
				else { //signup
					unifiedUser = apis.unifyUser(data, provider)
					user.signup(unifiedUser, function(err, dbuser) {
						console.log(dbuser)
						req.session.user = dbuser

						res.json({
							success: true,
							user: dbuser
						})
					})
				}
			})
		})
	})
}

exports.synchronize = function(req, res) {
	if ( ! req.session.user) {
		return res.json({
			success: false,
			message: "You have to be logged in to synchronize"
		})
	}
	accessToken(req, res, function(data) {
		var provider = req.body.provider,
			token = data.access_token

		if ( ! data.access_token)
			token = { oauth_token: data.oauth_token, oauth_token_secret: data.oauth_token_secret }

		apis.retrieveUser(token, provider, function(data) {
			user.exists(data.id, provider, function(err, u) {
				if (u) {
					//merge account and remove the other account
				}
				user.synchronize(req.session.user._id, data.id, provider, function(e, u2) {
					res.json({
						success:true,
						user: u2
					})
				})
			})
		})
	})
}

exports.unsynchronize = function(req, res) {
	if ( ! req.session.user) {
		return res.json({
			success: false,
			message: "You have to be logged in to synchronize"
		})
	}
	user.unsynchronize(req.session.user._id, req.body.provider, function(err, user) {
		res.json({
			success:true,
			user: user
		})
	})
}

exports.csrf_token = function(req, res) {
	res.json({
		csrf_token: secu.generateCsrfToken(req)
	});
}

exports.signout = function(req, res) {
	req.session.destroy()
	res.json({success: true})
}