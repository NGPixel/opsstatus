"use strict";

var bcrypt = require('bcryptjs-then');
var Promise = require('bluebird');
var _ = require('lodash');

/**
 * User Schema
 *
 * @type       {Object}
 */
var userSchema = Mongoose.Schema({

  email: {
    type: String,
    required: true,
    index: true,
    minlength: 6
  },
  provider: {
		type: String,
		required: true
	},
	providerId: {
		type: String
	},
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC'
  },
  lang: {
    type: String,
    required: true,
    default: 'en'
  },
  rights: [{
		role: String,
		path: String,
		exact: Boolean,
		deny: Boolean
	}]

},
{
  timestamps: {}
});

/**
 * VIRTUAL - Full Name
 */
userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.statics.processProfile = (profile) => {

	let primaryEmail = '';
	if(_.isArray(profile.emails)) {
		let e = _.find(profile.emails, ['primary', true]);
		primaryEmail = (e) ? e.value : _.first(profile.emails).value;
	} else if(_.isString(profile.email) && profile.email.length > 5) {
		primaryEmail = profile.email;
	} else {
		return Promise.reject(new Error('Invalid User Email'));
	}

	return db.User.findOneAndUpdate({
		email: primaryEmail,
		provider: profile.provider
	}, {
		email: primaryEmail,
		provider: profile.provider,
		providerId: profile.id,
		firstName: profile.displayName
	}, {
		new: true,
		upsert: true
	}).then((user) => {
	  return (user) ? user : Promise.reject(new Error('User Upsert failed.'));
	});

};

/**
 * MODEL - Generate hash from password
 *
 * @param      {string}   uPassword  The user password
 * @return     {Promise<String>}  Promise with generated hash
 */
userSchema.statics.hashPassword = function(uPassword) {
    return bcrypt.hash(uPassword, 10);
};

/**
 * INSTANCE - Validate password against hash
 *
 * @param      {string}   uPassword  The user password
 * @return     {Promise<Boolean>}  Promise with valid / invalid boolean
 */
userSchema.methods.validatePassword = function(uPassword) {
  let self = this;
  return bcrypt.compare(uPassword, self.password);
};

/**
 * MODEL - Create a new user
 *
 * @param      {Object}   nUserData  User data
 * @return     {Promise}  Promise of the create operation
 */
userSchema.statics.new = function(nUserData) {

  let self = this;

  return self.hashPassword(nUserData.password).then((passhash) => {
    return this.create({
      _id: db.ObjectId(),
      email: nUserData.email,
      provider: 'local',
      firstName: nUserData.firstName,
      lastName: nUserData.lastName,
      password: passhash,
      rights: [{
      	role: 'admin',
				path: '/',
				exact: false,
				deny: false
      }]
    });
  });

};

/**
 * MODEL - Edit a user
 *
 * @param      {String}   userId  The user identifier
 * @param      {Object}   data    The user data
 * @return     {Promise}  Promise of the update operation
 */
userSchema.statics.edit = function(userId, data) {

  let self = this;

  // Change basic info

  let fdata = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    timezone: data.timezone,
    lang: data.lang,
    rights: data.rights
  };
  let waitTask = null;

  // Change password?

  if(!_.isEmpty(data.password) && _.trim(data.password) !== '********') {
    waitTask = self.hashPassword(data.password).then((passhash) => {
      fdata.password = passhash;
      return fdata;
    });
  } else {
    waitTask = Promise.resolve(fdata);
  }

  // Update user

  return waitTask.then((udata) => {
    return this.findByIdAndUpdate(userId, udata, { runValidators: true });
  });

};

/**
 * MODEL - Delete a user
 *
 * @param      {String}   userId  The user ID
 * @return     {Promise}  Promise of the delete operation
 */
userSchema.statics.erase = function(userId) {
  return this.findByIdAndRemove(userId);
};

module.exports = Mongoose.model('User', userSchema);
