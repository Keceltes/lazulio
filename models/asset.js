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
    tags: [{ type: String }],
    viewCount: { type: Number },
    //createdAt    : { type: Date, default: Date() }, //uses _id now
    updatedAt    : { type: Date }
});

//needed to do a free search based on category
schema.index({ name: 'text' });
schema.index({ category: 'text' });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;