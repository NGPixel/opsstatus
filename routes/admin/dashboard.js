
var _ = require('lodash');

// ====================================
// DASHBOARD (ADMIN)
// ====================================

module.exports = {

	/**
	 * Display Dashboard
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		db.ComponentGroup
			.find()
			.sort({ sortIndex: 1 })
			.exec()
			.then((groups) => {

				return db.Component
					.aggregate({ $match: { deleted: false, group: { $ne: null } } })
					.sort({ sortIndex: 1, name: 1 })
					.group({ _id: "$group", comps: { $push: "$$ROOT" } })
					.exec()
					.then((compsRaw) => {

						let comps = {};
						_.forEach(compsRaw, (c) => {
							let grpId = 'g_' + c._id.toString();
							comps[grpId] = c.comps;
						});

						groups = _.filter(groups, (g) => {
							return _.has(comps, 'g_' + g.id)
						});

						return res.render('admin/dashboard', {
							groups,
							comps
						});

					});

			});
	},

};