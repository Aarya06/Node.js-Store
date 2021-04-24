const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res, next) => {
	Product.findById(req.params.id, (product) => {
		res.status(200).render('shop/product-detail', {
			product,
			title: product.title,
			path: '/products',
		});
	});
};

exports.getCart = (req, res, next) => {
	const cart = [];
	Cart.getCartItems((cartItems) => {
		Product.fetchAll((product) => {
			product.forEach((prod) => {
				const cartData = cartItems.products.find((item) => item.id === prod.id);
				if (cartData) {
					cart.push({ ...prod, qty: cartData.qty });
				}
			});
			res.status(200).render('shop/cart', {
				title: 'Cart',
				path: '/cart',
				cart,
			});
		});
	});
};

exports.addToCart = (req, res, next) => {
	Product.findById(req.body.productId, (product) => {
		Cart.addProduct(product.id, product.price);
		res.redirect('/');
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

exports.deleteCartItem = (req, res, next) => {
	Product.findById(req.body.id, (product) => {
		if (req.body.id === product.id) {
			Cart.deleteProduct(req.body.id, product.price);
			res.redirect('/cart');
		}
	});
};