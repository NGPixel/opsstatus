
var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');

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
		Promise.props({
			active: db.Incident.find({ currentState: { $ne: 'closed' } }).sort({ createdAt: -1 }).select('-updates').exec(),
			recent: db.Incident.find({ currentState: 'closed', updatedAt: { $gte: moment().utc().subtract(1, 'weeks') } }).sort({ updatedAt: -1 }).select('-updates').exec(),
		}).then((incidents) => {
			res.render('admin/incidents', {
				incidents
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
	 * Display Update Incident Page
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	displayUpdate(req, res, next) {
		db.Incident
		.findById(req.params.id)
		.exec()
		.then((inc) => {
			res.render('admin/incidents-update', {
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
			red.publish('ops.refresh', 'all');
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
	 * Edit / Update an Incident
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

		let data = _.assign({ userId: req.user.id }, req.body);

		if(req.body.mode === 'update' && req.body.id && _.isString(req.body.state) && _.isString(req.body.content)) {

			db.Incident.postUpdate(data).then(() => {
				red.publish('ops.refresh', 'all');
				req.flash('alert', {
		      class: 'success',
		      title: 'Incident updated!',
		      message:  'Incident update has been posted successfully!',
		      iconClass: 'fa-check'
		    });
				return res.json({
					ok: true
				});
			}).catch((ex) => {
				res.json({
					ok: false,
					error: ex
				});
			});

		} else if(req.body.mode === 'edit' && req.body.id) {

			// todo

		} else {
			res.json({
				ok: false,
				error: 'Invalid data.'
			});
		}

	},

	/**
	 * Delete an Incident
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {
		db.Incident.erase(req.body.id).then(() => {
			red.publish('ops.refresh', 'all');
			req.flash('alert', {
	      class: 'success',
	      title: 'Incident deleted!',
	      message:  req.body.name + ' has been deleted successfully!',
	      iconClass: 'fa-trash-o'
	    });
			return res.json({
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