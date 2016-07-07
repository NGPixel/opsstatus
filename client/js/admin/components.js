
// ====================================
// Components
// ====================================

if($('#admin-components').length) {

	// Sortable lists

	if($('#admin-components > .admin-headlist').length) {
		var compgroupsList = Sortable.create($('#admin-components > .admin-headlist').get(0), {
			group: 'master',
			animation: 300,
			chosenClass: 'active',
			handle: '.handle',
			onEnd: (ev) => {
				/*$.ajax('/admin/regions', {
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
	  		});*/
			}
		});
		var compsList = _.map($('#admin-components > .admin-headlist .admin-list'), (grp) => {
			return Sortable.create(grp, {
				group: 'child',
				animation: 300,
				chosenClass: 'active',
				handle: '.handle',
				onEnd: (ev) => {
					/*$.ajax('/admin/regions', {
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
		  		});*/
				}
			});
		});
	}
	if($('#admin-components > .admin-prelist').length) {
		var precompsList = Sortable.create($('#admin-components > .admin-prelist .admin-list').get(0), {
			group: { 
				name: 'child',
				pull: true,
				put: false
			},
			animation: 300,
			chosenClass: 'active',
			handle: '.handle',
			onEnd: (ev) => {
				/*$.ajax('/admin/regions', {
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
	  		});*/
			}
		});

	}

	// Create New Component

	$('#admin-components-new').on('click', (ev) => {

		vex.dialog.open({
		  message: 'Enter the info of the new component:',
		  input: '<input name="name" type="text" placeholder="Component Name" autocomplete="off" pattern=".{3,}" required />' + 
		  			 '<input name="description" type="text" placeholder="Short description" autocomplete="off" pattern=".{5,}" required />',
		  callback(data) {

		  	if(_.isPlainObject(data)) {
		  		$.ajax('/admin/components', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data: {
		  				name: data.name,
		  				description: data.description
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Could not create component', 'Invalid component name.');
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Create New Component Group

	$('#admin-components-newgroup').on('click', (ev) => {

		vex.dialog.open({
		  message: 'Enter the info of the new component group:',
		  input: '<input name="name" type="text" placeholder="Component Group Name" autocomplete="off" pattern=".{2,255}" required />' + 
		  			 '<input name="shortname" type="text" placeholder="Component Group Short Name" autocomplete="off" pattern=".{2,20}" required />',
		  callback(data) {

		  	if(_.isPlainObject(data)) {
		  		$.ajax('/admin/componentgroups', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data: {
		  				name: data.name,
		  				shortname: data.shortname
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Could not create component group', 'Invalid component group name.');
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