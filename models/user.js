//maybe the most intuitive file
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  //profile: {
    username: {
      type: String,
      required: true
    },
    /*picture: {
      type: String,
      required: true,
      match: /^http:\/\//i
    }
  },
  data: {
    oauth: { type: String, required: true },*/
    interestedTags: [{
      type: String
    }],
    interestedAssets: [{
      asset: {
        type: mongoose.Schema.Types.ObjectId
      }
    }]
  //}
});

//not sure what .set means, Google didn't help much
module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
