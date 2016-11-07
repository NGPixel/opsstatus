var express = require('express');
var router = express.Router();
var passport = require('passport');
var ExpressBrute = require('express-brute');
var ExpressBruteRedisStore = require('express-brute-redis');
var moment = require('moment');

/**
 * Setup Express-Brute
 */
var EBstore = new ExpressBruteRedisStore({
    prefix: 'bf:',
    client: red
});
var bruteforce = new ExpressBrute(EBstore, {
	freeRetries: 5,
	minWait: 60 * 1000,
	maxWait: 5 * 60 * 1000,
	refreshTimeoutOnRequest: false,
	failCallback(req, res, next, nextValidRequestDate) {
		req.flash('alert', {
      class: 'error',
      title: 'Too many attempts!',
      message:  "You've made too many failed attempts in a short period of time, please try again " + moment(nextValidRequestDate).fromNow() + '.',
      iconClass: 'fa-times'
    });
		res.redirect('/login');
	}
});

/**
 * Login form
 */
router.get('/login', function(req, res, next) {
	res.render('auth/login', {
		usr: res.locals.usr
	});
});

router.post('/login', bruteforce.prevent, function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {

			if (err || !user) {
				req.flash('alert', {
          class: 'error',
          title: 'Invalid login',
          message:  "The email or password is invalid.",
          iconClass: 'fa-times'
        });
				return res.redirect('/login');
			}

			req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      req.brute.reset(function () {
					return res.redirect('/admin');
				});
	    });

		})(req, res, next);
});

/**
 * Social Login
 */

router.get('/login/ms', passport.authenticate('windowslive', { scope: ['wl.signin', 'wl.basic', 'wl.emails'] }));
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/login/ms/callback', passport.authenticate('windowslive', { failureRedirect: '/login', successRedirect: '/admin' }));
router.get('/login/google/callback', passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/admin' }));
router.get('/login/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/admin' }));


/**
 * Logout
 */
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
