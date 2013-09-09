
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path')


var app = module.exports = express()

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.cookieParser())
app.use(express.session({secret: 'LHGAVIAENOIEJ4564dfsvdbFE'}))
app.use(app.router)

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler())
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

// Routes
app.get('/', routes.index)
app.get('/partial/home', routes.home)
app.get('/partial/signin', routes.signin)
app.get('/partial/account', routes.account)

// JSON API
//app.get('/api/name', api.name)
app.post('/api/signin', api.signin)
app.post('/api/synchronize', api.synchronize)
app.post('/api/unsynchronize', api.unsynchronize)
app.post('/api/logout', api.signout)
app.get('/api/csrf_token', api.csrf_token)
// redirect all others to the index (HTML5 history)
app.get('*', routes.index)

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})