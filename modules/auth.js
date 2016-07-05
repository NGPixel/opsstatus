
var LocalStrategy = require('passport-local').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        db.User.findById(id).then((user) => {
            done(null, user);
        }).catch((err) => {
            done(err, null);
        });
    });

    passport.use(
        'local',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, uEmail, uPassword, done) {
            db.User.findOne({ 'email' :  uEmail }).then((user) => {
                if (user) {
                    user.validatePassword(uPassword).then((isValid) => {
                        return (isValid) ? done(null, user) : done(null, false);
                    });
                } else {
                    return done(null, false);
                }
            }).catch((err) => {
                done(err);
            });
        })
    );

    passport.use(new LocalAPIKeyStrategy(
        function(req, apikey, done) {
            db.Api.findOne({ key: apikey }, function (err, keyusr) {
                if (err) { return done(err); }
                if (!keyusr) { return done(null, false); }
                return done(null, keyusr);
            });
        }
    ));

};