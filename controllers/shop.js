const Product = require('../models/product');

exports.getHome = (req, res, next) => {
	Product.fetchAll((products) => {
		res.status(200).render('shop/index', {
			products: products,
			title: 'Shop',
			hasProduct: products.length > 0,
			path: '/',
		});
	});
};

exports.getAllProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.status(200).render('shop/product-list', {
			products: products,
			title: 'Products',
			hasProduct: products.length > 0,
			path: '/products',
		});
	});
};

exports.getCart = (req, res, next) => {
	res.status(200).render('shop/cart', {
		title: 'Cart',
		path: '/cart',
	});
};

exports.getCheckout = (req, res, next) => {
	res.status(200).render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

exports.getOrders = (req, res, next) => {
	res.status(200).render('shop/orders', {
		title: 'Orders',
		path: '/orders',
	});
};