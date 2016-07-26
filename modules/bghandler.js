"use strict";

var _ = require('lodash');

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

	// Init subscriber connection to Redis

	let rd = require('./redis')(appconfig);
	rd.psubscribe("ops.*", (err, count) => {
		if(err) { throw err; };

		red.publish('ops.components', 'refresh');
	});

	rd.on('pmessage', (pattern, channel, msg) => {

		switch(channel) {
			case 'ops.components':

				// -----------------------------
				// COMPONENTS
				// -----------------------------

				switch(msg) {
					case 'refresh':
						db.Component.refresh();
					break;
				}

			break;
			case 'ops.componentgroups':

				// -----------------------------
				// COMPONENT GROUPS
				// -----------------------------

				switch(msg) {
					case 'refresh':
						db.ComponentGroup.refresh();
					break;
				}

			break;
			case 'ops.regions':

				// -----------------------------
				// REGIONS
				// -----------------------------

				switch(msg) {
					case 'refresh':
						db.Region.refresh();
					break;
				}

			break;
		}

	});

};