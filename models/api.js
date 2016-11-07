"use strict";

var bcrypt = require('bcryptjs-then');
var Promise = require('bluebird');

/**
 * API Schema
 *
 * @type       {Object}
 */
var apiSchema = Mongoose.Schema({

  key: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  rights: [{
    type: String,
    required: true
  }]

},
{
  timestamps: {}
});

/**
 * Generate hash from key
 *
 * @param      {string}   uPassword  The API key
 * @return     {Promise<String>}  Promise with generated hash
 */
apiSchema.methods.generateKey = function(uKey) {
    return bcrypt.hash(uKey, 10);
};

/**
 * Validate key against hash
 *
 * @param      {string}   uKey  The API key
 * @return     {Promise<Boolean>}  Promise with valid / invalid boolean
 */
apiSchema.methods.validateKey = function(uKey) {
  let self = this;
  return bcrypt.compare(uKey, self.key);
};

module.exports = Mongoose.model('Api', apiSchema);
