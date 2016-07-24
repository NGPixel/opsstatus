
// ====================================
// Templates - Create
// ====================================

if($('#admin-incidents-create').length) {

	let mde = null;
	let vueIncident = new Vue({
		el: '#admin-incidents-create',
		data: {
			template: '',
			summary: '',
			type: 'unplanned',
			schedule_planned_start: '',
			schedule_planned_start_time: '',
			schedule_planned_end: '',
			schedule_planned_end_time: '',
			schedule_actual_start: moment().utc().format('YYYY/MM/DD'),
			schedule_actual_start_time: moment().utc().format('HH:mm'),
			timezone: 'UTC',
			component: '',
			componentState: 'partialdown',
			regions: []
		},
		methods: {
			toggleTemplatePicker: () => {
				$('#sct-load-from-template').slideToggle().toggleClass('hidden');
			}
		},
		watch: {
			template: (nVal, oVal) => {
				
				$.ajax('/admin/templates/' + nVal, {
					dataType: 'json',
					method: 'GET',
					headers: {
						'X-Raw-Only': true
					}
				}).then((res) => {
					if(res.ok === true) {
						vueIncident.summary = res.name;
						mde.value(res.content);
						vueIncident.toggleTemplatePicker();
					} else {
						alerts.pushError('Failed fetch template content', res.error.message || res.error);
					}
				}, () => {
					alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
				});

			}
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
		vueIncident.toggleTemplatePicker();
	});

	// Initialize editor

	mde = new SimpleMDE({
		element: $("#incident-editor").get(0),
		autoDownloadFontAwesome: false,
		placeholder: 'Enter Markdown formatted content here...',
		hideIcons: ['heading', 'quote'],
		showIcons: ['strikethrough', 'heading-1', 'heading-2', 'heading-3', 'code', 'table', 'horizontal-rule']
	});

	// Save incident

	$('#admin-incidents-save').on('click', (ev) => {

		$.ajax('/admin/incidents', {
			dataType: 'json',
			method: 'PUT',
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
		});

	});

	$('#incident-summary').focus();

}