"use strict";

jQuery( document ).ready(function( $ ) {

	// ====================================
	// Sidebar
	// ====================================

	$('.admin-sd > li').on('click', (ev) => {
		window.location.assign(ev.currentTarget.dataset.link);
	});

	let curPath = window.location.pathname;

	$('.admin-sd > li').filter((sdIdx, sdElm) => {
		let sdPath = $(sdElm).data('link');
		return _.startsWith(curPath, sdPath) &&
			(
				(sdPath === '/admin' && curPath === sdPath)
				||
				$(sdElm).data('link') !== '/admin'
			);
	}).addClass('active');

	// ====================================
	// Dropdown
	// ====================================

	var dropdowns = [];

	$('.dropdown').each((idx, elm) => {
		dropdowns.push(new Dropdown(elm));
	});

	// ====================================
	// Sections
	// ====================================

	//=include admin/incidents-create.js
	//=include admin/templates.js
	//=include admin/templates-edit.js
	//=include admin/components.js
	//=include admin/regions.js
	//=include admin/users.js
	//=include admin/users-edit.js

});