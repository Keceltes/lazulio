exports.NavBarController = function($scope, $uibModal) {
    //if a function like this exists, it would be great in the NavBar
    $scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };

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
            console.log('returned assets - ' + JSON.stringify($scope.selected));
            
            $scope.changeRoute('#/asset/results');            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
        $uibModalInstanceSearch = modalInstance;
    };
};

exports.AdvancedSearchController = function($scope, $http) {
    $scope.success = false;
    $scope.chosenCategories = [];
    console.log('scope.categoryAll function called');
    $http.get('/api/v1/category/all').success(function(data) {
        console.log('api/v1/category/all called successfully');
        $scope.categories = data.categories;
    });
    var updateResults = function() {
        var tagString = '0';
        if($scope.chosenCategories.length > 0) {
            tagString = $scope.chosenCategories.map(function(elem){
                return elem._id;
            }).join(",");
        }
        $http.get('/api/v1/asset/byTag/' + tagString).success(function(data) {
            console.log(data);
            $scope.resultAssets = data.assets;
            console.log($scope.resultAssets.length);
        });
    }

    updateResults();
    $scope.addToSearchBy = function(category) {
        $scope.chosenCategories.push(category);
        updateResults();
    };
    $scope.removeSearchBy = function(category) {
        var index = $scope.chosenCategories.indexOf(category);
        $scope.chosenCategories.splice(index, 1);
        updateResults();
    };
    $scope.ok = function() {
        $uibModalInstanceSearch.close($scope.resultAssets);
    };
    $scope.cancel = function() {
        $uibModalInstanceSearch.dismiss('cancel');
    };
    $scope.delete = function(category) {
        $scope.success = false;
        $http.put('/api/v1/category/delete/' + category._id).success(function(data) {
            console.log('api/v1/category/delete called successfully');
            $scope.success = true;
            var index = $scope.categories.indexOf(category);
            $scope.categories.splice(index, 1);
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
  console.log('asset save controller properly registered');
  $scope.assetSave = function() {
    console.log('scope.assetSave function called');
    console.log('contents: ' + JSON.stringify($scope.asset));

    $http.put('/api/v1/asset/save', $scope.asset).success(function(data) {
      console.log('api/v1/asset/save called successfully');
      $scope.success = true;
    });
  };
};

exports.AssetResultController = function($scope, $http, $timeout) {
    console.log('asset result controller properly registered');
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
