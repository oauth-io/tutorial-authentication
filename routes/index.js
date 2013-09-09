var secu = require('../lib/secu')

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index');
}

exports.signin = function (req, res) {
	res.render('partials/signin')
}

exports.home = function (req, res) {
	res.render('partials/home')
}

exports.account = function (req, res) {
	res.render('partials/account')
}