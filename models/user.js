"use strict";

var modb = require('mongoose');
var bcrypt = require('bcryptjs-then');
var Promise = require('bluebird');

/**
 * User Schema
 *
 * @type       {Object}
 */
var userSchema = modb.Schema({

  email: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  }

},
{
  timestamps: {}
});

/**
 * Generate hash from password
 *
 * @param      {string}   uPassword  The user password
 * @return     {Promise<String>}  Promise with generated hash
 */
userSchema.methods.generateHash = function(uPassword) {
    return bcrypt.hash(uPassword, 10);
};

/**
 * Validate password against hash
 *
 * @param      {string}   uPassword  The user password
 * @return     {Promise<Boolean>}  Promise with valid / invalid boolean
 */
userSchema.methods.validatePassword = function(uPassword) {
  let self = this;
  return bcrypt.compare(uPassword, self.password);
};

module.exports = modb.model('User', userSchema);