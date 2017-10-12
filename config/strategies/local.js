var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    user = require('mongoose').model('user');

module.exports = function() {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, function(username, password, done) {
        user.findOne(
            { email: username },
            function(err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                if (user && !user.pwdHash) {
                    return done(null, false, { message: 'You have not yet made a password, please log in via the facebook/linkedin button!' });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid password' });
                }
                if (user.disabled) {
                    if (!user.activateAccountToken) {
                        return done(null, false, { message: 'Your account has been disabled, please contact osmos.no.reply@gmail.com for further information' });
                    } else {
                        return done(null, false, { message: 'Your account needs to be activated before you can log in, check your email!' });
                    }
                }
                return done(null, user);
            }
        );
    }));
};