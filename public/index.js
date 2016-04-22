/**
 * Created by Keceltes on 4/15/2016.
 */
console.log('accessed from index.ejs232');

var _ = require('underscore');
var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');

var components = angular.module('lazulio.components', ['ng']);
_.each(controllers, function(controller, name) {
    console.log('anything in here? ' + name);
    components.controller(name, controller);
});
_.each(directives, function(directive, name) {
    components.directive(name, directive);
});
_.each(services, function(service, name) {
    components.service(name, service);
});


//sometimes the var app is used for express(), this time it's used for an angular module
var app = angular.module('lazulio', ['lazulio.components', 'ngRoute']);

//routing via routeProvider?  Not sure why this is here and exists directives, though directives are linked by controller.js
//this is linked directly by web address, meaning they don't pass the controller REST API
//but category/:category, checkout and product/:id are all in controller and directives
//04_18_2016
//no this is way different than directives.  directives are html templates or partial pages that are inserted into full pages,
// with a controller with functions assigned to that partial page
// this routeProvider is for handling different pages

//you would use templateUrl if there's no controller needed, otherwise use template:
app.config(function($routeProvider) {
    $routeProvider.
    when('/asset/new', {
        template: '<save-asset></save-asset>'
    }).
    when('/category/new', {
        template: '<save-category></save-category>'
    }).
    when('/', {
        templateUrl: '/views/pages/homepage.ejs'
    }).
    when('/tags', {
        template: '<advanced-search></advanced-search>'
    }).
    when('/about', {
        template: '<about></about>'
    });
});
