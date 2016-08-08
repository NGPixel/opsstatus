
var Promise = require('bluebird');

// ====================================
// REGIONAL DASHBOARD (PUBLIC)
// ====================================

module.exports = {

	/**
	 * Redirect to Home
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	home(req, res, next) {
	 	res.redirect('/');
	},

	/**
	 * Display Display
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
	 	Promise.props({
	 		componentGroups: red.get('ops:componentgroups').then((r) => { return JSON.parse(r); }),
	 		components: red.get('ops:components').then((r) => { return JSON.parse(r); }),
	 		incidents: red.get('ops:incidents').then((r) => { return JSON.parse(r); })
	 	}).then((pdata) => {
	 		res.render('dashboard/region', {
				usr: res.locals.usr,
				pdata
			});
	 	});
	}

};