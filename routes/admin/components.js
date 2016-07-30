
var _ = require('lodash');

// ====================================
// COMPONENTS
// ====================================

module.exports = {

	/**
	 * Display Components
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.ComponentGroup
			.find()
			.sort({ sortIndex: 1 })
			.exec()
			.then((groups) => {

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

						return res.render('admin/components', {
							groups,
							comps
						});

					});

			});
	},

	/**
	 * Create a Component
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
		db.Component.new(req.body.name, req.body.description).then(() => {
			red.publish('ops.refresh', 'all');
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
	 * Edit Components
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

		// Set new components order

		if(req.body.compsOrder) {

			let compsOrder = JSON.parse(req.body.compsOrder);
			if(_.isPlainObject(compsOrder)) {
				db.Component.reorder(compsOrder).then(() => {
					red.publish('ops.refresh', 'all');
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
				res.json({
					ok: false,
					error: 'Invalid components array.'
				});
			}

		// Edit a component

		} else if(req.body.editCompId) {

			if(!_.isEmpty(req.body.editCompName) && !_.isEmpty(req.body.editCompDescription)) {
				db.Component.edit(req.body.editCompId, req.body.editCompName, req.body.editCompDescription).then(() => {
					red.publish('ops.refresh', 'all');
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
				res.json({
					ok: false,
					error: 'Invalid component name / description.'
				});
			}

		// Invalid command

		} else {

			res.json({
				ok: false,
				error: 'Invalid command.'
			});

		}

	},

	/**
	 * Delete a Component
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {
		db.Component.erase(req.body.compId).then(() => {
			red.publish('ops.refresh', 'all');
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

};