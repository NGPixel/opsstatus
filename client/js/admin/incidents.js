
// ====================================
// Incidents
// ====================================

if($('#admin-incidents').length) {

	// Delete an incident

	$('#admin-incidents .admin-list .delete-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.confirm({
		  message: 'Are you sure you want to delete incident <strong>' + parentElm.dataset.name + '</strong>? If an incident is resolved / completed, you should post an update and set it to <strong>Resolved</strong> instead!',
		  callback(value) {

		  	if(value) {
		  		$.ajax('/admin/incidents', {
		  			dataType: 'json',
		  			method: 'DELETE',
		  			data: {
		  				id: parentElm.dataset.id,
		  				name: parentElm.dataset.name
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Delete incident failed', res.error.message || res.error);
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

}