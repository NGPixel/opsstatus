"use strict";

var modb = require('mongoose');
var _ = require('lodash');

/**
 * Component Schema
 *
 * @type       {Object}
 */
var componentSchema = modb.Schema({

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  description: {
    type: String,
    required: true,
    minlength: 2
  },
  sortIndex: {
    type: Number,
    default: 0,
    required: true
  },
  state: {
    type: String,
    required: true,
    enum: ['operational','performance-issues','partial-outage','major-outage'],
    default: 'operational'
  },
  group: {
    type: modb.Schema.Types.ObjectId,
    ref: 'ComponentGroup'
  }

},
{
  timestamps: {}
});

/**
 * MODEL - Create a new component
 *
 * @param      {String}   compName         Name of the component
 * @param      {String}   compDescription  Description of the component
 * @return     {Promise}  Promise of the create operation
 */
componentSchema.statics.new = function(compName, compDescription) {

  return this.create({
    _id: db.ObjectId(),
    name: _.trim(compName),
    description: _.trim(compDescription),
    sortIndex: 0,
    state: 'operational',
    group: null
  });
  
};

module.exports = modb.model('Component', componentSchema);