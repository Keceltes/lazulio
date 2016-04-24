exports.NavBarController = function($scope, $uibModal) {
    $scope.openTagsModal = function() {
        console.log('open tags modal here');
        var modalInstance = $uibModal.open({
            animation: true,
            template: '<advanced-search></advanced-search>',
            //size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //this result is not sent back though ... currently
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
        $uibModalInstanceSearch = modalInstance;
    };
};

exports.AdvancedSearchController = function($scope, $http) {
    $scope.success = false;
    console.log('scope.categoryAll function called');

    $http.get('/api/v1/category/all').success(function(data) {
        console.log('api/v1/category/all called successfully');
        $scope.categories = data.categories;
    });

    $scope.ok = function() {
        $uibModalInstanceSearch.dismiss('cancel');
    };
    $scope.cancel = function() {
        $uibModalInstanceSearch.dismiss('cancel');
    };
    $scope.delete = function(_id) {
        $scope.success = false;
        $http.put('/api/v1/category/delete/' + _id).success(function(data) {
            console.log('api/v1/category/delete called successfully');
            $scope.success = true;
        });
    };
};

exports.AboutController = function($scope, $http, $timeout, auth, store) {
    // LoginCtrl.js
    //angular.module('lazulio').controller( 'LoginCtrl', function ( $scope, auth) {
        $scope.auth = auth;
    //});

    $scope.logout = function() {
        auth.signout();
        store.remove('profile');
        store.remove('token');
    }
};



exports.CategorySaveController = function($scope, $http, $timeout) {
  console.log('category save controller properly registered');
  $scope.categorySave = function() {
      $scope.success = false;
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
