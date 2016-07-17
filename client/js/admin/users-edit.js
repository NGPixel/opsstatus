
// ====================================
// Users - Edit
// ====================================

if($('#admin-users-edit').length) {

	let vueUser = new Vue({
		el: '#admin-users-edit',
		data: usrData
	});

	// Save incident

	$('#admin-users-save').on('click', (ev) => {

		$.ajax('/admin/users', {
			dataType: 'json',
			method: 'POST',
			data: {
				id: usrData._id,
				data: JSON.stringify(vueUser.$data)
			}
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/users');
			} else {
				alerts.pushError('Failed to save user', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});

	});

	$('#user-firstName').focus();

}