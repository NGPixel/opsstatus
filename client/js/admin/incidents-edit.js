
// ====================================
// Incidents - Edit
// ====================================

if($('#admin-incidents-edit').length) {

	let mde = null;
	let vueIncident = new Vue({
		el: '#admin-incidents-edit',
		data: {
			summary: '',
			schedule_planned_start: '',
			schedule_planned_start_time: '',
			schedule_planned_end: '',
			schedule_planned_end_time: '',
			schedule_actual_start: moment.tz(userData.timezone).format('YYYY/MM/DD'),
			schedule_actual_start_time: moment.tz(userData.timezone).format('HH:mm'),
			timezone: userData.timezone,
			component: '',
			componentState: 'partialdown',
			regions: []
		}
	});

	// Set datetime inputs

	$('input.datepicker').pikaday({
		format: 'YYYY/MM/DD'
	});

	$('input.timepicker').timepicker({
		show2400: true,
		step: 15,
		timeFormat: 'H:i'
	});

	// Initialize editor

	console.log('DUDE');

	mde = _.map($(".update-editor"), (el) => {
		new SimpleMDE({
			element: el,
			autoDownloadFontAwesome: false,
			placeholder: 'Enter Markdown formatted content here...',
			toolbar: false,
			status: false,
			spellChecker: false
		});
	});

	// Save incident

	$('#admin-incidents-save').on('click', (ev) => {

		/*$.ajax('/admin/incidents', {
			dataType: 'json',
			method: 'POST',
			data: _.assign({}, vueIncident.$data, {
				regions: JSON.stringify(vueIncident.regions),
				content: mde.value()
			})
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/incidents');
			} else {
				alerts.pushError('Failed to save incident', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});*/

	});

}