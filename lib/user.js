var request = require('request'),
	mongoose = require('mongoose'),
	apis = require('../lib/apis').data

mongoose.connect('mongodb://localhost/tuto-node')

exports.schema = new mongoose.Schema({
	"name": String,
    "email": String,
    "picture": String,
    "verified_email": Boolean,
    "id_facebook": Number,
    "id_github": Number,
    "id_google": Number,
    "id_twitter": Number
})

exports.synchronize = function(id, id_provider, provider, callback) {
	console.log("Synchronize:", id, id_provider, provider);
	var User = mongoose.model('User', this.schema)
	var obj = {}
	obj['id_' + provider] = id_provider
	User.findOne({"_id": id}, function(err, u) {
		console.log(u, 'id_' + provider, id_provider);
		u.set('id_' + provider, id_provider, Number)
		console.log(u);
		u.save(callback)
	})
}

exports.unsynchronize = function(id, provider, callback) {
	var User = mongoose.model('User', this.schema)
	var obj = {}
	obj['id_' + provider] = null
	User.findOne({"_id": id}, function(err, u) {
		u.set('id_' + provider, null, Number)
		u.save(callback)
	})
}

exports.exists = function(id_provider, provider, callback) {
	var User = mongoose.model('User', this.schema)
	User.findOne().where('id_' + provider).equals(id_provider).exec(callback)
}

exports.signup = function(user, callback) {
	UserSchema = mongoose.model('User', this.schema)
	u = new UserSchema(user)
	u.save(callback);
}