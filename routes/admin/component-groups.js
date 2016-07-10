
module.exports = {

	/**
	 * Component Groups - PUT
	 */
	create(req, res, next) {
		db.ComponentGroup.new(req.body.name, req.body.shortname).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Component Group created!',
	      message:  req.body.name + ' has been created successfully!',
	      iconClass: 'fa-check'
	    });
			return res.json({
				ok: true
			});
		}).catch((ex) => {
			return res.json({
				ok: false,
				error: ex
			});
		});
	},

	/**
	 * Component Groups - POST
	 */
	edit(req, res, next) {

		// Set new component groups order

		if(req.body.groupsOrder) {

			let groupsOrder = JSON.parse(req.body.groupsOrder);
			if(_.isArray(groupsOrder)) {
				db.ComponentGroup.reorder(groupsOrder).then(() => {
					return res.json({
						ok: true
					});
				}).catch((ex) => {
					return res.json({
						ok: false,
						error: ex
					});
				});
			} else {
				return res.json({
					ok: false,
					error: 'Invalid group array.'
				});
			}

		// Edit a component group

		} else if(req.body.editGroupId) {

			if(!_.isEmpty(req.body.editGroupName) && !_.isEmpty(req.body.editGroupShortName)) {
				db.ComponentGroup.edit(req.body.editGroupId, req.body.editGroupName, req.body.editGroupShortName).then(() => {
					return res.json({
						ok: true
					});
				}).catch((ex) => {
					return res.json({
						ok: false,
						error: ex
					});
				});
			} else {
				return res.json({
					ok: false,
					error: 'Invalid group name / shortname.'
				});
			}

		// Invalid command

		} else {

			return res.json({
				ok: false,
				error: 'Invalid command.'
			});

		}

	},

	/**
	 * Component Groups - DELETE
	 */
	delete(req, res, next) {
		db.ComponentGroup.erase(req.body.groupId).then(() => {
			req.flash('alert', {
	      class: 'success',
	      title: 'Component Group deleted',
	      message:  req.body.groupName + ' has been deleted successfully!',
	      iconClass: 'fa-trash-o'
	    });
			return res.json({
				ok: true
			});
		}).catch((ex) => {
			return res.json({
				ok: false,
				error: ex
			});
		});
	}

}