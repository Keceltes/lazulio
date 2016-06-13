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

module.exports = function (wagner) {
    var api = express.Router();
    
    api.use(bodyparser.json());
    /* User API */
    api.get('/user/:id', wagner.invoke(function (User) {
        return function (req, res) {
            console.log('user id - ' + req.params.id);
            User.
        findOne({ username: req.params.id }).
        //populate({ path: 'interestedAssets.asset', model: 'Asset'}).
      exec(handleOne.bind(null, 'user', res));
        };
    }));
    api.get('/userfull/:id', wagner.invoke(function (User) {
        return function (req, res) {
            console.log('user id - ' + req.params.id);
            User.
        findOne({ username: req.params.id }).
        populate({ path: 'interestedAssets.asset', model: 'Asset'}).
      exec(handleOne.bind(null, 'user', res));
        };
    }));
    api.put('/user/save', wagner.invoke(function (User) {
        return function (req, res) {
            console.log('saving new user - ' + req.body.profile.user_id);
            var user = new User({
                username: req.body.profile.user_id
            });
            user.save(function (error, user) {
                if (error) {
                    console.log(error.toString());
                    return res.
                      status(status.INTERNAL_SERVER_ERROR).
                      json({ error: error.toString() });
                }
                return res.json({ user: user });
            });
        };
    }));
    /*User Cart API */
    api.put('/save/cart', wagner.invoke(function (User) {
        return function (req, res) {
            console.log('req body: ' + JSON.stringify(req.body));
            User.update({ username: req.body.username },
            {
                interestedAssets: req.body.interestedAssets,
                interestedSearches: req.body.interestedSearches,
                interestedTags: req.body.interestedTags
            },
             { upsert: true },
             function (err, numAffected) {
                console.log('num affected: ' + JSON.stringify(numAffected));
                console.log('any errors?: ' + JSON.stringify(err));
                return res.json();
            }
            );
        };
    }));
    
    /*api.get('/me', function (req, res) {
        if (!req.user) {
            return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
        }
        
        req.user.populate({ path: 'data.interestedAssets', model: 'Asset' }, handleOne.bind(null, 'user', res));
    });*/
    
    /* Category API */
    api.put('/category/delete/:id', wagner.invoke(function (Category) {
        return function (req, res) {
            console.log('server side category delete called');
            console.log(JSON.stringify(req.params));
            
            Category.remove({ _id: req.params.id }, function (err) {
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
    api.put('/category/save', wagner.invoke(function (Category) {
        return function (req, res) {
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
            category.save(function (error, category) {
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
    api.get('/category/all', wagner.invoke(function (Category) {
        return function (req, res) {
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
    api.put('/asset/save', wagner.invoke(function (Asset) {
        return function (req, res) {
            console.log('server side asset save called');
            Asset.update({ name: req.body.name },
            {
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
                tags: (req.body.tags == undefined) ? undefined : req.body.tags.split(','),
                updatedAt: Date()
            },
             { upsert: true },
             function (err, numAffected) {
                console.log('num affected: ' + JSON.stringify(numAffected));
                console.log('any errors?: ' + JSON.stringify(err));
                return res.json();
            });
        };
    }));

    api.get('/asset/popular', wagner.invoke(function (Asset) {
        return function (req, res) {
            Asset.
        find().
        sort({ viewCount: -1 }).
        limit(6).
        exec(handleMany.bind(null, 'assets', res));
        };
    }));
    api.put('/asset/followed', wagner.invoke(function (Asset) {
        return function (req, res) {
            Asset.
                find({ tags: { $in: req.body.interestedTags } }).
                sort({ _id: -1 }). 
                limit(6).
                exec(handleMany.bind(null, 'assets', res));
                };
    }));
    api.put('/asset/updated', wagner.invoke(function (Asset) {
        return function (req, res) {
            var assetIds = [];
            for (var i = 0; i < req.body.interestedAssets.length; i++) {
                assetIds.push(req.body.interestedAssets[i].asset);
            }
            console.log(assetIds);
            Asset.
                find({ _id: { $in: assetIds } }).
                sort({ updatedAt: -1 }).//interesting!  ID is the timestamp ...
                limit(6).
                exec(handleMany.bind(null, 'assets', res));
                };
    }));
    api.get('/search/:text', wagner.invoke(function (Search) {
        return function (req, res) {
            console.log('searching by id, increasing view count: ' + req.params.text);
            Search.findOneAndUpdate({ name: req.params.text }, 
                { $inc: { viewCount: 1 } },
            { new: true, upsert: true },
            function (err, search) {
                console.log('obj: ' + JSON.stringify(search));
                console.log('any errors?: ' + JSON.stringify(err));
                return res.json({ search: search });
            });
        };
    }));
    api.get('/asset/byText/:text', wagner.invoke(function (Asset) {
        return function (req, res) {
            //var sort = { _id: 1 };
            Asset.
      find({ $text: { $search: req.params.text } }
          , { score: { $meta: "textScore" } })
          .sort({ score: { $meta: "textScore" } }).
      exec(handleMany.bind(null, 'assets', res));
        };
    }));
    api.get('/asset/byTag/or/:ids', wagner.invoke(function (Asset) {
        return function (req, res) {
            if (req.params.ids[0] != '0') {
                console.log(req.params.ids);
                var searchTags = req.params.ids.split('+');
                //var sort = { _id: 1 };
                Asset.
        //find({ tags: { $all: searchTags } }).//all values in array searchTags must match
        find({ tags: { $in: searchTags } }).//at least 1 value in array searchTags must match
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
    api.get('/asset/byTag/and/:ids', wagner.invoke(function (Asset) {
        return function (req, res) {
            if (req.params.ids[0] != '0') {
                console.log(req.params.ids);
                var searchTags = req.params.ids.split('+');
                //var sort = { _id: 1 };
                Asset.
        find({ tags: { $all: searchTags } }).//all values in array searchTags must match
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
    api.get('/asset/id/:id', wagner.invoke(function (Asset) {
        return function (req, res) {
            console.log('searching by id, increasing view count: ' + req.params.id);
            Asset.findByIdAndUpdate(req.params.id, 
                { $inc: { viewCount: 1 } },
            { new: true },
            function (err, asset) {
                console.log('obj: ' + JSON.stringify(asset));
                console.log('any errors?: ' + JSON.stringify(err));
                return res.json({ asset: asset});
            });
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
