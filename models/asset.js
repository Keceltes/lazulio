var Category = require('./category');
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String, required: true},
    // Pictures must start with "http://"
    pictures: [{type: String, match: /^http:\/\//i}],
    price: {
      amount: {
        type: Number,
        required: true,
        set: function (v) {
          this.internal.approximatePriceUSD =
              v / (fx()[this.price.currency] || 1);
          return v;
        }
      },
      // Only 3 supported currencies for now
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        required: true,
        set: function (v) {
          this.internal.approximatePriceUSD =
              this.price.amount / (fx()[v] || 1);
          return v;
        }
      }
    },
    category: Category.categorySchema,
    internal: {
      approximatePriceUSD: Number
    }
});

schema.index({ name: 'text' });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

module.exports = schema;