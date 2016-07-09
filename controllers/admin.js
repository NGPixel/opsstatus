var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/', function(req, res, next) {
	res.render('admin/dashboard', {
		
	});
});

// ====================================
// COMPONENTS
// ====================================

/**
 * Components - GET
 */
router.get('/components', function(req, res, next) {
	return db.ComponentGroup
		.find()
		.sort({ sortIndex: 1 })
		.exec()
		.then((groups) => {

			groups = _.map(groups, (g) => {
				g.id = g._id.toString();
				return g;
			});

			return db.Component
				.aggregate()
				.sort({ sortIndex: 1, name: 1 })
				.group({ _id: "$group", comps: { $push: "$$ROOT" } })
				.exec()
				.then((compsRaw) => {

					let comps = {};
					_.forEach(compsRaw, (c) => {
						let grpId = (c._id == null) ? 'uncategorized' : 'g_' + c._id.toString();
						comps[grpId] = c.comps;
					});

					res.render('admin/components', {
						groups,
						comps,
						util: require('util')
					});

				});

		});
});

/**
 * Components - PUT
 */
router.put('/components', function(req, res, next) {
	db.Component.new(req.body.name, req.body.description).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'Component created!',
      message:  req.body.name + ' has been created successfully!',
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
 * Components - POST
 */
router.post('/components', function(req, res, next) {

	// Set new components order

	if(req.body.compsOrder) {

		let compsOrder = JSON.parse(req.body.compsOrder);
		if(_.isPlainObject(compsOrder)) {
			db.Component.reorder(compsOrder).then(() => {
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
				error: 'Invalid components array.'
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
 * Component Groups - PUT
 */
router.put('/componentgroups', function(req, res, next) {
	db.ComponentGroup.new(req.body.name, req.body.shortname).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'Component Group created!',
      message:  req.body.name + ' has been created successfully!',
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
 * Component Groups - POST
 */
router.post('/componentgroups', function(req, res, next) {

	// Set new component groups order

	if(req.body.groupsOrder) {

		let groupsOrder = JSON.parse(req.body.groupsOrder);
		if(_.isArray(groupsOrder)) {
			db.ComponentGroup.reorder(groupsOrder).then(() => {
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
				error: 'Invalid group array.'
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
 * Component Groups - DELETE
 */
router.delete('/componentgroups', function(req, res, next) {
	db.ComponentGroup.delete(req.body.groupId).then(() => {
		req.flash('alert', {
      class: 'success',
      title: 'Component Group deleted',
      message:  req.body.groupName + ' has been deleted successfully!',
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