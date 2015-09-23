var express = require('express');
var session = require('express-session');

/*
passport.serializeUser(function(user, done) {
	done(null, user.name);
});

passport.deserializeUser(function(name, done) {
	done(null, {name:name});
});

passport.use(new LocalStrategy(function(username, password, done) {
	if(username != 'username') {
		return done(null, false);
	};
	if(password != 'password') {
		return done(null, false);
	};
	return done(null, {name: username});
}));
*/

var bodyParser = require('body-parser');

var config = require(__dirname + '/config')();
var setRoutes = require(__dirname + '/config/routes.js');
var Auth = require(__dirname + '/config/auth.js');

var db = require(__dirname + '/app/models');

var passport = Auth(db);

var app = express();

app.set('port', config.port)
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.engine('jade', require('jade').__express);

app.use(express.static(__dirname + '/public'));

app.use(session({secret: 'roubles'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


setRoutes(app, passport, db);

db
	.sequelize
	.sync()
	.complete(function(err) {
		if(err) {
			throw err[0];
		} else {
			var server = app.listen(app.get('port'), function() {
				console.log('Listening on port %d', app.get('port'));
			});

			app.use(function(err, req, res, next) {
				res.status(500).send('500 error');
			});

			app.use(function(req, res, next) {
				res.status(404).send('404 error');
			});
		};
	});
