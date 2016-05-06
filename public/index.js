/**
 * Created by Keceltes on 4/15/2016.
 */
console.log('accessed from index.ejs232');

require('angular-ui-bootstrap');
require('angular-animate');
var _ = require('underscore');
var controllers = require('./controllers');
var directives = require('./directives');
var services = require('./services');

var components = angular.module('lazulio.components', ['ng']);
_.each(controllers, function (controller, name) {
    console.log('anything in here? ' + name);
    components.controller(name, controller);
});
_.each(directives, function (directive, name) {
    components.directive(name, directive);
});
_.each(services, function (service, name) {
    components.service(name, service);
});

//sometimes the var app is used for express(), this time it's used for an angular module, probably nothing of concern
var app = angular.module('lazulio', ['lazulio.components', 'auth0', 'angular-storage', 'angular-jwt', 'ui.bootstrap', 'ngAnimate', 'ngRoute']);

//routing via routeProvider?  Not sure why this is here and exists directives, though directives are linked by controller.js
//this is linked directly by web address, meaning they don't pass the controller REST API
//but category/:category, checkout and product/:id are all in controller and directives
//04_18_2016
//no this is way different than directives.  directives are html templates or partial pages that are inserted into full pages,
// with a controller with functions assigned to that partial page
// this routeProvider is for handling different pages

//you would use templateUrl if there's no controller needed, otherwise use template:
app.config(function myAppConfig($routeProvider, authProvider, $httpProvider, $locationProvider,
                                    jwtInterceptorProvider) {
    $routeProvider.
    when('/asset/new', {
        template: '<save-asset></save-asset>'
    }).
    when('/asset/results/byTag/:tags', {
        template: '<asset-results></asset-results>'
    }).
    when('/asset/results/byText/:text', {
        template: '<asset-results></asset-results>'
    }).
    when('/asset/:id', {
        template: '<asset></asset>'
    }).
    when('/category/new', {
        template: '<save-category></save-category>'
    }).
    when('/', {
        templateUrl: '/views/pages/homepage.ejs'
    }).
    when('/pharma', {
        templateUrl: '/views/pages/homepage_pharma.ejs'
    }).
    when('/tto', {
        templateUrl: '/views/pages/homepage_tto.ejs'
    }).
    when('/about', {
        template: '<about></about>'
    });
    
    authProvider.init({
        domain: 'lazulio.auth0.com',
        clientID: 'j11MaWle1aly6QSB5MgGr1BEosCeDqfT'
    });
    
    //app.js, not sure if this belongs here in particular though
    authProvider.on('loginSuccess', function ($location, profilePromise, idToken, store) {
        console.log("Login Success");
        profilePromise.then(function (profile) {
            store.set('profile', profile);
            store.set('token', idToken);
        });
        $location.path('/');
    });
    
    authProvider.on('loginFailure', function () {
        // Error Callback
        console.log("Login Failure");
    });
    
    // We're annotating this function so that the `store` is injected correctly when this file is minified
    jwtInterceptorProvider.tokenGetter = ['store', function (store) {
            // Return the saved token
            return store.get('token');
        }];
    
    $httpProvider.interceptors.push('jwtInterceptor');
})
    .run(function ($rootScope, auth, store, jwtHelper, $location) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
    $rootScope.$on('$locationChangeStart', function () {
        var token = store.get('token');
        if (token) {
            if (!jwtHelper.isTokenExpired(token)) {
                if (!auth.isAuthenticated) {
                    auth.authenticate(store.get('profile'), token);
                }
            } else {
                // Either show the login page or use the refresh token to get a new idToken
                $location.path('/');
            }
        }
    });
});
