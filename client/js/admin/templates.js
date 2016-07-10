
// ====================================
// Templates
// ====================================

if($('#admin-templates').length) {

	// Delete a user

	$('#admin-templates .admin-list .delete-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.confirm({
		  message: 'Are you sure you want to delete template <strong>' + parentElm.dataset.name + '</strong>?',
		  callback(value) {

		  	if(value) {
		  		$.ajax('/admin/templates', {
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
		  				alerts.pushError('Delete template failed', res.error.message || res.error);
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

}