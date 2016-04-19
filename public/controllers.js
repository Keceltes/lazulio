exports.NavBarController = function($scope, $http, $timeout) {
    $scope.openTagsModal = function() {
        console.log('open tags modal here');
    };
};

exports.AdvancedSearchController = function($scope, $http, $timeout) {
    console.log('category save controller properly registered');
    $scope.categorySave = function() {
        console.log('scope.categorySave function called');
        console.log('contents: ' + JSON.stringify($scope.category));

        $http.put('/api/v1/category/save', $scope.category).success(function(data) {
            console.log('api/v1/category/save called successfully');
            $scope.success = true;
        });
    };
};


exports.CategorySaveController = function($scope, $http, $timeout) {
  console.log('category save controller properly registered');
  $scope.categorySave = function() {
    console.log('scope.categorySave function called');
    console.log('contents: ' + JSON.stringify($scope.category));
    
    $http.put('/api/v1/category/save', $scope.category).success(function(data) {
      console.log('api/v1/category/save called successfully');
      $scope.success = true;
    });
  };
};

exports.AssetSaveController = function($scope, $http, $timeout) {
  console.log('category save controller properly registered');
  $scope.categorySave = function() {
    console.log('scope.categorySave function called');
    console.log('contents: ' + JSON.stringify($scope.category));

    $http.put('/api/v1/category/save', $scope.category).success(function(data) {
      console.log('api/v1/category/save called successfully');
      $scope.success = true;
    });
  };
};
//controller is how you call the REST API in /server/api.js
//the $http.___ can have exact match with REST API path
exports.AddToCartController = function($scope, $http, $user, $timeout) {
  $scope.addToCart = function(asset) {
    var obj = { asset: asset._id, quantity: 1 };
    $user.user.data.cart.push(obj);

    $http.
      put('/api/v1/me/cart', $user.user).
      success(function(data) {
        $user.loadUser();
        $scope.success = true;

        $timeout(function() {
          $scope.success = false;
        }, 5000);
      });
  };
};

exports.CategoryAssetsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);

  $scope.price = undefined;

  $scope.handlePriceClick = function() {
    if ($scope.price === undefined) {
      $scope.price = -1;
    } else {
      $scope.price = 0 - $scope.price;
    }
    $scope.load();
  };

  $scope.load = function() {
    var queryParams = { price: $scope.price };
    $http.
      get('/api/v1/asset/category/' + encoded, { params: queryParams }).
      success(function(data) {
        $scope.assets = data.assets;
      });
  };

  $scope.load();

  setTimeout(function() {
    $scope.$emit('CategoryAssetsController');
  }, 0);
};

exports.CategoryTreeController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);
  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
      $scope.category = data.category;
      $http.
        get('/api/v1/category/parent/' + encoded).
        success(function(data) {
          $scope.children = data.categories;
        });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

exports.CheckoutController = function($scope, $user, $http) {
  // For update cart
  $scope.user = $user;

  //probably here because you can update your cart during checkout
  $scope.updateCart = function() {
    $http.
      put('/api/v1/me/cart', $user.user).
      success(function(data) {
        $scoped.updated = true;
      });
  };

  // For checkout
  Stripe.setPublishableKey('pk_test_KVC0AphhVxm52zdsM4WoBstU');

  $scope.stripeToken = {
    number: '4242424242424242',
    cvc: '123',
    exp_month: '12',
    exp_year: '2016'
  };

  $scope.checkout = function() {
    $scope.error = null;
    Stripe.card.createToken($scope.stripeToken, function(status, response) {
      if (status.error) {
        $scope.error = status.error;
        return;
      }

      $http.
        post('/api/v1/checkout', { stripeToken: response.id }).
        success(function(data) {
          $scope.checkedOut = true;
          $user.user.data.cart = [];
        });
    });
  };
};

exports.NavBarController = function($scope, $user) {
  $scope.user = $user;
  console.log('test controller navbar');
  setTimeout(function() {
    $scope.$emit('NavBarController');
  }, 0);
};

exports.AssetDetailsController = function($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.id);

  $http.
    get('/api/v1/asset/id/' + encoded).
    success(function(data) {
      $scope.asset = data.asset;
    });

  setTimeout(function() {
    $scope.$emit('AssetDetailsController');
  }, 0);
};

exports.SearchBarController = function($scope, $http) {
  // TODO: this function should make an HTTP request to
  // `/api/v1/product/text/:searchText` and expose the response's
  // `products` property as `results` to the scope.
  console.log('searchBarController being called');
  $scope.update = function() {
    console.log('searchBarController being update: ' + $scope.searchText);
    $http.
    get('/api/v1/asset/text/' + $scope.searchText).
    success(function(data) {
      console.log('searchBarController success: ' + $scope.searchText);
      console.log('searchBarController data: ' + JSON.stringify(data.products));
      console.log('searchBarController results pre assignment: ' + $scope.results);
      $scope.results = data.products;
      console.log('searchBarController results post assignment: ' + $scope.results);
    });
  };

  setTimeout(function() {
    $scope.$emit('SearchBarController');
  }, 0);
};
