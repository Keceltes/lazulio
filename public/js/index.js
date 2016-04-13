var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');
var _ = require('underscore');

//The angular.module is a global place for creating, registering and retrieving Angular modules.
//All modules (angular core or 3rd party) that should be available to an application must be registered using this mechanism.
//Passing one argument retrieves an existing angular.Module, whereas passing more than one argument creates a new angular.Module
//angular.module(name, [requires], [configFn]);
//the following is an example of creating a module
var components = angular.module('mean-retail.components', ['ng']);

//_.each iterates over a list of items, in this case controllers, and does the function.
//a 3rd optional input can be a context
_.each(controllers, function(controller, name) {
  components.controller(name, controller);
});

_.each(directives, function(directive, name) {
  components.directive(name, directive);
});

_.each(services, function(factory, name) {
  components.factory(name, factory);
});


//sometimes the var app is used for express(), this time it's used for an angular module
var app = angular.module('mean-retail', ['mean-retail.components', 'ngRoute']);

//routing via routeProvider?  Not sure why this is here and exists directives, though directives are linked by controller.js
//this is linked directly by web address, meaning they don't pass the controller REST API
//but category/:category, checkout and product/:id are all in controller and directives

app.config(function($routeProvider) {
  $routeProvider.
    when('/category/:category', {
      templateUrl: '/public/views/templates/category_view.html'
    }).
    when('/checkout', {
      template: '<checkout></checkout>'
    }).
    when('/product/:id', {
      template: '<product-details></product-details>'
    }).
    when('/', {
      template: '<search-bar></search-bar>'
    });
});

console.log('test clientside');