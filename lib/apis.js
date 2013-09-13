var	secu = require('../lib/secu'),
	utils = require('../lib/utils'),
	request = require('request')


exports.data = {
	facebook: {
		url: "https://graph.facebook.com/me",
		type: "oauth2"
	},
	github: {
		url: "https://api.github.com/user",
		type: "oauth2"
	},
	google: {
		url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
		type: "oauth2"
	},
	twitter: {
		url: "https://api.twitter.com/1.1/account/verify_credentials.json",
		type: "oauth1",
		consumer_key: "XXXXX",
		consumer_secret: "XXXXX"
	}
}

exports.retrieveUser = function(token, provider, callback) {
	var qs = null,
		headers = null

	if (this.data[provider].type == "oauth1") {
		var h = {}
		h.oauth_consumer_key = this.data[provider].consumer_key
		h.oauth_nonce = secu.uniqid("md5", "hex")
		h.oauth_timestamp = Math.floor((new Date()).getTime() / 1000)
		h.oauth_version = "1.0"
		h.oauth_token = token.oauth_token
		h.oauth_signature_method = "HMAC-SHA1"
		h.oauth_signature = encodeURIComponent(secu.sign_hmac_sha1('GET', this.data[provider].url, this.data[provider].consumer_secret + "&" + token.oauth_token_secret, h))
		headers = {"Authorization": secu.build_auth_string(h) }
	}
	else {
		qs = {access_token: token}
	}

	request.get({
    	url: this.data[provider].url,
    	qs: qs,
    	headers: headers
    }, function(e, r, body) {
    	if (body)
	    	callback(JSON.parse(body))
    })
}

exports.unifyUser = function(user, provider) {
	var unified = {}

	if (provider == "facebook") {
		unified = utils.select(user, ['name', 'email'])
		unified.picture = "https://graph.facebook.com/" + user.username + "/picture?type=large"
		unified.verified_email = user.verified
		unified.id_facebook = user.id
	}

	else if (provider == "google") {
		unified = utils.select(user, ['name', 'email', 'picture', 'verified_email'])
		unified.id_google = user.id
	}

	else if (provider == "twitter") {
		unified = utils.select(user, ['name'])
		unified.email = ""
		unified.verified_email = false
		unified.picture = user.profile_image_url_https
		unified.id_twitter = user.id
	}

	else if (provider == "github") {
		unified = utils.select(user, ['name', 'email'])
		unified.picture = user.avatar_url
		unified.verified_email = true
		unified.id_github = user.id
	}

	return unified
}
