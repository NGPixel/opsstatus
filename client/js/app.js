"use strict";

var alerts;

jQuery( document ).ready(function( $ ) {

	vex.defaultOptions.className = 'vex-theme-os';

	// ====================================
	// Notifications
	// ====================================

	alerts = new Alerts();
	if(alertsData) {
		_.forEach(alertsData, (alertRow) => {
			alerts.push(alertRow);
		});
	}

});