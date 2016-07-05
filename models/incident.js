"use strict";

var modb = require('mongoose');

var incidentSchema = modb.Schema({

  summary: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    index: true,
    enum: ['open','scheduled','closed'],
    default: 'open'
  },
  regions: [{
    type: String,
    ref: 'Region'
  }],
  component: {
    type: modb.Schema.Types.ObjectId,
    ref: 'Component',
    required: true
  },
  author: {
    type: modb.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schedule: {
    plannedStartDate: {
      type: Date
    },
    plannedEndDate: {
      type: Date
    },
    actualStartDate: {
      type: Date
    },
    actualEndDate: {
      type: Date
    }
  },
  updates: [{
    summary: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    postedDate: {
      type: Date,
      required: true
    },
    author: {
      type: modb.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      required: true
    }
  }]

},
{
  timestamps: {}
});

module.exports = modb.model('Incident', incidentSchema);