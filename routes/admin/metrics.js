
var Promise = require('bluebird');
var _ = require('lodash');

// ====================================
// METRICS
// ====================================

module.exports = {

	/**
	 * Display Metrics
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	display(req, res, next) {
		res.render('admin/metrics', {
			
		});
	},

	/**
	 * Display Create Metric Page
	 *
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
	 */
	displayCreate(req, res, next) {

		db.Region.find()
			.sort('sortIndex')
			.exec()
			.then((regions) => {

				return {
					regions,
					sources: _.concat(
						{
							id: 'incidents_all',
							name: 'Incidents - All Regions',
							type: 'Incidents',
							icon: 'bullhorn'
						},
						_.map(regions, (r) => {
							return {
								id: 'incidents_' + r.id,
								name: 'Incidents - ' + r.name,
								type: 'Incidents',
								icon: 'bullhorn'
							}
						}),
						{
							id: 'monitor_12345',
							name: 'Monitor - Corporate Website',
							type: 'Monitors',
							icon: 'heartbeat'
						}
					)
				};

		}).then((data) => {
			res.render('admin/metrics-create', data);
		});
		
	}

};