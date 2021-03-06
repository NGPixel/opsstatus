"use strict";

var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Component Group Schema
 *
 * @type       {Object}
 */
var componentGroupSchema = Mongoose.Schema({

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  shortName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20
  },
  sortIndex: {
    type: Number,
    default: 0,
    required: true
  },
  components: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Component'
  }]

},
{
  timestamps: {}
});

/**
 * MODEL - Create a new component group
 *
 * @param      {String}   compgrpName       Name of the component group
 * @param      {String}   compgrpShortName  Short Name of the component group
 * @return     {Promise}  Promise of the create operation
 */
componentGroupSchema.statics.new = function(compgrpName, compgrpShortName) {

  return this.create({
    _id: db.ObjectId(),
    name: _.trim(compgrpName),
    shortName: _.trim(compgrpShortName),
    sortIndex: 0
  });

};

/**
 * MODEL - Re-order the component groups
 *
 * @param      {Array[String]}  newOrder  Array of the new groups sort order,
 *                                        using IDs
 * @return     {Promise}        Promise of all update operations
 */
componentGroupSchema.statics.reorder = function(newOrder) {
  return this.find().then((groups) => {
    let queries = [];
    _.forEach(groups, (group) => {
      let newIdx = _.indexOf(newOrder, group._id.toString());
      newIdx = (newIdx > 0) ? newIdx : 0;
      if(group.sortIndex !== newIdx) {
        group.sortIndex = newIdx;
        queries.push(group.save());
      }
    });
    return (queries.length > 0) ? Promise.all(queries) : Promise.resolve(true);
  });
};

/**
 * MODEL - Edit a component group
 *
 * @param      {String}   groupId         The component group identifier
 * @param      {String}   groupName       The new component group name
 * @param      {String}   groupShortName  The new component group short name
 * @return     {Promise}  Promise of the update operation
 */
componentGroupSchema.statics.edit = function(groupId, groupName, groupShortName) {
  return this.findByIdAndUpdate(db.ObjectId(groupId), {
    name: groupName,
    shortName: groupShortName
  }, { runValidators: true });
};

/**
 * MODEL - Delete a component group
 *
 * @param      {String}   groupId  The component group identifier
 * @return     {Promise}  Promise of the delete operation
 */
componentGroupSchema.statics.erase = function(groupId) {
  return Promise.all([
    this.findByIdAndRemove(groupId),
    db.Component.update({ group: db.ObjectId(groupId) },{ group: null }, { multi: true })
  ]).then(() => {
    return this.refresh();
  });
};

module.exports = Mongoose.model('ComponentGroup', componentGroupSchema);
