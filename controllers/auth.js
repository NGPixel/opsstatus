var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/login', function(req, res, next) {
	res.render('auth/login', {
		usr: res.locals.usr
	});
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/admin',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;