(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Keceltes on 4/15/2016.
 */
console.log('accessed from index.ejs232');

/*var angular = require("angular");
var _ = require('underscore');

var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');*/

var components = angular.module('lazulio.components', ['ng']);
/*_.each(controllers, function(controller, name) {
    components.controller(name, controller);
});
_.each(directives, function(directive, name) {
    components.directive(name, directive);
});
_.each(services, function(service, name) {
    components.service(name, service);
});*/


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

},{}]},{},[1])