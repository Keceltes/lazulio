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
  api.put('/category/delete/:id', wagner.invoke(function(Category) {
    return function(req, res) {
      console.log('server side category delete called');
      console.log(JSON.stringify(req.params));

      Category.remove({ _id: req.params.id }, function(err) {
        if (!err) {
          console.log('deleted successfully');
          return;
        }
        else {
          console.log(error.toString());
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: error.toString() });
        }
      });
    };
  }));
  api.put('/category/save', wagner.invoke(function(Category) {
    return function(req, res) {
      console.log('server side category save called');
      console.log(JSON.stringify(req.body));

      //var category = Object.create(Category, req.body);
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
      //var sort = { _id: 1 };
      Category.
      find().
      //sort({parent: 1}).
      exec(handleMany.bind(null, 'categories', res));
    };
    }));
    
    api.get('/category/byText/:text', wagner.invoke(function (Category) {
        return function (req, res) {
            console.log('search text - ' + req.params.text);
            Category.
        find(
                { $text : { $search : req.params.text } },
          { score : { $meta: 'textScore' } }).
        sort({ score: { $meta : 'textScore' } }).
      exec(handleMany.bind(null, 'categories', res));
        };
    }));

  /*asset API*/
  api.put('/asset/save', wagner.invoke(function(Asset) {
    return function(req, res) {
      console.log('server side asset save called');
      console.log(JSON.stringify(req.body));
      console.log(req.body.tags.split(','));
      var asset = new Asset({
        //_id: req.body._id,
        name: req.body.name,
        description: req.body.description,
        organization: req.body.organization,
        market: req.body.market,
        ipStatus: req.body.ipStatus,
        problem: req.body.problem,
        solution: req.body.solution,
        application: req.body.application,
        advantages: req.body.advantages,
        lookingFor: req.body.lookingFor,
        contact: req.body.contact,
        pictures: req.body.pictures,
        tags: req.body.tags.split(',')
      });
      console.log(asset);
      asset.save(function(error, asset) {
        if (error) {
          console.log(error.toString());
          return res.
          status(status.INTERNAL_SERVER_ERROR).
          json({ error: error.toString() });
        }
        return res.json({ asset: asset });
      });
    };
  }));
  api.get('/asset/byTag/:ids', wagner.invoke(function(Asset) {
    return function(req, res) {
      if(req.params.ids[0] != '0')
      {
        console.log(req.params.ids);
        var searchTags = req.params.ids.split('+');
        //var sort = { _id: 1 };
        Asset.
        find({ tags: {$all: searchTags} }). //all values in array searchTags must match
        //find({ tags: {$in: searchTags} }). //at least 1 value in array searchTags must match
        //sort(sort).
        exec(handleMany.bind(null, 'assets', res));
      }
      else {
        console.log('none');
        Asset.
        find(). 
        exec(handleMany.bind(null, 'assets', res));
      }
    };
    }));
    api.get('/asset/popular', wagner.invoke(function (Asset) {
        return function (req, res) {
        Asset.
        find().
        sort({ viewCount: -1 }).
        limit(5).
        exec(handleMany.bind(null, 'assets', res));
        };
    }));
  api.get('/asset/byText/:text', wagner.invoke(function(Asset) {
    return function(req, res) {
      //var sort = { _id: 1 };
      Asset.
      find({ $text: { $search: req.params.text } }
          , { score: { $meta: "textScore" } })
          .sort({ score: { $meta: "textScore" } }).
      exec(handleMany.bind(null, 'assets', res));
    };
  }));
  api.get('/asset/id/:id', wagner.invoke(function(Asset) {
    return function(req, res) {
      Asset.
      findOne( {_id: req.params.id}).
      //sort(sort).
      exec(handleOne.bind(null, 'asset', res));
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
