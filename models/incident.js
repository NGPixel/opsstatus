"use strict";

var _ = require('lodash');
var modb = require('mongoose');
var moment = require('moment');
var Promise = require('bluebird');
var V = require('validator-as-promised');
var Vc = require('../modules/validators');

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
  kind: {
    type: String,
    required: true,
    index: true,
    enum: ['unplanned','scheduled'],
    default: 'unplanned'
  },
  state: {
    type: String,
    required: true,
    enum: ['ok','scheduled','perfissues','partialdown','majordown'],
    default: 'ok'
  },
  currentState: {
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
      enum: ['identified','planned','investigating','update','watching','resolved'],
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
  let nUpdateStatus = (isScheduled) ? 'planned' : 'identified';
  let nRegions = JSON.parse(data.regions);
  let nTimezone = data.timezone || 'UTC';

  // Validate input data

  return Promise.all([
    V.isLengthAsync('Invalid or missing summary.', nSummary, { min: 3, max:255 }),
    V.isInAsync('Invalid incident type.', data.type, ['unplanned','scheduled']),
    V.isMongoIdAsync('Invalid component selection.', data.component),
    V.custom('At least 1 region required.', Vc.isArray, nRegions),
    V.isLengthAsync('Invalid or missing content.', data.content, 2)
  ]).then(() => {

    return db.Component.findById(data.component).then((comp) => {

      // Verify if component exists

      if(!comp) {
        throw new Error('Invalid component.');
      }

      // Set schedule properties

      let nSchedule = {};

      if(isScheduled) {
        nSchedule.plannedStartDate = moment.tz(data.schedule_planned_start + ' ' + data.schedule_planned_start_time, 'YYYY/MM/DD HH:mm', nTimezone).utc().toDate();
        nSchedule.plannedEndDate = moment.tz(data.schedule_planned_end + ' ' + data.schedule_planned_end_time, 'YYYY/MM/DD HH:mm', nTimezone).utc().toDate();
        
        if(!moment(nSchedule.plannedStartDate).isBefore(nSchedule.plannedEndDate)) {
          throw new Error('End date cannot be before Start date.');
        }

        data.componentState = 'scheduled';

      } else {
        nSchedule.actualStartDate = moment.tz(data.schedule_actual_start + ' ' + data.schedule_actual_start_time, 'YYYY/MM/DD HH:mm', nTimezone).utc().toDate();
      }

      // Verify datetime objects

      if( !_.every(nSchedule, (s) => { console.log(s); return _.isDate(s) && !_.isNaN(s.valueOf()); }) ) {
        throw new Error('Invalid or missing date/time.');
      }

      return nSchedule;

    });

  }).then((nSchedule) => {

    // Create incident

    return this.create({
      _id: db.ObjectId(),
      summary: nSummary,
      kind: data.type,
      state: data.componentState,
      currentState: nState,
      regions: nRegions,
      component: data.component,
      author: data.userId,
      schedule: nSchedule,
      updates: [{
        content: data.content,
        postedDate: moment().utc().toDate(),
        author: data.userId,
        status: nUpdateStatus
      }]
    });

  });
  
};

/**
 * MODEL - Update an incident
 *
 * @param      {Object}   data    Update content
 * @return     {Promise}  Promise of the update operation
 */
incidentSchema.statics.postUpdate = function(data) {
  return this.findById(data.id).then((inc) => {
    if(inc) {

      inc.updates.push({
        content: data.content,
        postedDate: moment().utc().toDate(),
        author: data.userId,
        status: data.state
      });

      if(data.state === 'resolved') {
        inc.schedule.actualEndDate = mome;nt().utc().toDate();
        inc.currentState = 'closed';
      } else if(data.currentState !== 'scheduled') {
        inc.currentState = 'open';
      }

      return inc.save();
    } else {
      throw new Error('Invalid Incident Id');
    }
  });
};

/**
 * MODEL - Delete an incident
 *
 * @param      {String}   incidentId  The incident identifier
 * @return     {Promise}  Promise of the delete operation
 */
incidentSchema.statics.erase = function(incidentId) {
  return this.findByIdAndRemove(incidentId);
};

module.exports = modb.model('Incident', incidentSchema);