//interesting that this is not in the controller.js, the 8th called to REST API
var status = require('http-status');

exports.$user = function($http) {
  var s = {};

  /*s.loadUser = function() {
    $http.
      get('/api/v1/me').
      success(function(data) {
        s.user = data.user;
      }).
      error(function(data, status) {
        if (status === status.UNAUTHORIZED) {
          s.user = null;
        }
      });
  };

  s.loadUser();

  setInterval(s.loadUser, 60 * 60 * 1000);*/

  return s;
};
