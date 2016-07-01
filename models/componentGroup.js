"use strict";

var modb = require('mongoose');

var componentGroupSchema = modb.Schema({

  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
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

module.exports = modb.model('ComponentGroup', componentGroupSchema);