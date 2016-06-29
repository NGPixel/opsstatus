var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
	res.render('dashboard/dashboard', {
		usr: res.locals.usr
	});
});

module.exports = router;