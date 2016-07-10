
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
		res.render('dashboard/dashboard', {
			usr: res.locals.usr
		});
	}

};