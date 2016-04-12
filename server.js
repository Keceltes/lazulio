//besides 3rd party dependencies e.g. express, wagner, morgan, this also loads my custom modules e.g. models, dependencies, auth, api
//actually i think express, wagner and morgan should be able to go into dependencies.js, but they're needed here for my custom modules
var express = require('express');
var wagner = require('wagner-core');

//express is for client server interaction
var app = express();
//app.use Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
app.use(require('morgan')());

//the models.js default module.export is a function that takes in an object wagner
//returns a models structure with Categories and User (not product?)
require('./models')(wagner);
//above equivalent to below
//var models = require('./models');
//models(wagner);

require('./dependencies')(wagner);

wagner.invoke(require('./auth'), { app: app });

//api.js
app.use('/api/v1', require('./api')(wagner));

// Serve up static HTML pages from the file system.
// For instance, '/6-examples/hello-http.html' in
// the browser will show the '/6-examples/hello-http.html'
// file.
app.use(express.static('/', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3000);
console.log('Listening on port 3000!');
