/*For example, you could have a Users table that would have a copy of each user authenticated by Auth0.
 * Every time a users logs in, you would search the table for that user.
 * If the user does not exist, you would create a new record.
 * Ifit does exist, you would update all fields, essentially keeping a local copy of the user data.*/
exports.HomePageController = function ($http, $scope, auth) {
}

exports.NavBarController = function ($http, $scope, $uibModal, auth, store, $timeout) {
    //initially query of all data?
    $http.get('/api/v1/asset/byTag/and/0').success(function (data) {
        $scope.allAssets = data.assets;
        $scope.allInstitutes = [];
        $scope.allTags = [];
        for (var i = 0; i < data.assets.length; i++) {
            if ($scope.allInstitutes.indexOf(data.assets[i].organization) == -1)
                $scope.allInstitutes.push(data.assets[i].organization);
            console.log("data.assets: " + JSON.stringify(data.assets[i]));
            if (data.assets[i].tags != undefined) {
                for (var j = 0; j < data.assets[i].tags.length; j++) {
                    var index = -1;
                    for (var k = 0; k < $scope.allTags.length; k++) {
                        if ($scope.allTags[k].name == data.assets[i].tags[j])
                            index = k;
                    }
                    if (index == -1) {
                        $scope.allTags.push(
                            {
                                name: data.assets[i].tags[j], count: 1
                            });
                    }
                    else {
                        console.log('ever get here?');
                        $scope.allTags[index].count++;
                    }
                }
            }
        }
        console.log("alltags: " + JSON.stringify($scope.allTags));
    });
    //NavBarController only gets called once when app loaded for first time
    $scope.savedSearchCategories = [];
    //if a function like this exists, it would be great in the NavBar
    $scope.changeRoute = function (url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if (forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            //total hack, won't work for slow computers, i don't wike it
            $timeout(function () { window.location = url; }, 200);
            //window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };
    $scope.freeTextSearch = function () {
        $scope.changeRoute('#/asset/results/byText/' + $scope.searchText);
    };
    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.toggle = function () {
        $scope.checked = !$scope.checked
    }
    $scope.openTagsModal = function () {
        console.log('open tags modal here');
        $scope.checked = !$scope.checked
        /*var modalInstance = $uibModal.open({
            animation: true,
            template: '<advanced-search></advanced-search>',
            //size: size,
            resolve: {
                items: function () {
                    return [];//$scope.items;
                }
            },
            size: 'lg',
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
            $scope.changeRoute('#/asset/results/byTag/and/' + tagString);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        
        $uibModalInstanceSearch = modalInstance;*/
    };
    
    $scope.logout = function () {
        auth.signout();
        store.remove('profile');
        store.remove('token');
    }
};

exports.AdvancedSearchController = function ($scope, $http) {
    $scope.success = false;
    $scope.chosenCategories = $scope.savedSearchCategories.slice();
    console.log('scope.categoryAll function called');
    $http.get('/api/v1/category/all').success(function (data) {
        console.log('api/v1/category/all called successfully');
        //$scope.categories = data.categories; need to do some adjustment to matrix for html table
        $scope.categories = [];
        var currentRow = [];
        for (var i = 0; i < data.categories.length; i++) {
            //add asset counts
            data.categories[i].assetCount = 0;
            for (var j = 0; j < $scope.allTags.length; j++) {
                if ($scope.allTags[j].name == data.categories[i]._id) {
                    data.categories[i].assetCount = $scope.allTags[j].count;
                }
            }
            //then work on placement in grid
            if ((data.categories[i].parent == '') || currentRow.length % 5 == 0) {
                $scope.categories.push(currentRow);
                currentRow = [];
            }
            //fake row for category separator
            if ((data.categories[i].parent == '')) {
                $scope.categories.push([{ parent: '', _id: 'Category' }]);
            }
            //fake cell for indent
            if (currentRow.length % 5 == 0 && data.categories[i].parent != '') {
                var fakeData = { parent: '', _id: '' };
                currentRow.push(fakeData);
            }
            currentRow.push(data.categories[i]);
        }
        $scope.categories.push(currentRow);
    });
    var updateResults = function () {
        var tagString = '0';
        console.log('before: ' + JSON.stringify($scope.chosenCategories));
        $scope.chosenCategories = $scope.chosenCategories.sort(function (a, b) {
            if (a._id < b._id)
                return -1;
            else if (a._id > b._id)
                return 1;
            else
                return 0;
        });
        console.log('after: ' + JSON.stringify($scope.chosenCategories));
        if ($scope.chosenCategories.length > 0) {
            tagString = $scope.chosenCategories.map(function (elem) {
                return elem._id;
            }).join("+");
        }
        $http.get('/api/v1/asset/byTag/and/' + tagString).success(function (data) {
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
        if (index == -1) {
            $scope.chosenCategories.push(category);
            updateResults();
        }
    };
    $scope.removeSearchBy = function (category) {
        setTimeout(function () {
            var index = $scope.chosenCategories.indexOf(category);
            if (index != -1) {
                $scope.chosenCategories.splice(index, 1);
                updateResults();
            }
        }, 10);

    };
    $scope.ok = function () {
        //$uibModalInstanceSearch.close($scope.chosenCategories);
        $scope.checked = !$scope.checked;
        var tagString = '0';
        if ($scope.chosenCategories.length > 0) {
            tagString = $scope.chosenCategories.map(function (elem) {
                return elem._id;
            }).join("+");
        }
        $scope.savedSearchCategories = $scope.chosenCategories.slice();
        $scope.changeRoute('#/asset/results/byTag/and/' + tagString);
    };
    $scope.cancel = function () {
        //$uibModalInstanceSearch.dismiss('cancel');
        $scope.checked = !$scope.checked;
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
    $scope.assets = [];
    $scope.assetOpened = false;
    $scope.gridData = {
        enableSorting: true,
        columnDefs: [
            {
                name: 'Name',
                /*cellTemplate: '<div>' +
                    '<a href="#/asset/{{row.entity._id}}">{{row.entity.name}}</a>' +
                    '</div>'*/
                cellTemplate: '<button class="btn primary" ng-click="grid.appScope.openAsset(row.entity._id)">{{row.entity.name}}</button>' 
            },
            //{ name: 'Name', field: 'name' },
            { name: 'Organization', field: 'organization' },
            { name: 'Description', field: 'description' },
            { name: 'Market', field: 'market' },
    { name: 'IP Status', field: 'ipStatus' },
    { name: 'Problem', field: 'problem' },
    { name: 'Solution', field: 'solution' },
    { name: 'Application', field: 'application' },
    { name: 'Advantages', field: 'advantages' },
    { name: 'Looking For', field: 'lookingFor' },
    { name: 'Contact', field: 'contact' },
    { name: 'Tags', field: 'tags' }
        ],
        i18n: 'en',
        data : 'assets'
    };

    var query;
    //need to fill $scope.assets
    if ($routeParams.tags != undefined) {
        var encoded = /*encodeURIComponent(*/ $routeParams.tags;//);
        query = 'byTag/and/' + encoded;
    }
    else if ($routeParams.text != undefined) {
        query = 'byText/' + $routeParams.text;
    }
    $http.
        get('/api/v1/search/' + query.split("/").join("_")).then(function (data) {
        //if success
        console.log('search return success: ' + JSON.stringify(data.data));
        $scope.searchCount = data.data.search;
    }, function (data) {
        //if failure
        console.log('search return issue: ' + data.data);
    });
        /*success(function (data) {
            //$scope.search = data.search;
        console.log("any search result: " + JSON.stringify(data.search));
    });*/
    $http.
        get('/api/v1/asset/' + query).
        success(function (data) {
        console.log("data: " + JSON.stringify(data.assets));
        $scope.assets = data.assets;

        if ($scope.user == undefined) {
            $scope.followingResult = -1;
        }
        else {
            $scope.followingResult = $scope.user.interestedSearches.indexOf(query);
        }
        console.log('search found? ' + $scope.user.interestedSearches.indexOf(query));
    });
    $scope.openAsset = function (asset_id) {
        console.log('openAsset called ' + asset_id);
        $scope.assetOpened = !$scope.assetOpened;
        $routeParams.id = asset_id;
        exports.AssetController($scope, $http, $routeParams);
    }
    $scope.addToCartResults = function () {
        if ($scope.followingResult > -1) {
            console.log('already in cart, should remove');
            $scope.user.interestedSearches.splice($scope.followingResult, 1);
            //search all searches to see if need to remove
            $scope.user.interestedTags = RefreshInterestedTags($scope.user.interestedSearches);
        }
        else {
            console.log('not in cart, should add');
            $scope.user.interestedSearches.push(query);
            //search all tags to see if need to add
            $scope.user.interestedTags = RefreshInterestedTags($scope.user.interestedSearches);
        }
        $http.
          put('/api/v1/save/cart', $scope.user).
          success(function (data) {
            console.log('add to cart successful?');
            $scope.followingResult = $scope.user.interestedSearches.indexOf(query);
        });
    };
};
function RefreshInterestedTags(interestedSearches) {
    var interestedTags = [];
    for (var i = 0; i < interestedSearches.length; i++) {
        var tags = interestedSearches[i].split('/')[interestedSearches[i].split('/').length - 1];
        console.log('tags: ' + tags);
        var tagArray = tags.split('+');
        for (var j = 0; j < tagArray.length; j++) {
            if (interestedTags.indexOf(tagArray[j]) == -1) {
                interestedTags.push(tagArray[j]);
            }
        }
    }
    console.log('interested tags: ' + interestedTags);
    return interestedTags;
}

exports.AssetController = function ($scope, $http, $routeParams) {
    console.log('routeparams: ' + $routeParams.id);
    if ($routeParams.id != undefined) {
        var encoded = encodeURIComponent($routeParams.id);
        console.log('asset  controller properly registered');
        $http.get('/api/v1/asset/id/' + encoded).success(function (data) {
            console.log('returned: ' + data);
            $scope.asset = data.asset;
            if ($scope.user == undefined) {
                $scope.following = -1;
            }
            else {
                $scope.following = matchedIdFound({ asset: $scope.asset._id }, $scope.user.interestedAssets);
            }
        });
    }
    $scope.addToCart = function (asset) {
        if ($scope.following > -1) {
            console.log('already in cart, should remove');
            $scope.user.interestedAssets.splice($scope.following, 1);
        }
        else {
            console.log('not in cart, should add');
            $scope.user.interestedAssets.push({ asset: $scope.asset._id });
        }
        $http.
          put('/api/v1/save/cart', $scope.user).
          success(function (data) {
            console.log('add to cart successful!');
            $scope.following = matchedIdFound({ asset: $scope.asset._id }, $scope.user.interestedAssets);
        });
    };
    var matchedIdFound = function (obj, array) {
        for (var i = 0; i < array.length; i++) {
            console.log('1: ' + array[i].asset/*._id*/);
            console.log('2: ' + obj.asset);
            if (array[i].asset /*._id*/ == obj.asset) {
                return i;
            }
        }
        return -1;
    }
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
        //$scope.popularAssets = data.assets;

        $scope.popularAssets = [];
        var currentRow = [];
        for (var i = 0; i < data.assets.length; i++) {
            if (i % 3 == 0) {
                $scope.popularAssets.push(currentRow);
                currentRow = [];
            }
            currentRow.push(data.assets[i]);
        }
        $scope.popularAssets.push(currentRow);
    });
};
exports.FollowedSearchFeedController = function ($scope, $http) {
    console.log('$scope.user loaded? ' + $scope.user);
    $http.put('/api/v1/asset/followed', $scope.user).success(function (data) {
        //$scope.feedAssets = data.assets;
        $scope.feedAssets = [];
        var currentRow = [];
        for (var i = 0; i < data.assets.length; i++) {
            if (i % 3 == 0) {
                $scope.feedAssets.push(currentRow);
                currentRow = [];
            }
            currentRow.push(data.assets[i]);
        }
        $scope.feedAssets.push(currentRow);
    });
};
exports.FollowedAssetFeedController = function ($scope, $http) {
    $http.put('/api/v1/asset/updated', $scope.user).success(function (data) {
        $scope.updatedAssets = data.assets;
    });
};
exports.MyAccountController = function ($scope, $http, auth) {
    if ($scope.auth.profile != undefined) {
        $http.
        get('/api/v1/userfull/' + $scope.auth.profile.user_id).then(function (data) {
            //if success
            console.log('user found: ' + data.data.user.username);
            $scope.userfull = data.data.user; //when success, only need 1 data, not sure why then requires 2, but at least the success / failure is fine
            console.log(JSON.stringify($scope.user.interestedAssets));
        }, function (data) {
            //if failure
            console.log('user not found, but should not create here');
        });
    }
    else {
        console.log('auth profile undefined');
    }
    $scope.print = function (asset) {
        console.log(JSON.stringify(asset));
    };
};