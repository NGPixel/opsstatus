"use strict";

var modb = require('mongoose');
var _ = require('lodash');
var slug = require('slug');
var Promise = require('bluebird');

/**
 * Region schema
 *
 * @type       {<Mongoose.Schema>}
 */
var regionSchema = modb.Schema({

  _id: String,

  name: {
    type: String,
    required: true,
    minlength: 2
  },
  sortIndex: {
    type: Number,
    default: 0,
    required: true,
    min: 0
  }

},
{
  timestamps: {}
});

/**
 * MODEL - Create a new region
 *
 * @param      {String}   regionName  The new region name
 * @return     {Promise}  Promise of the create operation
 */
regionSchema.statics.new = function(regionName) {
  return this.create({
    _id: slug(regionName, { lower: true }),
    name: regionName,
    sortIndex: 0
  });
};

/**
 * MODEL - Re-order the regions
 *
 * @param      {Array[String]}  newOrder  Array of the new region sort order,
 *                                        using IDs
 * @return     {Promise}        Promise of all update operations
 */
regionSchema.statics.reorder = function(newOrder) {
  return this.find().then((regions) => {
    let queries = [];
    _.forEach(regions, (region) => {
      let newIdx = _.indexOf(newOrder, region._id);
      newIdx = (newIdx > 0) ? newIdx : 0;
      if(region.sortIndex != newIdx) {
        region.sortIndex = newIdx;
        queries.push(region.save());
      }
    });
    return (queries.length > 0) ? Promise.all(queries) : Promise.resolve(true);
  });
};

/**
 * MODEL - Edit the name of a region
 *
 * @param      {String}  regionId    The region identifier
 * @param      {String}  regionName  The new region name
 * @return     {Promise}  Promise of the update operation
 */
regionSchema.statics.editname = function(regionId, regionName) {
  return this.findByIdAndUpdate(regionId, { name: regionName }, { runValidators: true });
};

/**
 * MODEL - Delete a region
 *
 * @param      {String}   regionName  The region identifier
 * @return     {Promise}  Promise of the delete operation
 */
regionSchema.statics.delete = function(regionId) {
  return this.findByIdAndRemove(regionId);
};

module.exports = modb.model('Region', regionSchema);