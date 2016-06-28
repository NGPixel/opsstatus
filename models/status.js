"use strict";

var modb = require('mongoose');

var statusSchema = modb.Schema({

  _id: String,

  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  sortIndex: {
    type: Number,
    default: 0,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }

},
{
  timestamps: {}
});

module.exports = modb.model('Status', statusSchema);