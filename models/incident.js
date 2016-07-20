"use strict";

var _ = require('lodash');
var modb = require('mongoose');
var moment = require('moment');
var Promise = require('bluebird');

/**
 * Incident Schema
 *
 * @type       {Object}
 */
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

/**
 * MODEL - Create a new incident
 *
 * @param      {Object}   data    Data of the new incident
 * @return     {Promise}  Promise of the create operation
 */
incidentSchema.statics.new = function(data) {

  let isScheduled = data.type === 'scheduled';
  let nSummary = _.trim(data.summary);
  let nState = (isScheduled) ? 'scheduled' : 'open';
  let nRegions = JSON.parse(data.regions);

  return db.Component.findById(data.component).then((comp) => {

    // Verify component

    if(!comp) {
      throw new Error('Invalid component');
    }

    // Verify regions

    if(!_.isArray(nRegions) || nRegions.length < 1) {
      throw new Error('Invalid regions set.');
    }

    // Set schedule properties

    let nSchedule = {};

    if(isScheduled) {
      nSchedule.plannedStartDate = moment.utc(data.schedule_planned_start + ' ' + data.schedule_planned_start_time, 'YYYY/MM/DD HH:mm').toDate();
      nSchedule.plannedEndDate = moment.utc(data.schedule_planned_end + ' ' + data.schedule_planned_end_time, 'YYYY/MM/DD HH:mm').toDate();
      data.componentState = 'scheduled';
    } else {
      nSchedule.actualStartDate = moment.utc(data.schedule_actual_start + ' ' + data.schedule_actual_start_time, 'YYYY/MM/DD HH:mm').toDate();
    }

    // Verify datetime objects

    if( !_.every(nSchedule, (s) => { return _.isDate(s); }) ) {
      throw new Error('Invalid date/time.');
    }

    return nSchedule;

  }).then((nSchedule) => {

    // Create incident

    return this.create({
      _id: db.ObjectId(),
      summary: nSummary,
      state: nState,
      regions: nRegions,
      component: data.component,
      author: data.userId,
      schedule: nSchedule,
      updates: [{
        summary: nSummary,
        content: data.content,
        postedDate: moment().utc().toDate(),
        author: data.userId,
        status: 'Identified'
      }]
    });

  }).then((nInc) => {

    // Change component state

    if(data.componentState !== 'unchanged') {
      return db.Component.findByIdAndUpdate(data.component, {
        state: data.componentState
      }, {
        runValidators: true
      });
    }
    
    return nInc;

  });
  
};

module.exports = modb.model('Incident', incidentSchema);