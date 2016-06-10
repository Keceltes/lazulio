//maybe the most intuitive file
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    search: {
        type: String,
        required: true
    },
    viewCount: { type: Number, default: 0 }
});

//not sure what .set means, Google didn't help much
module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
