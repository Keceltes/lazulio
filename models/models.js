var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  //set up to connect to db
  mongoose.connect('mongodb://test:test@ds011251.mlab.com:11251/lazuliodb');

  //set up mongoose db with wagner?
  wagner.factory('db', function() {
    return mongoose;
  });

  //normal method of created a model with mongoose and a schema
  var Category =
    mongoose.model('Category', require('./category'), 'categories');
  var User =
    mongoose.model('User', require('./user'), 'users');
  var Asset =
      mongoose.model('Asset', require('./asset'), 'assets');


  //a JSON structure of the models
  //is returned out of function
  var models = {
    Category: Category,
    User: User,
    Asset: Asset
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  //do dryness for product separately, why is it not part of models?  why is products set up to return a model while category and user are schemas?
  //wagner.factory('Product', require('./product'));

  return models;
};

