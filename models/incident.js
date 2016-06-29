"use strict";

var modb = require('mongoose');

var incidentSchema = modb.Schema({

  summary: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  state: {
    type: String,
    default: 'open',
    required: true,
    index: true,
    enum: ['open','scheduled','closed'],
    default: 'operational'
  },
  regions: [{
    type: String,
    ref: 'Region'
  }],
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
      ref: 'Status',
      required: true
    }
  }]

},
{
  timestamps: {}
});

module.exports = modb.model('Incident', incidentSchema);