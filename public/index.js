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

app.config(function($routeProvider) {
    $routeProvider.
    when('/category/:category', {
        templateUrl: '/assessment/templates/category_view.html'
    }).
    when('/checkout', {
        template: '<checkout></checkout>'
    }).
    when('/asset/:id', {
        template: '<asset-details></asset-details>'
    }).
    when('/', {
        template: '<search-bar></search-bar>'
    });
});
