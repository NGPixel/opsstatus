
var _ = require('lodash');

// ====================================
// REGIONS
// ====================================

module.exports = {

	/**
	 * Display Regions
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.Region
			.find()
			.sort({ sortIndex: 1 })
			.exec()
			.then((regions) => {
				res.render('admin/regions', {
					regions
				});
			});

	},

	/**
	 * Create a Region
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
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
	},

	/**
	 * Edit Regions
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

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
				db.Region.edit(req.body.editRegionId, req.body.editRegionName).then(() => {
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

	},

	/**
	 * Delete a Region
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {
		db.Region.erase(req.body.regionId).then(() => {
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
	}

};