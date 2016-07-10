
// ====================================
// API
// ====================================

module.exports = {

	/**
	 * Display API keys
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		res.render('admin/api', {
			
		});
	},

};