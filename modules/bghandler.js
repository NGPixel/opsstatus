"use strict";

var _ = require('lodash');
var Promise = require('bluebird');

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

	// Update cache

	let updateCache = _.debounce(() => {

		// Incidents

		return db.Incident.find({
			state: { $ne: 'closed' }
		})
		.sort({ updatedAt: 1, createdAt: 1 })
		.populate({ path: 'regions', select: 'name' })
		.lean()
		.exec()
		.then((inc) => {

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
		      }
		    })
		    .lean()
		    .exec()
		    .then((cg) => {

		    	let allComponents = [];

		      // Set component group state

		      cg = _.map(cg, (c) => {

		      	allComponents = _.concat(allComponents, c.components);

		        let states = _.groupBy(c.components, 'state');
		        let cgState = 'ok';
		        _.forEach(['ok', 'scheduled', 'perfissues', 'partialdown', 'majordown'], (s) => {
		          if(_.has(states, s)) {
		            cgState = s;
		          }
		        });
		        c.state = cgState;
		        return c;

		      });

		      return Promise.join(
		      	red.set('ops:components', JSON.stringify(allComponents)),
		      	red.set('ops:componentgroups', JSON.stringify(cg))
		      );

			  }),
			  db.Region.find()
			  .lean()
			  .exec()
			  .then((regions) => {

			  	regions = _.map(regions, (reg) => {
			  		reg.incidents = _.size(_.filter(inc, (i) => {
			  			return _.includes(_.map(i.regions, '_id'), reg._id);
			  		}));
			  		return reg;
			  	});

			  	return red.set('ops:regions', JSON.stringify(regions));

			  })
		  );

		});
	}, 3000);

	// Init subscriber connection to Redis
	// and refresh everything

	let rd = require('./redis')(appconfig);
	rd.psubscribe("ops.*", (err, count) => {
		if(err) { throw err; };
		red.publish('ops.refresh', 'refresh');
	});

	// Process received messages

	rd.on('pmessage', (pattern, channel, msg) => {

		if(channel === 'ops.refresh') {
			updateCache();
		}

	});

};