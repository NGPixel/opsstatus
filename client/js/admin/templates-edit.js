
// ====================================
// Templates - Edit
// ====================================

if($('#admin-templates-edit').length) {

	let tmplId = $('#admin-templates-edit').data('id');

	let mde = new SimpleMDE({
		element: $("#tmpl-editor").get(0),
		autoDownloadFontAwesome: false,
		placeholder: 'Enter Markdown formatted content here...'
	});

	// Save template

	$('#admin-templates-save').on('click', (ev) => {

		let tmplData = (tmplId === 'new') ? {
			method: 'PUT',
			data: {
				name: $('#tmpl-name').val(),
				content: mde.value()
			}
		} : {
			method: 'POST',
			data: {
				id: tmplId,
				name: $('#tmpl-name').val(),
				content: mde.value()
			}
		}

		$.ajax('/admin/templates', {
			dataType: 'json',
			method: tmplData.method,
			data: tmplData.data
		}).then((res) => {
			if(res.ok === true) {
				window.location.assign('/admin/templates');
			} else {
				alerts.pushError('Template save failed', res.error.message || res.error);
			}
		}, () => {
			alerts.pushError('Connection error', 'An unexpected error when connecting to the server.');
		});

	});

	$('#tmpl-name').focus();

}