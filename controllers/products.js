const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('add-product', {
		title: 'add-products',
		path: '/admin/add-product',
	});
};

exports.postAddProduct = (req, res, next) => {
	const product = new Product(req.body.title);
	product.save();
	console.log('Post Success !');
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.status(200).render('shop', {
			products: products,
			title: 'Shop',
			hasProduct: products.length > 0,
			path: '/',
		});
	});
};