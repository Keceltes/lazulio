/*For example, you could have a Users table that would have a copy of each user authenticated by Auth0.
 * Every time a users logs in, you would search the table for that user.
 * If the user does not exist, you would create a new record.
 * Ifit does exist, you would update all fields, essentially keeping a local copy of the user data.*/
exports.HomePageController = function ($http, $scope, auth) {

}

exports.NavBarController = function ($http, $scope, $uibModal, auth) {
    $scope.auth = auth;
    if (auth.profile != undefined) {
        $http.
        get('/api/v1/user/' + auth.profile.user_id).then(function (data) {
            //if success
            console.log('user found: ' + data.data.user.username);
            $scope.user = data.data.user; //when success, only need 1 data, not sure why then requires 2, but at least the success / failure is fine
        }, function (data) {
            //if failure
            console.log('user not found, creating now');
            $http.put('/api/v1/user/save', auth).success(function (data) {
                //save doesn't return the data yet, need to edit API
                console.log('new user saved: ' + data.user.username);
                $scope.user = data.user;
            });
        });
    }
    else {
        console.log('auth profile undefined');
    }

    $scope.savedSearchCategories = [];
    //if a function like this exists, it would be great in the NavBar
    $scope.changeRoute = function (url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };
     $scope.freeTextSearch = function () {
        $scope.changeRoute('#/asset/results/byText/' + $scope.searchText);
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
            $scope.savedSearchCategories = selectedItem.slice();
            $scope.changeRoute('#/asset/results/byTag/' + tagString);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
        $uibModalInstanceSearch = modalInstance;
    };
};

exports.AdvancedSearchController = function ($scope, $http) {
    $scope.success = false;
    $scope.chosenCategories = $scope.savedSearchCategories.slice();
    console.log('scope.categoryAll function called');
    $http.get('/api/v1/category/all').success(function (data) {
        console.log('api/v1/category/all called successfully');
        //$scope.categories = data.categories;
        $scope.categories = [];
        var currentColumn = [];
        for (var i = 0; i < data.categories.length; i++) {
            if (data.categories[i].parent == '' && i != 0) {
                $scope.categories.push(currentColumn);
                currentColumn = [];
            }
            currentColumn.push(data.categories[i]);
        }
        $scope.categories.push(currentColumn);
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
    }
    
    
    updateResults();
    $scope.clearSearch = function () {
        $scope.chosenCategories = [];
        updateResults();
    };
    $scope.addToSearchBy = function (category) {
        var index = $scope.chosenCategories.indexOf(category);
        if(index == -1) {
            $scope.chosenCategories.push(category);
            updateResults();
        }
    };
    $scope.removeSearchBy = function (category) {
        var index = $scope.chosenCategories.indexOf(category);
        if (index != -1) {
            $scope.chosenCategories.splice(index, 1);
            updateResults();
        }
    };
    $scope.ok = function () {
        $uibModalInstanceSearch.close($scope.chosenCategories);
    };
    $scope.cancel = function () {
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
    if ($routeParams.tags != undefined) {
        var encoded = encodeURIComponent($routeParams.tags);
        $http.get('/api/v1/asset/byTag/' + encoded).success(function (data) {
            $scope.assets = data.assets;
        });
    }
    else if ($routeParams.text != undefined) {
        $http.
    get('/api/v1/asset/byText/' + $routeParams.text).
    success(function (data) {
            $scope.assets = data.assets;
        });
    }
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
    console.log('searchBarController being called');    
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

exports.PopularFeedController = function ($scope, $http) {
    $http.get('/api/v1/asset/popular').success(function (data) {
        $scope.popularAssets = data.assets;
    });
};
exports.FollowedSearchFeedController = function ($scope, $http) {
    $http.get('/api/v1/asset/followed').success(function (data) {
        $scope.feedAssets = data.assets;
    });
};
exports.FollowedAssetFeedController = function ($scope, $http) {

};
exports.MyAccountController = function ($scope, $http, auth) {
};