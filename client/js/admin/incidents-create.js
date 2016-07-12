
// ====================================
// Templates - Create
// ====================================

if($('#admin-incidents-create').length) {

	let vueIncident = new Vue({
		el: '#admin-incidents-create',
		data: {
			summary: '',
			type: 'unplanned',
			schedule_actual_start: moment().utc().format('YYYY/MM/DD'),
			schedule_actual_start_time: moment().utc().format('HH:mm'),
			component: '',
			regions: [],
			content: ''
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

	// Load from template

	$('#btn-load-from-template').on('click', (ev) => {
		$('#sct-load-from-template').slideToggle().toggleClass('hidden');
	});

	// Initialize editor

	let mde = new SimpleMDE({
		element: $("#incident-editor").get(0),
		autoDownloadFontAwesome: false,
		placeholder: 'Enter Markdown formatted content here...',
		hideIcons: ['heading', 'quote'],
		showIcons: ['strikethrough', 'heading-1', 'heading-2', 'heading-3', 'code', 'table', 'horizontal-rule']
	});

	// Toggle scheduling options

	

	// Save incident

	$('#admin-incidents-save').on('click', (ev) => {

		$.ajax('/admin/incidents', {
			dataType: 'json',
			method: 'PUT',
			data: {

			}
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/incidents');
			} else {
				alerts.pushError('Failed to save incident', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});

	});

	$('#incident-summary').focus();

}