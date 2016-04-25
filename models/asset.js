var Category = require('./category');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    organization: {type: String},
    market: {type: String},
    ipStatus: {type: String},
    problem: {type: String},
    solution: {type: String},
    application: {type: String},
    advantages: {type: String},
    lookingFor: {type: String},
    contact: {type: String},
    // Pictures must start with "http://"
    pictures: [{type: String, match: /^http:\/\//i}],
    tags: [{type: String}]
});

schema.index({ name: 'text' });
schema.index({ category: 'text' });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;