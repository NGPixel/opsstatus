
var Promise = require('bluebird');

// ====================================
// DASHBOARD (PUBLIC)
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
	 	Promise.props({
	 		componentGroups: red.get('ops:componentgroups').then((r) => { return JSON.parse(r); }),
	 		components: red.get('ops:components').then((r) => { return JSON.parse(r); }),
	 		regions: red.get('ops:regions').then((r) => { return JSON.parse(r); }),
	 		incidents: red.get('ops:incidents').then((r) => { return JSON.parse(r); })
	 	}).then((pdata) => {
	 		res.render('dashboard/dashboard', {
				usr: res.locals.usr,
				pdata
			});
	 	});
	}

};