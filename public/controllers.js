exports.NavBarController = function ($scope, $uibModal) {
    //if a function like this exists, it would be great in the NavBar
    $scope.chosenCategories = [];
    $scope.changeRoute = function (url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };
    
    $scope.openTagsModal = function () {
        console.log('open tags modal here');
        var modalInstance = $uibModal.open({
            animation: true,
            template: '<advanced-search></advanced-search>',
            //size: size,
            resolve: {
                items: function () {
                    return [];//$scope.items;
                }
            }
        });
        
        modalInstance.result.then(function (selectedItem) {
            //this result is not sent back though ... currently
            //$scope.selected = selectedItem;  //this needs to be done through linking, not passing of data
            //however, the following code is duplicated from UpdateResult and may need consolidating
            var tagString = '0';
            if (selectedItem.length > 0) {
                tagString = selectedItem.map(function (elem) {
                    return elem._id;
                }).join("+");
            }
            
            $scope.changeRoute('#/asset/results/byTag/' + tagString);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
        $uibModalInstanceSearch = modalInstance;
    };
};

exports.AdvancedSearchController = function ($scope, $http) {
    $scope.success = false;
    if ($scope.chosenCategories == undefined) {
        console.log('undefined chosenCategories');
        $scope.chosenCategories = [];
    }
    $scope.chosenCategoriesBackup = $scope.chosenCategories.slice();
    console.log('scope.categoryAll function called');
    $http.get('/api/v1/category/all').success(function (data) {
        console.log('api/v1/category/all called successfully');
        $scope.categories = data.categories;
    });
    var updateResults = function () {
        var tagString = '0';
        if ($scope.chosenCategories.length > 0) {
            tagString = $scope.chosenCategories.map(function (elem) {
                return elem._id;
            }).join("+");
        }
        $http.get('/api/v1/asset/byTag/' + tagString).success(function (data) {
            console.log(data);
            $scope.resultAssets = data.assets;
            console.log($scope.resultAssets.length);
        });
        console.log($scope.chosenCategoriesBackup.length + ' - ' + $scope.chosenCategories.length);
    }
    
    
    updateResults();
    $scope.clearSearch = function () {
        $scope.chosenCategories = [];
        updateResults();
    };
    $scope.addToSearchBy = function (category) {
        $scope.chosenCategories.push(category);
        updateResults();
    };
    $scope.removeSearchBy = function (category) {
        var index = $scope.chosenCategories.indexOf(category);
        $scope.chosenCategories.splice(index, 1);
        updateResults();
    };
    $scope.ok = function () {
        $uibModalInstanceSearch.close($scope.chosenCategories);
    };
    $scope.cancel = function () {
        $scope.chosenCategories = $scope.chosenCategoriesBackup.slice();
        console.log($scope.chosenCategoriesBackup.length + ' - ' + $scope.chosenCategories.length);
        $uibModalInstanceSearch.dismiss('cancel');
    };
    $scope.delete = function (category) {
        $scope.success = false;
        $http.put('/api/v1/category/delete/' + category._id).success(function (data) {
            console.log('api/v1/category/delete called successfully');
            $scope.success = true;
            var index = $scope.categories.indexOf(category);
            $scope.categories.splice(index, 1);
        });
    };
};

exports.AboutController = function ($scope, $http, $timeout, auth, store) {
    // LoginCtrl.js
    //angular.module('lazulio').controller( 'LoginCtrl', function ( $scope, auth) {
    $scope.auth = auth;
    //});
    
    $scope.logout = function () {
        auth.signout();
        store.remove('profile');
        store.remove('token');
    }
};



exports.CategorySaveController = function ($scope, $http, $timeout) {
    console.log('category save controller properly registered');
    $scope.categorySave = function () {
        $scope.success = false;
        console.log('scope.categorySave function called');
        console.log('contents: ' + JSON.stringify($scope.category));
        
        $http.put('/api/v1/category/save', $scope.category).success(function (data) {
            console.log('api/v1/category/save called successfully');
            $scope.success = true;
        });
    };
};

exports.AssetSaveController = function ($scope, $http, $timeout) {
    console.log('asset save controller properly registered');
    $scope.assetSave = function () {
        console.log('scope.assetSave function called');
        console.log('contents: ' + JSON.stringify($scope.asset));
        
        $http.put('/api/v1/asset/save', $scope.asset).success(function (data) {
            console.log('api/v1/asset/save called successfully');
            $scope.success = true;
        });
    };
};

exports.AssetResultController = function ($scope, $http, $routeParams, $timeout) {
    console.log('asset result controller properly registered');
    //need to fill $scope.assets
    var encoded = encodeURIComponent($routeParams.tags);
    $http.get('/api/v1/asset/byTag/' + encoded).success(function (data) {
        $scope.assets = data.assets;
    });
};
exports.AssetController = function ($scope, $http, $routeParams, $timeout) {
    console.log($routeParams.id);
    var encoded = encodeURIComponent($routeParams.id);
    console.log('asset  controller properly registered');
    $http.get('/api/v1/asset/id/' + encoded).success(function (data) {
        console.log(data);
        $scope.asset = data.asset;
    });
};

exports.SearchBarController = function ($scope, $http) {
    // TODO: this function should make an HTTP request to
    // `/api/v1/product/text/:searchText` and expose the response's
    // `products` property as `results` to the scope.
    console.log('searchBarController being called');
    $scope.freeSearch = function () {
        $http.
    get('/api/v1/asset/byText/' + $scope.searchText).
    success(function (data) {
            $scope.results = data.assets;
        });
    };
    
    $scope.update = function () {
        $http.
    get('/api/v1/category/byText/' + $scope.searchText).
    success(function (data) {
            $scope.results = data.categories;
        });
    };
    
    setTimeout(function () {
        $scope.$emit('SearchBarController');
    }, 0);
};
