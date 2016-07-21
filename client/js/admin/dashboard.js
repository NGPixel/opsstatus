
// ====================================
// TDashboard (Admin)
// ====================================

if($('#admin-dashboard').length) {

	let vueData = {};

	$('.admin-list > li').each((idx, c) => {
		vueData['state_' + $(c).data('id')] = $(c).data('state');
	});

	console.log(vueData);

	let vueDashboard = new Vue({
		el: '#admin-dashboard',
		data: vueData
	});

	// Save Components State

	$('#admin-dashboard-save').on('click', (ev) => {

		$.ajax('/admin/dashboard', {
			dataType: 'json',
			method: 'POST',
			data: vueIncident.$data
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/dashboard');
			} else {
				alerts.pushError('Failed to save components state', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});

	});

}