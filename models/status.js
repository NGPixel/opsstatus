"use strict";

var modb = require('mongoose');

var statusSchema = modb.Schema({

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
  }

},
{
  timestamps: {}
});

module.exports = modb.model('Status', statusSchema);