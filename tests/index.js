"use strict";

let path = require('path'),
	 fs = require('fs');

global.ROOTPATH = path.join(__dirname, '..');

// ========================================
// Load global modules
// ========================================

global._ = require('lodash');
global.winston = require('winston');

// ========================================
// Load configuration values
// ========================================

try {

	// can't use async here, doing it the ugly way...

	let configPath = path.join(__dirname, '../config.yml');

	fs.accessSync(configPath, fs.R_OK);
	global.appconfig = require('requarks-core/core-libs/config')(configPath);

} catch(err) {

	// Use default test values

	let configPath = path.join(__dirname, '../config.sample.yml');
	global.appconfig = require('requarks-core/core-libs/config')(configPath);

}

// ========================================
// Run Tests
// ========================================

require('./db.js');
