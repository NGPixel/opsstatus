
// ====================================
// Regions
// ====================================

if($('#admin-regions').length) {

	// Sortable list

	if($('#admin-regions > .admin-list').length) {
		var regionsList = Sortable.create($('#admin-regions > .admin-list').get(0), {
			animation: 300,
			chosenClass: 'active',
			handle: '.handle',
			onEnd: (ev) => {
				$.ajax('/admin/regions', {
	  			dataType: 'json',
	  			method: 'POST',
	  			data: {
	  				regionOrder: JSON.stringify(regionsList.toArray())
	  			}
	  		}).then((res) => {
	  			if(res.ok === true) {
	  				alerts.pushSuccess('New order saved.', 'The new regions sort order has been saved.');
	  			} else {
	  				alerts.pushError('Re-ordering failed.', 'Could not re-order regions. Try again later.');
	  			}
	  		}, () => {
	  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
	  		});
			}
		});
	}

	// Create New Region

	$('#admin-regions-new').on('click', (ev) => {

		vex.dialog.prompt({
		  message: 'Enter the name of the new region:',
		  placeholder: 'Region name',
		  callback(value) {

		  	if(!_.isEmpty(value)) {
		  		$.ajax('/admin/regions', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data: {
		  				newRegionName: value
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Could not create region', 'Invalid region name.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Edit existing Region

	$('#admin-regions > .admin-list > li .edit-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.prompt({
		  message: 'Enter a new name for region ' + parentElm.dataset.name + ':',
		  placeholder: 'Region name',
		  value: parentElm.dataset.name,
		  callback(value) {

		  	if(!_.isEmpty(value)) {
		  		$.ajax('/admin/regions', {
		  			dataType: 'json',
		  			method: 'POST',
		  			data: {
		  				editRegionId: parentElm.dataset.id,
		  				editRegionName: value
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Edit region failed', 'Could not edit region. Try again later.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Delete a region

	$('#admin-regions > .admin-list > li .delete-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.confirm({
		  message: 'Are you sure you want to delete region ' + parentElm.dataset.name + '?',
		  callback(value) {

		  	if(value) {
		  		$.ajax('/admin/regions', {
		  			dataType: 'json',
		  			method: 'DELETE',
		  			data: {
		  				regionId: parentElm.dataset.id,
		  				regionName: parentElm.dataset.name
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Delete region failed', 'Could not delete region. Try again later.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

}