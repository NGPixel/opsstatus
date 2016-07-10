"use strict";

var modb = require('mongoose');
var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Template schema
 *
 * @type       {<Mongoose.Schema>}
 */
var templateSchema = modb.Schema({

  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  content: {
    type: String,
    required: true,
    minlength: 1
  }

},
{
  timestamps: {}
});

/**
 * MODEL - Create a new Template
 *
 * @param      {String}   templateName     The new template name
 * @param      {String}   templateContent  Content of the new template
 * @return     {Promise}  Promise of the create operation
 */
templateSchema.statics.new = function(templateName, templateContent) {
  return this.create({
    _id: db.ObjectId(),
    name: templateName,
    content: templateContent
  });
};

/**
 * MODEL - Edit a template
 *
 * @param      {String}   templateId       The template identifier
 * @param      {String}   templateName     The template name
 * @param      {String}   templateContent  The template content
 * @return     {Promise}  Promise of the update operation
 */
templateSchema.statics.edit = function(templateId, templateName, templateContent) {
  return this.findByIdAndUpdate(templateId, { name: regionName, content: templateContent }, { runValidators: true });
};

/**
 * MODEL - Delete a template
 *
 * @param      {String}   templateId  The template identifier
 * @return     {Promise}  Promise of the delete operation
 */
templateSchema.statics.erase = function(templateId) {
  return this.findByIdAndRemove(regionId);
};

module.exports = modb.model('Template', templateSchema);