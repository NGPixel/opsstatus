
var _ = require('lodash');

// ====================================
// MONITORS
// ====================================

module.exports = {

	/**
	 * Display Monitors
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		
		res.render('admin/monitors');

	},

	/**
	 * Create a new Monitor
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	create(req, res, next) {
		
		return res.json({
			ok: true
		});

	},

	/**
	 * Edit a Monitor
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	edit(req, res, next) {

		res.json({
			ok: true
		});

	},

	/**
	 * Delete a Monitor
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	delete(req, res, next) {

		res.json({
			ok: true
		});

	}

};