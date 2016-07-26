"use strict";

var modb = require('mongoose');
var _ = require('lodash');
var modb_delete = require('mongoose-delete');

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
    enum: ['ok','scheduled','perfissues','partialdown','majordown'],
    default: 'ok'
  },
  group: {
    type: modb.Schema.Types.ObjectId,
    ref: 'ComponentGroup'
  }

},
{
  timestamps: {}
});

componentSchema.plugin(modb_delete, { deletedAt : true, overrideMethods: true });

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
    state: 'ok',
    group: null
  });
  
};

/**
 * MODEL - Re-order the components
 *
 * @param      {Array[String]}  newOrder  Array of the new components sort
 *                                        order, using IDs
 * @return     {Promise}        Promise of all update operations
 */
componentSchema.statics.reorder = function(newOrder) {
  return this.find().then((comps) => {

    let queries = [];

    // Map group to components

    let groupRefs = {};
    _.forOwn(newOrder, (val, key) => {
      _.forEach(val, (c) => {
        groupRefs[c] = key;
      });
    });

    // Update component with group and sort index

    _.forEach(comps, (comp) => {

      let curCompId = comp.id;
      let curGroupId = (_.isNull(comp.group)) ? null : comp.group.toString();

      // Is component in a group?

      if(_.has(groupRefs, curCompId)) {

        let isModified = false;

        // Update group assignment

        if(curGroupId !== groupRefs[curCompId]) {
          comp.group = db.ObjectId(groupRefs[curCompId]);
          isModified = true;
        }

        // Update sort index of component within group

        let newIdx = _.indexOf(newOrder[groupRefs[curCompId]], curCompId);
        newIdx = (newIdx > 0) ? newIdx : 0;

        if(comp.sortIndex !== newIdx) {
          comp.sortIndex = newIdx;
          isModified = true;
        }

        // Save modifications
        
        if(isModified) {
          queries.push(comp.save());
        }

      }

    });

    return (queries.length > 0) ? Promise.all(queries) : Promise.resolve(true);

  });
};

/**
 * MODEL - Edit a component
 *
 * @param      {String}   compId           The component identifier
 * @param      {String}   compName         The new component name
 * @param      {<type>}   compDescription  The new component description
 * @return     {Promise}  Promise of the update operation
 */
componentSchema.statics.edit = function(compId, compName, compDescription) {
  return this.findByIdAndUpdate(db.ObjectId(compId), {
    name: compName,
    description: compDescription
  }, { runValidators: true });
};

/**
 * MODEL - Delete a component
 *
 * @param      {String}   compId  The component identifier
 * @return     {Promise}  Promise of the delete operation
 */
componentSchema.statics.erase = function(compId) {
  return this.findById(db.ObjectId(compId)).then((c) => {
    return c.delete();
  });
};

/**
 * MODEL - Refresh the cache
 *
 * @return     {Boolean}  True on success
 */
componentSchema.statics.refresh = function() {
  return this.find().lean().exec().then((c) => {
    return red.set('ops:components', JSON.stringify(c));
  });
};

module.exports = modb.model('Component', componentSchema);