
var _ = require('lodash');

// ====================================
// TEMPLATES
// ====================================

module.exports = {

	/**
	 * Display Templates
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.Template
		.find()
		.sort({ name: 1 })
		.select('name')
		.exec()
		.then((tmpls) => {
			res.render('admin/templates', {
				tmpls
			});
		});
	},

	/**
	 * Display Edit Template Page
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	displayEdit(req, res, next) {
		if(req.params.id === 'create') {
			res.render('admin/templates-edit', {
				title: 'Create',
				tmpl: {
					id: 'new',
					name: '',
					content: ''
				}
			});
		} else {
			db.Template
			.findById(req.params.id)
			.exec()
			.then((tmpl) => {

				if(!tmpl) { return res.status(404).end(); }

				if(req.get('X-Raw-Only')) {
					res.json({
						ok: true,
						name: tmpl.name,
						content: tmpl.content
					});
				} else {
					res.render('admin/templates-edit', {
						title: 'Edit',
						tmpl
					});
				}

			});
		}
	},

	/**
	 * Create a new Template
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
		db.Template.new(req.body.name, req.body.content).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Template created!',
	      message:  'Template has been created successfully!',
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