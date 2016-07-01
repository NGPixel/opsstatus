"use strict";

let path = require('path'),
	 fs = require('fs');

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

	let configPath = path.join(__dirname, '../config.json');

	fs.accessSync(configPath, fs.R_OK);
	global.appconfig = require(configPath);

} catch(err) {

	// Use default test values

	global.appconfig = require(__dirname, '../config.sample.json');

}

// ========================================
// Run Tests
// ========================================

require('./db.js');