//maybe the most intuitive file
var mongoose = require('mongoose');

var categorySchema = {
  _id: { type: String },
  parent: {
    type: String,
    ref: 'Category'
  },
  ancestors: [{
    type: String,
    ref: 'Category'
  }],
  synonyms: [{
    type: String,
    ref: 'Category'
  }]
};
var schema = new mongoose.Schema(categorySchema);

//needed to do a free search based on category
schema.index({ _id: 'text' });
module.exports = schema;
//schema (below) needs to be used in asset class
module.exports.categorySchema = categorySchema;
