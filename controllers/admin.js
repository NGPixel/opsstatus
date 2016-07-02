var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('admin/dashboard', {
		
	});
});

router.get('/regions', function(req, res, next) {
	res.render('admin/regions', {
		
	});
});

router.get('/components', function(req, res, next) {
	res.render('admin/components', {
		
	});
});


module.exports = router;