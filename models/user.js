"use strict";

var bcrypt = require('bcryptjs-then');
var Promise = require('bluebird');
var _ = require('lodash');

/**
 * User Rights Schema
 *
 * @type       {Mongoose}
 */
const rightsSchema = new Mongoose.Schema({
  role: {
    type: String,
    default: 'guest'
  },
  path: {
    type: String,
    default: '/'
  },
  exact: {
    type: Boolean,
    default: false
  },
  deny: {
    type: Boolean,
    default: false
  }
});

/**
 * User Schema
 *
 * @type       {Mongoose}
 */
var userSchema = new Mongoose.Schema({

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
    type: String
  },
  name: {
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
  rights: {
    type: [rightsSchema],
    required: true
  }

},
{
  timestamps: {}
});

/**
 * MODEL - Process Social Authentication User Profile
 *
 * @param      {Object}   profile  The profile
 * @return     {Promise}  Promise returning the user object
 */
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

	return db.User.findOne({
		email: primaryEmail,
		provider: profile.provider
	}).then((user) => {
    return (user) ? user : Promise.reject(new Error('Unauthorized Access.'));
  }).then((user) => {
  	user.providerId = profile.id
  	if(_.isEmpty(user.name)) {
  		user.name = profile.displayName;
  	}
  	return user.save();
  }).then((user) => {
	  return (user) ? user : Promise.reject(new Error('User Social Authentication failed.'));
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
      name: nUserData.name,
      password: passhash,
      rights: [{
      	role: 'user',
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
    name: data.name,
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
