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

	// ====================================
	// Expand Updates List
	// ====================================
	
	if($('.dashboard').length) {

		$('.updates-list-morebtn').on('click', (ev) => {
			let listElm = $(ev.currentTarget).prevAll('.updates-list').get(0);
			$('li', listElm).slice(1).slideToggle();
			$(ev.currentTarget).toggleClass('reverse').prev().toggleClass('reverse');
		});

	}

});