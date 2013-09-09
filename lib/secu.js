var crypto = require('crypto')
var utils = require('../lib/utils')

exports.generateCsrfToken = function(req) {
	var shasum = crypto.createHash('sha1')
	shasum.update("flkrjoeivr") //random static string
	shasum.update((new Date()).getTime() + ':' + Math.floor(Math.random()*9999999))
	var uid = shasum.digest('base64')

	var csrf_token = uid.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')

	req.session.csrf_tokens = req.session.csrf_tokens || []
	req.session.csrf_tokens.push(csrf_token)
	if (req.session.csrf_tokens.length > 4)
	    req.session.csrf_tokens.shift() // keep 4 tokens max
	return csrf_token
}

exports.uniqid = function(algo, format) {
    var sum = crypto.createHash(algo);
    sum.update(Math.floor(Math.random() * 1000000).toString());
    sum.update(Math.floor(Math.random() * 1000000).toString());
    sum.update(Math.floor(Math.random() * 1000000).toString());
    sum.update(Math.floor(Math.random() * 1000000).toString());
    sum.update(Math.floor(Math.random() * 1000000).toString());
    sum.update(Math.floor(Math.random() * 1000000).toString());
    id = sum.digest(format);
    return id;
}

exports.check = function(req, state) {
	req.session.csrf_tokens = req.session.csrf_tokens || [];
    if ( ! state) {
        return({
        	error: true,
        	message: body
        });
	}
	if (req.session.csrf_tokens.indexOf(state) == -1) {
        return({
        	error: true,
        	message: "Oups, state does not match !"
        });
    }
    return {
    	error: false
    }
}

exports.build_auth_string = function(authparams) {
	var header = "OAuth ",
		auth = "",
		authparams = utils.ksort(authparams)

	for (key in authparams)
		auth += "," + key + "=\"" + authparams[key] + "\""

	return header + auth.substr(1)
}

exports.sign_hmac_sha1 = function(method, baseurl, secret, parameters) {
	console.log('hmac:', method, baseurl, secret, parameters)
	hmacsha1 = crypto.createHmac("sha1", secret)
	data = method + "&"
	data += (encodeURIComponent(baseurl)) + "&"
	oauth = ""
	parameters = utils.ksort(parameters)
	for (key in parameters)
		oauth += "&" + key + "=" + parameters[key]
	data += encodeURIComponent(oauth.substr(1))
	hmacsha1.update(data)
	return hmacsha1.digest("base64")
}