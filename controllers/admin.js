var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
	res.render('admin/dashboard', {
		
	});
});

// ====================================
// REGIONS
// ====================================

/**
 * Regions - GET
 */
router.get('/regions', function(req, res, next) {
	return db.Region
		.find()
		.sort({ sortIndex: 1 })
		.exec()
		.then((regions) => {
			res.render('admin/regions', {
				regions
			});
		});

});

/**
 * Regions - PUT
 */
router.put('/regions', function(req, res, next) {
	db.Region.new(req.body.newRegionName).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'Region created!',
      message:  req.body.newRegionName + ' has been created successfully!',
      iconClass: 'fa-check'
    });
		return res.json({
			ok: true
		});
	}).catch((ex) => {
		return res.json({
			ok: false,
			error: ex
		});
	});
});

/**
 * Regions - POST
 */
router.post('/regions', function(req, res, next) {

	// Set new sort order

	if(req.body.regionOrder) {

		let regionOrder = JSON.parse(req.body.regionOrder);
		if(_.isArray(regionOrder)) {
			db.Region.reorder(regionOrder).then(() => {
				return res.json({
					ok: true
				});
			}).catch((ex) => {
				return res.json({
					ok: false,
					error: ex
				});
			});
		} else {
			return res.json({
				ok: false,
				error: 'Invalid region array.'
			});
		}

	// Edit region name

	} else if(req.body.editRegionId) {

		if(!_.isEmpty(req.body.editRegionName)) {
			db.Region.editname(req.body.editRegionId, req.body.editRegionName).then(() => {
				return res.json({
					ok: true
				});
			}).catch((ex) => {
				return res.json({
					ok: false,
					error: ex
				});
			});
		} else {
			return res.json({
				ok: false,
				error: 'Invalid region name.'
			});
		}

	// Invalid command

	} else {

		return res.json({
			ok: false,
			error: 'Invalid command.'
		});

	}

});

/**
 * Regions - DELETE
 */
router.delete('/regions', function(req, res, next) {
	db.Region.delete(req.body.regionId).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'Region deleted!',
      message:  req.body.regionName + ' has been deleted successfully!',
      iconClass: 'fa-trash-o'
    });
		return res.json({
			ok: true
		});
	}).catch((ex) => {
		return res.json({
			ok: false,
			error: ex
		});
	});
});

router.get('/components', function(req, res, next) {
	res.render('admin/components', {
		
	});
});

// ====================================
// Users
// ====================================

/**
 * Users - GET
 */
router.get('/users', function(req, res, next) {
	return db.User
	.find()
	.sort({ fullname: 1 })
	.exec()
	.then((users) => {
		res.render('admin/users', {
			users: _.map(users, (u) => {
				return u.toObject({ transform: db.common.stringifyIds, virtuals: true })
			})
		});
	});
});

/**
 * Regions - PUT
 */
router.put('/users', function(req, res, next) {
	db.User.new(req.body).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'User created!',
      message:  'User has been created successfully!',
      iconClass: 'fa-check'
    });
		return res.json({
			ok: true
		});
	}).catch((ex) => {
		return res.json({
			ok: false,
			error: ex
		});
	});
});

/**
 * Users - POST
 */
router.post('/users', function(req, res, next) {

	if(req.body.id && _.isString(req.body.data)) {

		let data = JSON.parse(req.body.data);

		db.User.edit(req.body.id, data).then(() => {
			return res.json({
				ok: true
			});
		}).catch((ex) => {
			return res.json({
				ok: false,
				error: ex
			});
		});
	} else {
		return res.json({
			ok: false,
			error: 'Invalid user data.'
		});
	}

});

/**
 * Users - DELETE
 */
router.delete('/users', function(req, res, next) {
	db.User.delete(req.body.id).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'User deleted!',
      message:  req.body.email + ' has been deleted successfully!',
      iconClass: 'fa-trash-o'
    });
		return res.json({
			ok: true
		});
	}).catch((ex) => {
		return res.json({
			ok: false,
			error: ex
		});
	});
});

// ====================================
// API
// ====================================

router.get('/api', function(req, res, next) {
	res.render('admin/api', {
		
	});
});

module.exports = router;