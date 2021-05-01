const Product = require('../models/product');
const User = require('../models/user');

exports.getHome = (req, res, next) => {
	Product.fetchAllProducts().then(
		(products) => {
			res.status(200).render('shop/index', {
				products: products,
				title: 'Shop',
				hasProduct: products.length > 0,
				path: '/',
			});
		}
	).catch(err => {
		console.log(err)
	});
};

exports.getAllProducts = (req, res, next) => {
	Product.fetchAllProducts().then((products) => {
		res.status(200).render('shop/product-list', {
			products: products,
			title: 'Products',
			hasProduct: products.length > 0,
			path: '/products',
		});
	}).catch(err => {
		console.log(err)
	});
};

exports.getProduct = (req, res, next) => {
	Product.findById(req.params.id).then(
		(product) => {
			res.status(200).render('shop/product-detail', {
				product,
				title: product.title,
				path: '/products',
			});
		}
	).catch(err => {
		console.log(err)
	});
};

exports.getCart = (req, res, next) => {
	req.user.getCartItems().then(cart => {
		res.status(200).render('shop/cart', {
			title: 'Cart',
			path: '/cart',
			cart,
		});
	})
};

exports.addToCart = async (req, res, next) => {
	Product.findById(req.body.id).then(product => {
		return req.user.addToCart(product._id)
	}).then(result => {
		res.redirect('/cart')
	})
};

exports.getCheckout = (req, res, next) => {
	res.status(200).render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

exports.getOrders = (req, res, next) => {
	req.user.getOrders().then(orders => {
		res.status(200).render('shop/orders', {
			title: 'Orders',
			path: '/orders',
			orders
		});
	})
	
};

exports.placeOrder = (req, res, next) => {
	req.user.addOrder().then(status => {
		res.redirect('/orders')
	})
}

exports.deleteCartItem = (req, res, next) => {
	req.user.deleteCartItem(req.body.id).then(prod => {
		res.redirect('/cart');
	})
};