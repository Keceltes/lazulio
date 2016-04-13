//interesting that this is not in the controller.js, the 8th called to REST API
var status = require('http-status');

//exports a global user
exports.$user = function($http) {
  var s = {};

  s.loadUser = function() {
    console.log('about to break');
    $http.
      get('/api/v1/me').
      success(function(data) {
        s.user = data.user;
        console.log('didnt break at this point');
      }).
      error(function(data, status) {
        console.log('broke');
        console.log(status);
        if (status === status.UNAUTHORIZED) {
          console.log('broke unauthorized');
          s.user = null;
        }
      });
  };

  s.loadUser();

  setInterval(s.loadUser, 60 * 60 * 1000);

  return s;
};
