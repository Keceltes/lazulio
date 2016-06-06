/**
 * Created by Keceltes on 4/15/2016.
 */
console.log('accessed from index.ejs232');

require('angular-ui-bootstrap');
require('angular-animate');
//require('angular-ui-grid');
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
var app = angular.module('lazulio', ['lazulio.components', 'auth0', 'angular-storage', 'angular-jwt', 'ui.bootstrap', 'ngAnimate', 'ngRoute', 'ui.grid', 'pageslide-directive']);

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
    when('/asset/results/byTag/and/:tags', {
        template: '<asset-results></asset-results>'
    }).
    //OR not currently used
    when('/asset/results/byTag/or/:tags', {
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
        template: '<homepage></homepage>'
    }).
    when('/pharma', {
        templateUrl: '/views/pages/homepage_pharma.ejs'
    }).
    when('/tto', {
        templateUrl: '/views/pages/homepage_tto.ejs'
    }).
    when('/about', {
        template: '<about></about>'
    }).
    when('/myaccount', {
        template: '<my-account></my-account>'
    });
    
    authProvider.init({
        domain: 'lazulio.auth0.com',
        clientID: 'j11MaWle1aly6QSB5MgGr1BEosCeDqfT'
    });
    
    //app.js, not sure if this belongs here in particular though
    authProvider.on('loginSuccess', function ($rootScope, auth, $http, $location, profilePromise, idToken, store) {
        console.log("Login Success");
        profilePromise.then(function (profile) {
            store.set('profile', profile);
            store.set('token', idToken);
        });
        //LoginCheck($rootScope, auth, $http, function () { //login check doesn't work here because, despite saying Login Success, auth is not defined
            $location.path('/');
        //});
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
    .run(function ($rootScope, auth, store, jwtHelper, $location, $http) {
    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
    $rootScope.$on('$locationChangeStart', function () {
        $rootScope.auth = auth;  //hope it doesn't matter that this is called unnecessarily, needed for about.ejs in particular regardless of signed in or not
        //LoginCheck($rootScope, auth, $http, function () {
            var token = store.get('token');
            if (token) {
                console.log('token found');
                //first check if you can authenticate automatically
                if (!jwtHelper.isTokenExpired(token)) {
                    console.log('token not expired');
                    if (!auth.isAuthenticated) {
                        console.log('auto authenticating');
                        auth.authenticate(store.get('profile'), token);
                    }
                    else {
                        console.log('token not expired and is authenticated');
                    }
                }
                //if still not, redirect to authentication page
                /*if (!auth.isAuthenticated) {
                    console.log('not authenticated');
                    event.preventDefault();
                    $location.path('#/about');
                }*/
            //token is expired and not via access_token
                else if (document.URL.indexOf('access_token') == -1) {
                    console.log('token is expired and not via access_token');
                    //event.preventDefault();
                    $location.path('/about');
                }
            //token is expired but just logged in
                else {
                    console.log('token is expired but not new user, just logged in');
                }
            }
            //auth0 uses access_token to know what page to redirect to after login
            else if (document.URL.indexOf('access_token') == -1) {
                console.log('not authenticated and non existant token: ' + document.URL);
                //event.preventDefault();
                $location.path('/about');
            }
            else {
                console.log('token was non existant, just logged in #2');
            }
        //});
        LoginCheck($rootScope, auth, $http, function () { });
    });
});

function LoginCheck($rootScope, auth, $http, callback) {
    if (auth.profile != undefined) {
        console.log('LoginCheck: auth profile defined');
        if ($rootScope.user == undefined) {
            console.log('associating rootScope.user');
            $http.
                    get('/api/v1/user/' + auth.profile.user_id).then(function (data) {
                //if success
                console.log('user found: ' + data.data.user.username);
                $rootScope.user = data.data.user; //when success, only need 1 data, not sure why then requires 2, but at least the success / failure is fine
                console.log(JSON.stringify($rootScope.user.interestedAssets));
                callback();
            }, function (data) {
                //if failure
                console.log('user not found, creating now');
                $http.put('/api/v1/user/save', auth).success(function (data) {
                    console.log('new user saved: ' + data.user.username);
                    $rootScope.user = data.user;
                    callback();
                });
            });
        }
        else {
            callback();
        }
    }
    else {
        console.log('LoginCheck: auth profile undefined');
        callback();
    }
}