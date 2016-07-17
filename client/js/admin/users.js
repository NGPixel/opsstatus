
// ====================================
// Users
// ====================================

if($('#admin-users').length) {

	// Create New User

	$('#admin-users-new').on('click', (ev) => {

		vex.dialog.open({
		  message: 'Enter new user info:',
		  input: '<input name="email" type="text" placeholder="Email Address" autocomplete="email" pattern="[^@]+@[^@]+" required />' + 
		  			 '<input name="password" type="text" placeholder="Password (min 8 chars.)" autocomplete="off" pattern=".{8,}" required />' +
		  			 '<input name="firstName" type="text" placeholder="First Name" autocomplete="given-name" pattern=".+" required />' +
		  			 '<input name="lastName" type="text" placeholder="Last Name" autocomplete="family-name" pattern=".+" required />',
		  callback(data) {

		  	if(_.isPlainObject(data)) {
		  		$.ajax('/admin/users', {
		  			dataType: 'json',
		  			method: 'PUT',
		  			data
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.assign('/admin/users/' + res.newId);
		  			} else {
		  				alerts.pushError('User creation error', res.error.message || res.error);
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

	// Delete a user

	$('#admin-users .admin-list > li .delete-action').on('click', (ev) => {

		let parentElm = $(ev.currentTarget).closest('li').get(0);

		vex.dialog.confirm({
		  message: 'Are you sure you want to delete user ' + parentElm.dataset.email + '?',
		  callback(value) {

		  	if(value) {
		  		$.ajax('/admin/users', {
		  			dataType: 'json',
		  			method: 'DELETE',
		  			data: {
		  				id: parentElm.dataset.id,
		  				email: parentElm.dataset.email
		  			}
		  		}).then((res) => {
		  			if(res.ok === true) {
		  				window.location.reload(true);
		  			} else {
		  				alerts.pushError('Delete user failed', res.error.message || res.error);
		  			}
		  		}, () => {
		  			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		  		});
		  	}

		  }
		});

	});

}