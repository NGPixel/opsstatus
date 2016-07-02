"use strict";

jQuery( document ).ready(function( $ ) {

	// ====================================
	// Notifications
	// ====================================

	$('.admin-sd > li').on('click', (ev) => {
		window.location.assign(ev.currentTarget.dataset.link);
	});

	// ====================================
	// Regions
	// ====================================

	if($('.admin-regions').length) {

		Sortable.create($('.admin-regions').get(0), {
			animation: 300,
			chosenClass: 'active',
			handle: '.handle'
		});

		$('#admin-regions-new').on('click', (ev => {

			vex.dialog.prompt({
			  message: 'Enter the name of the new region:',
			  placeholder: 'Region name',
			  callback: function(value) {
			    return console.log(value);
			  }
			});

		}));

	}

});