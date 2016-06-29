
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.findById(_id).then((user) => {
            done(null, user);
        }).catch((err) => {
            done(err, null);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(uEmail, uPassword, done) {
        db.User.findOne({ 'email' :  uEmail }).then((user) => {
            if (user && user.validatePassword(uPassword)) {
                return done(null, user);
            }
            return done(null, false, req.flash('autherror', 'Invalid login.'));
        }).catch((err) => {
            done(err, null);
        });
    }));

};