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
			// INCIDENTS
			// ====================================

			router.get('/incidents', routes.admin.incidents.display);
			router.get('/incidents/create', routes.admin.incidents.displayCreate);
			router.get('/incidents/edit/:id', routes.admin.incidents.displayEdit);
			router.get('/incidents/update/:id', routes.admin.incidents.displayUpdate);
			router.put('/incidents', routes.admin.incidents.create);
			router.post('/incidents', routes.admin.incidents.edit);
			router.delete('/incidents', routes.admin.incidents.delete);

			// ====================================
			// TEMPLATES
			// ====================================

			router.get('/templates', routes.admin.templates.display);
			router.get('/templates/:id', routes.admin.templates.displayEdit);
			router.put('/templates', routes.admin.templates.create);
			router.post('/templates', routes.admin.templates.edit);
			router.delete('/templates', routes.admin.templates.delete);

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
			// Metrics
			// ====================================

			router.get('/metrics', routes.admin.metrics.display);
			router.get('/metrics/create', routes.admin.metrics.displayCreate);

			// ====================================
			// Monitors
			// ====================================

			router.get('/monitors', routes.admin.monitors.display);
			router.put('/monitors', routes.admin.monitors.create);
			router.post('/monitors', routes.admin.monitors.edit);
			router.delete('/monitors', routes.admin.monitors.delete);

			// ====================================
			// Users
			// ====================================

			router.get('/users', routes.admin.users.display);
			router.get('/users/:id', routes.admin.users.displayEdit);
			router.put('/users', routes.admin.users.create);
			router.post('/users', routes.admin.users.edit);
			router.delete('/users', routes.admin.users.delete);

			// ====================================
			// Subscribers
			// ====================================

			router.get('/subscribers', routes.admin.subscribers.display);

			// ====================================
			// API
			// ====================================

			router.get('/api', routes.admin.api.display);

			// ====================================
			// Settings
			// ====================================

			router.get('/settings', routes.admin.settings.display);

			return router;

		}

	};

};