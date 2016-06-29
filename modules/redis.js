"use strict";

var Redis = require('ioredis'),
	_ = require('lodash');

/**
 * Redis module
 *
 * @param      {Object}  appconfig  Application config
 * @return     {Redis}   Redis instance
 */
module.exports = (appconfig) => {

	let rd = new Redis(_.defaultsDeep(appconfig.redis), {
		lazyConnect: false
	});

	// Handle connection errors

	rd.on('error', (err) => {
		winston.error('Failed to connect to Redis instance.');
	});

	return rd;

};