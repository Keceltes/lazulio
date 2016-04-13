//direct to specific html pages
//links controller with url
//also, all exports.camelCase get called by camel-case in html
exports.addToCart = function() {
  return {
    controller: 'AddToCartController',
    templateUrl: '/public/views/templates/add_to_cart.html'
  };
};

exports.categoryProducts = function() {
  return {
    controller: 'CategoryProductsController',
    templateUrl: '/public/views/templates/category_products.html'
  }
};

exports.categoryTree = function() {
  return {
    controller: 'CategoryTreeController',
    templateUrl: '/public/views/templates/category_tree.html'
  }
};

exports.checkout = function() {
  return {
    controller: 'CheckoutController',
    templateUrl: '/public/views/templates/checkout.html'
  };
};

exports.navBar = function() {
  return {
    controller: 'NavBarController',
    templateUrl: '/public/views/templates/nav_bar.html'
  };
};

exports.productDetails = function() {
  return {
    controller: 'ProductDetailsController',
    templateUrl: '/public/views/templates/product_details.html'
  };
};

exports.searchBar = function() {
  return {
    controller: 'SearchBarController',
    templateUrl: '/public/views/templates/search_bar.html'
  };
};
