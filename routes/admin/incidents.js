
var _ = require('lodash');
var Promise = require('bluebird');

// ====================================
// INCIDENTS
// ====================================

module.exports = {

	/**
	 * Display Incidents
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.Incident
		.find()
		.sort({ createdAt: -1 })
		.select('-updates')
		.exec()
		.then((incidents) => {
			res.render('admin/incidents', {
				incidents: _.map(incidents, (t) => {
					return t.toObject({ transform: db.common.stringifyIds, virtuals: true });
				})
			});
		});
	},

		/**
	 * Display Create Incident Page
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	displayCreate(req, res, next) {

		Promise.props({

			comps: db.Component.find()
				.where('group').ne(null)
				.populate('group')
				.exec().then((comps) => { return _.sortBy(comps, ['group.sortIndex', 'sortIndex']);	}),

			regions: db.Region.find()
				.sort('sortIndex')
				.exec(),

			templates: db.Template.find()
				.select('name')
				.sort('name')
				.exec()

		}).then((data) => {
			res.render('admin/incidents-create', data);
		});
		
	},

	/**
	 * Display Edit Incident Page
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	displayEdit(req, res, next) {
		db.Incident
		.findById(req.params.id)
		.exec()
		.then((inc) => {
			res.render('admin/incidents-edit', {
				inc
			});
		});
	},

	/**
	 * Create a new Incident
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
		let data = _.assign({ userId: req.user.id }, req.body);
		db.Incident.new(data).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Incident created!',
	      message:  'Incident has been created successfully!',
	      iconClass: 'fa-check'
	    });
			return res.json({
				ok: true
			});
		}).catch((ex) => {
			return res.json({
				ok: false,
				error: ex.message
			});
		});
	},

	/**
	 * Edit a Template
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

		if(req.body.id && _.isString(req.body.name) && _.isString(req.body.content)) {

			db.Template.edit(req.body.id, req.body.name, req.body.content).then(() => {
				req.flash('alert', {
		      class: 'success',
		      title: 'Template saved!',
		      message:  'Template has been saved successfully!',
		      iconClass: 'fa-check'
		    });
				res.json({
					ok: true
				});
			}).catch((ex) => {
				res.json({
					ok: false,
					error: ex
				});
			});
		} else {
			res.json({
				ok: false,
				error: 'Invalid template data.'
			});
		}

	},

	/**
	 * Delete a Template
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {
		db.Template.erase(req.body.id).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Template deleted!',
	      message:  req.body.name + ' has been deleted successfully!',
	      iconClass: 'fa-trash-o'
	    });
			res.json({
				ok: true
			});
		}).catch((ex) => {
			res.json({
				ok: false,
				error: ex
			});
		});
	}

};