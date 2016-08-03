
// ====================================
// Incidents - Update
// ====================================

if($('#admin-incidents-update').length) {

	let incId = $('#admin-incidents-update').data('id');
	let mde = null;
	let vueIncident = new Vue({
		el: '#admin-incidents-update',
		data: {
			state: 'update',
		}
	});

	// Initialize editor

	mde = new SimpleMDE({
		element: $("#incident-editor").get(0),
		autoDownloadFontAwesome: false,
		placeholder: 'Enter Markdown formatted content here...',
		hideIcons: ['heading', 'quote'],
		showIcons: ['strikethrough', 'heading-1', 'heading-2', 'heading-3', 'code', 'table', 'horizontal-rule'],
		spellChecker: false
	});

	// Save incident

	$('#admin-incidents-save').on('click', (ev) => {

		$.ajax('/admin/incidents', {
			dataType: 'json',
			method: 'POST',
			data: _.assign({}, vueIncident.$data, { id: incId, mode: 'update', content: mde.value() })
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/incidents');
			} else {
				alerts.pushError('Failed to post incident update', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});

	});

}