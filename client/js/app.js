"use strict";

var alerts;

jQuery( document ).ready(function( $ ) {

	vex.defaultOptions.className = 'vex-theme-os';

	// ====================================
	// Notifications
	// ====================================

	$(window).bind('beforeunload', () => {
		$('#notifload').addClass('active');
	});
	$(document).ajaxSend(() => {
		$('#notifload').addClass('active');
	}).ajaxComplete(() => {
		$('#notifload').removeClass('active');
	});

	alerts = new Alerts();
	if(alertsData) {
		_.forEach(alertsData, (alertRow) => {
			alerts.push(alertRow);
		});
	}

});