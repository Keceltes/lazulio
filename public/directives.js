//direct to specific html pages
//links controller with url
//also, all exports.camelCase get called by camel-case in html
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