"use strict";

var modb = require('mongoose');

var componentSchema = modb.Schema({

  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  link: {
    type: String
  },
  sortIndex: {
    type: Number,
    default: 0,
    required: true
  },
  icon: {
    type: String,
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

module.exports = modb.model('Component', componentSchema);