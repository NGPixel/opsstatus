"use strict";

var modb = require('mongoose');

var regionSchema = modb.Schema({

  _id: String,

  // Fields

  name: {
    type: String,
    required: true
  },
  shortName: {
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

module.exports = modb.model('Region', regionSchema);