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
  api.get('/category/id/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.findOne({ _id: req.params.id }, function(error, category) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        if (!category) {
          return res.
            status(status.NOT_FOUND).
            json({ error: 'Not found' });
        }
        res.json({ category: category });
      });
    };
  }));

  api.get('/category/parent/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.
        find({ parent: req.params.id }).
        sort({ _id: 1 }).
        exec(function(error, categories) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ categories: categories });
        });
    };
  }));

  /* Product API */
  api.get('/asset/id/:id', wagner.invoke(function(Asset) {
    return function(req, res) {
      Asset.findOne({ _id: req.params.id },
        handleOne.bind(null, 'asset', res));
    };
  }));

  api.get('/asset/category/:id', wagner.invoke(function(Asset) {
    return function(req, res) {
      var sort = { name: 1 };
      /*if (req.query.price === "1") {
        sort = { 'internal.approximatePriceUSD': 1 };
      } else if (req.query.price === "-1") {
        sort = { 'internal.approximatePriceUSD': -1 };
      }*/

      Asset.
        find({ 'category.ancestors': req.params.id }).
        sort(sort).
        exec(handleMany.bind(null, 'assets', res));
    };
  }));

  /* User API */
  api.put('/me/cart', wagner.invoke(function(User) {
    return function(req, res) {
      try {
        var cart = req.body.data.cart;
      } catch(e) {
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }

      req.user.data.cart = cart;
      req.user.save(function(error, user) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json({ user: user });
      });
    };
  }));

  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }

    req.user.populate({ path: 'data.cart.asset', model: 'Asset' }, handleOne.bind(null, 'user', res));
  });


  /* text search API */
  api.get('/asset/text/:query', wagner.invoke(function(Asset) {
    return function(req, res) {
      Asset.
        find(
          { $text : { $search : req.params.query } },
          { score : { $meta: 'textScore' } }).
        sort({ score: { $meta : 'textScore' } }).
        limit(10).
        exec(handleMany.bind(null, 'assets', res));
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
