
var _ = require('lodash');

// ====================================
// Users
// ====================================

module.exports = {

	/**
	 * Display Users
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.User
		.find()
		.sort({ firstName: 1, lastName: 1 })
		.exec()
		.then((users) => {
			res.render('admin/users', {
				users: _.map(users, (u) => {
					return u.toObject({ transform: db.common.stringifyIds, virtuals: true });
				})
			});
		});
	},

	/**
	 * Create a new User
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
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
	},

	/**
	 * Edit a user
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

		if(req.body.id && _.isString(req.body.data)) {

			let data = JSON.parse(req.body.data);

			db.User.edit(req.body.id, data).then(() => {
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
				error: 'Invalid user data.'
			});
		}

	},

	/**
	 * Delete a user
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {
		db.User.erase(req.body.id).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'User deleted!',
	      message:  req.body.email + ' has been deleted successfully!',
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

}