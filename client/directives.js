//direct to specific html pages
//links controller with url
//also, all exports.camelCase get called by camel-case in html
exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    templateUrl: '/client/templates/add_to_cart.html'
  };
};

exports.categoryProducts = function() {
  return {
    controller: 'CategoryProductsController',
    templateUrl: '/client/templates/category_products.html'
  }
};

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    templateUrl: '/client/templates/category_tree.html'
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    templateUrl: '/client/templates/checkout.html'
  };
};

exports.navBar = function() {
  return {
    controller: 'NavBarController',
    templateUrl: '/client/templates/nav_bar.html'
  };
};

exports.productDetails = function() {
  return {
    controller: 'ProductDetailsController',
    templateUrl: '/client/templates/product_details.html'
  };
};

exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: '/client/templates/search_bar.html'
  };
};
