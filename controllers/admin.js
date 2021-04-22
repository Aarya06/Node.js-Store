const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/add-product', {
		title: 'add-products',
		path: '/admin/add-product',
	});
};

exports.postAddProduct = (req, res, next) => {
	const {title, imageUrl, description, price} = req.body;
	const product = new Product(title, imageUrl, description, price);
	product.save();
	console.log('Post Success !');
	res.redirect('/');
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll((products) => {
		res.status(200).render('admin/products', {
			products: products,
			title: 'Products',
			hasProduct: products.length > 0,
			path: '/admin/products',
		});
	});
};