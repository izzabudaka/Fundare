var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var setupAuthentication = function(db) {

	passport.use(new LocalStrategy(
		function(username, password, done) {
			db.User.find({ where: {username: username} }).complete(function(err, user) {
				if(!!err) {
					return done('An error occurred while searching for ' + username + ': ' + err);
				} else if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				};
				if(user.password != password) {
					return done(null, false, { message: 'Incorrect password.' });
				};

				return done(null, user);
			});
		}));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.User.find({ where: {id: id} }).complete(function(err, user) {
			done(err, user);
		});
	});

	return passport;
};

module.exports = setupAuthentication;
