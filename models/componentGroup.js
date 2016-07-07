"use strict";

var modb = require('mongoose');
var _ = require('lodash');

var componentGroupSchema = modb.Schema({

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
  }

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

module.exports = modb.model('ComponentGroup', componentGroupSchema);