var express = require('express');
var autoload = require('auto-load');
var path = require('path');

module.exports = () => {

	let routes = autoload(path.join(ROOTPATH, '/routes'));

	return {

		dashboard() {

			let router = express.Router();

			// ====================================
			// DASHBOARD
			// ====================================

			router.get('/', routes.dashboard.home.display);

			return router;

		},

		admin() {

			let router = express.Router();

			// ====================================
			// DASHBOARD
			// ====================================

			router.get('/', routes.admin.dashboard.display);

			// ====================================
			// COMPONENTS
			// ====================================

			router.get('/components', routes.admin.components.display);
			router.put('/components', routes.admin.components.create);
			router.post('/components', routes.admin.components.edit);
			router.delete('/components', routes.admin.components.delete);

			// ====================================
			// COMPONENT GROUPS
			// ====================================

			router.put('/componentgroups', routes.admin.componentGroups.create);
			router.post('/componentgroups', routes.admin.componentGroups.edit);
			router.delete('/componentgroups', routes.admin.componentGroups.delete);

			// ====================================
			// REGIONS
			// ====================================

			router.get('/regions', routes.admin.regions.display);
			router.put('/regions', routes.admin.regions.create);
			router.post('/regions', routes.admin.regions.edit);
			router.delete('/regions', routes.admin.regions.delete);

			// ====================================
			// Users
			// ====================================

			router.get('/users', routes.admin.users.display);
			router.put('/users', routes.admin.users.create);
			router.post('/users', routes.admin.users.edit);
			router.delete('/users', routes.admin.users.delete);

			// ====================================
			// API
			// ====================================

			router.get('/api', routes.admin.api.display);

			return router;

		}

	};

}