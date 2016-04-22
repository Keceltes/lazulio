exports.NavBarController = function($scope, $http, $timeout) {
    $scope.openTagsModal = function() {
        console.log('open tags modal here');
    };
};
exports.AboutController = function($scope, $http, $timeout) {
  
};
exports.AdvancedSearchController = function($scope, $http, $timeout) {
        console.log('scope.categoryAll function called');

        $http.get('/api/v1/category/all').success(function(data) {
            console.log('api/v1/category/all called successfully');
            $scope.categories = data.categories;
            $scope.success = true;
        });
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
