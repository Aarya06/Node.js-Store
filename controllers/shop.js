const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getHome = (req, res, next) => {
	Product.find().then(
		(products) => {
			res.status(200).render('shop/index', {
				products: products,
				title: 'Shop',
				hasProduct: products.length > 0,
				path: '/'
			});
		}
	).catch(err => {
		console.log(err)
	});
};

exports.getAllProducts = (req, res, next) => {
	Product.find().then((products) => {
		res.status(200).render('shop/product-list', {
			products: products,
			title: 'Products',
			hasProduct: products.length > 0,
			path: '/products'
		});
	}).catch(err => {
		console.log(err);
	});
};

exports.getProduct = (req, res, next) => {
	Product.findById(req.params.id).then(
		(product) => {
			res.status(200).render('shop/product-detail', {
				product,
				title: product.title,
				path: '/products'
			});
		}
	).catch(err => {
		console.log(err);
	});
};

exports.getCart = (req, res, next) => {
	req.user.populate('cart.items.product').execPopulate().then(user => {
		const cart = user.cart.items;
		res.status(200).render('shop/cart', {
			title: 'Cart',
			path: '/cart',
			cart
		});
	}).catch(err => {
		console.log(err);
	})
};

exports.addToCart = async (req, res, next) => {
	Product.findById(req.body.id).then(product => {
		return req.user.addToCart(product)
	}).then(result => {
		res.redirect('/cart')
	}).catch(err => {
		console.log(err)
	})
};

exports.getCheckout = (req, res, next) => {
	res.status(200).render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout'
	});
};

exports.getOrders = (req, res, next) => {
	Order.find({ user: req.user._id }).then(orders => {
		res.status(200).render('shop/orders', {
			title: 'Orders',
			path: '/orders',
			orders
		});
	}).catch(err => {
		console.log(err)
	})
};

exports.placeOrder = (req, res, next) => {
	req.user.populate('cart.items.product').execPopulate().then(user => {
		const cart = user.cart.items;
		Order.create({ products: cart, user: req.user }).then(result => {
			req.user.clearCart();
			res.redirect('/orders')
		})
	}).catch(err => {
		console.log(err)
	})
}

exports.deleteCartItem = (req, res, next) => {
	req.user.deleteCartItem(req.body.id).then(prod => {
		res.redirect('/cart');
	}).catch(err => {
		console.log(err)
	})
};