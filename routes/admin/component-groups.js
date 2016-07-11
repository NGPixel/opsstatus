
var _ = require('lodash');

// ====================================
// COMPONENT GROUPS
// ====================================

module.exports = {

	/**
	 * Display Component Groups
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
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
	 * Edit Component Groups
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
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
				res.json({
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
				res.json({
					ok: false,
					error: 'Invalid group name / shortname.'
				});
			}

		// Invalid command

		} else {

			res.json({
				ok: false,
				error: 'Invalid command.'
			});

		}

	},

	/**
	 * Delete a Component Group
	 * 
	 * @param      {Request}   req     The request
	 * @param      {Response}  res     The Response
	 * @param      {Function}  next    The next callback
	 * @return     {void}  void
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

};