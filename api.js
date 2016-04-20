//what is this for?  do we need it?  Seems like the REST API
//can be get, put, post
//2 get API for category (findOne by id, find by parent)
//2 get API for product (findOne by id, find by category ancestors)
//2 put, get API for user (put or update: replace cart with new cart, get: likely get user cart)
//1 post for Stripe (post or insert: likely to conduct transaction)
//1 get for Text search (matches to MongoDB Text Search tutorial)
//called by index.js
//seems more like a model-side controller for doing specific CRUD
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
    
  /* Category API */
  api.put('/category/save', wagner.invoke(function(Category) {
    return function(req, res) {
      console.log('server side category save called');
      console.log(JSON.stringify(req.body));
      var category = new Category({
        _id: req.body._id,
        parent: req.body.parent,
        ancestors: req.body.ancestors,
        synonyms: req.body.synonyms
      });
      console.log(category);
      category.save(function(error, category) {
        if (error) {
          console.log(error.toString());
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: error.toString() });
        }
        return res.json({ category: category });
      });
    };
  }));

  api.get('/category/all', wagner.invoke(function(Category) {
    return function(req, res) {
      var sort = { _id: 1 };
      Category.
      find().
      sort(sort).
      exec(handleMany.bind(null, 'categories', res));
    };
  }));

  return api;
};

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}

function handleMany(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
