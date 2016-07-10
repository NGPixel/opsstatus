
var _ = require('lodash');

// ====================================
// COMPONENTS
// ====================================

module.exports = {

	/**
	 * Components - GET
	 */
	display(req, res, next) {
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
					.aggregate({ $match: { deleted: false } })
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
	},

	/**
	 * Components - PUT
	 */
	create(req, res, next) {
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
	},

	/**
	 * Components - POST
	 */
	edit(req, res, next) {

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

		// Edit a component

		} else if(req.body.editCompId) {

			if(!_.isEmpty(req.body.editCompName) && !_.isEmpty(req.body.editCompDescription)) {
				db.Component.edit(req.body.editCompId, req.body.editCompName, req.body.editCompDescription).then(() => {
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
					error: 'Invalid component name / description.'
				});
			}

		// Invalid command

		} else {

			return res.json({
				ok: false,
				error: 'Invalid command.'
			});

		}

	},

	/**
	 * Component - DELETE
	 */
	delete(req, res, next) {
		db.Component.erase(req.body.compId).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Component deleted',
	      message:  req.body.compName + ' has been deleted successfully!',
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
	}

}