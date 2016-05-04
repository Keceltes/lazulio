//direct to specific html pages
//links controller with url
//also, all exports.camelCase get called by camel-case in html
exports.myEnter = function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                
                event.preventDefault();
            }
        });
    };
};
exports.about = function() {
  return {
    controller: 'AboutController',
    templateUrl: '/views/pages/about.ejs'
  };
};

exports.saveCategory = function() {
  return {
    controller: 'CategorySaveController',
    templateUrl: '/views/pages/save_category.ejs'
  };
};
exports.saveAsset = function() {
  return {
    controller: 'AssetSaveController',
    templateUrl: '/views/pages/save_asset.ejs'
  };
};
exports.assetResults = function() {
  return {
    controller: 'AssetResultController',
    templateUrl: '/views/pages/asset_result.ejs'
  };
};

exports.asset = function() {
  return {
    controller: 'AssetController',
    templateUrl: '/views/pages/asset.ejs'
  }
}

exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: '/views/partials/search_bar.ejs'
  };
};

exports.navBar = function() {
  return {
    controller: 'NavBarController',
    templateUrl: '/views/partials/nav.ejs'
  };
};

exports.advancedSearch = function() {
  return {
    controller: 'AdvancedSearchController',
    templateUrl: '/views/pages/advanced_search.ejs'
  };
};