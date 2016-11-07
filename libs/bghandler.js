"use strict";

var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var md = require('markdown-it')({
	breaks: true,
  linkify: true,
  typographer: true
});

/**
 * Background Handler
 *
 * @param      {Object}  appconfig  Application configuration
 * @return     {Object}  Background Handler instance
 */
module.exports = (appconfig) => {

	if(appconfig.serverLevel !== 'master') {
		return;
	}

	let getMostCriticalState = (states) => {
		let mcState = 'ok';
		_.forEach(['ok', 'scheduled', 'perfissues', 'partialdown', 'majordown'], (s) => {
		  if(_.has(states, s)) {
		    mcState = s;
		  }
		});
		return mcState;
	};

	// Update cache

	let updateCache = _.debounce(() => {

		winston.info('Updating cache...');

		// Incidents

		return db.Incident.find({
			$or: [
				{	currentState: { $ne: 'closed' } },
				{ currentState: 'closed', updatedAt: { $gte: moment().utc().subtract(1, 'weeks') } }
			]
		})
		.sort({ updatedAt: -1, createdAt: -1 })
		.populate({ path: 'regions', select: 'name' })
		.lean()
		.exec()
		.then((incRaw) => {

			incRaw = _.map(incRaw, (i) => {
				i.updates = _.chain(i.updates).orderBy(['postedDate'], ['desc']).map((u) => {
					u.contentHTML = md.render(u.content);
					return u;
				});
				return i;
			});

			let inc = {
				active: _.filter(incRaw, (i) => { return i.kind !== 'scheduled' && i.currentState !== 'closed'; }),
				scheduled: _.filter(incRaw, (i) => { return i.kind === 'scheduled' && i.currentState !== 'closed' }),
				recent: _.filter(incRaw, { currentState: 'closed' })
			};

			red.set('ops:incidents', JSON.stringify(inc));

			// Components & Regions

			return Promise.join(
				db.ComponentGroup.find({
		      $where: "this.components.length > 0"
		    })
		    .sort({ sortIndex: 1 })
		    .populate({
		      path: 'components',
		      options: {
		        sort: { 'sortIndex': 1 }
		      },
		      populate: {	path: 'group', select: 'name' }
		    })
		    .lean()
		    .exec()
		    .then((cg) => {

		    	let allComponents = _.flatten(_.map(cg, 'components'));

		    	// Set component state

		    	allComponents = _.keyBy(_.map(allComponents, (c) => {
						let states = _.groupBy(_.filter(inc.active, { component: c._id }), 'state');
		    		c.state = getMostCriticalState(states);
		    		return c;
		    	}), '_id');

		      // Set component group state

		      cg = _.map(cg, (c) => {
		        let states = _.groupBy(c.components, 'state');
		        c.state = getMostCriticalState(states);
		        return c;
		      });

		      return Promise.join(
		      	red.set('ops:components', JSON.stringify(allComponents)),
		      	red.set('ops:componentgroups', JSON.stringify(cg))
		      );

			  }),
			  db.Region.find()
			  .sort({ sortIndex: 1 })
			  .lean()
			  .exec()
			  .then((regions) => {

			  	regions = _.map(regions, (reg) => {
			  		reg.incidents = _.size(_.filter(inc.active, (i) => {
			  			return _.includes(_.map(i.regions, '_id'), reg._id);
			  		}));
			  		return reg;
			  	});

			  	return red.set('ops:regions', JSON.stringify(regions));

			  })
		  );

		}).then(() => {
			winston.info('Cache updated successfully.');
		});
	}, 3000);

	// Init subscriber connection to Redis
	// and refresh everything

	let rd = require(CORE_PATH + 'core-libs/redis')(appconfig);
	rd.psubscribe("ops.*", (err, count) => {
		if(err) { throw err; }
		red.publish('ops.refresh', 'all');
	});

	// Process received messages

	rd.on('pmessage', (pattern, channel, msg) => {

		if(channel === 'ops.refresh') {
			updateCache();
		}

	});

};
