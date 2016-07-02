"use strict";

var Promise = require('bluebird'),
	moment = require('moment-timezone');

/**
 * Authentication middleware
 *
 * @param      {Express Request}   req     Express Request object
 * @param      {Express Response}  res     Express Response object
 * @param      {Function}          next    Next callback function
 * @return     {any}               void
 */
module.exports = (req, res, next) => {

	// Is user authenticated ?

	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	// Set i18n locale

	/*req.i18n.changeLanguage(UserData.getLang(req.user.locale));
	res.locals.usrtime = moment();
	res.locals.usrtime.tz(UserData.getTimezone(req.user.timezone));
	res.locals.usrtime.locale(req.user.locale);*/

	// Expose user data

	res.locals.user = req.user;

	return next();

};