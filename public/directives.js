//direct to specific html pages
//links controller with url
//also, all exports.camelCase get called by camel-case in html
exports.saveCategory = function() {
  return {
    controller: 'CategorySaveController',
    templateUrl: '/views/partials/save_category.ejs'
  };
};

exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    templateUrl: '/assessment/templates/add_to_cart.html'
  };
};

exports.categoryAssets = function() {
  return {
    controller: 'CategoryAssetsController',
    templateUrl: '/assessment/templates/category_assets.html'
  }
};

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    templateUrl: '/assessment/templates/category_tree.html'
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    templateUrl: '/assessment/templates/checkout.html'
  };
};

exports.navBar = function() {
  console.log('test navbar directives');
  return {
    controller: 'NavBarController',
    templateUrl: '/assessment/templates/nav_bar.html'
  };
};

exports.assetDetails = function() {
  return {
    controller: 'AssetDetailsController',
    templateUrl: '/assessment/templates/asset_details.html'
  };
};

exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: '/views/partials/search_bar.html'
  };
};
