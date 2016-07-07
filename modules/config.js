"use strict";

var fs = require('fs'),
		yaml = require('js-yaml'),
		_ = require('lodash');

/**
 * Load Application Configuration
 *
 * @param      {String}  confPath  Path to the configuration file
 * @return     {Object}  Application Configuration
 */
module.exports = (confPath) => {

	var appconfig = {};

	try {
	  appconfig = yaml.safeLoad(fs.readFileSync(confPath, 'utf8'));
	} catch (ex) {
	  winston.error(ex);
	  process.exit(1);
	}

	return _.defaultsDeep(appconfig, {
		title: "Ops Status",
		host: "http://localhost",
		port: 80,
		db: "mongodb://localhost/opsstatus",
		redis: {
		  host: "localhost",
		  port: 6379,
		  db: 0
		},
		sessionSecret: null,
		admin: null
	});

};