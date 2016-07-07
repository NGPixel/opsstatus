"use strict";

jQuery( document ).ready(function( $ ) {

	// ====================================
	// Notifications
	// ====================================

	$('.admin-sd > li').on('click', (ev) => {
		window.location.assign(ev.currentTarget.dataset.link);
	});

	// ====================================
	// Sections
	// ====================================

	//=include admin/components.js
	//=include admin/regions.js
	//=include admin/users.js

});