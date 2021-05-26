const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { deleteFile } = require('../utils/fileHelper');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		product: {},
		errors: []
	});
};

exports.postAddProduct = (req, res, next) => {
	const { title, price, description } = req.body;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			title: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			product: { title, price, description },
			errorMsg: error.array()[0].msg,
			errors: error.array()
		});
	}
	if (!req.file) {
		return res.status(422).render('admin/edit-product', {
			title: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			product: { title, price, description },
			errorMsg: 'Invalid Image',
			errors: []
		});
	}
	const newProd = {title, price, description, imageUrl: `/${req.file.path}`}
	Product.create({ ...newProd, user: req.user }).
		then(result => {
			req.flash('success', 'Product Created')
			res.redirect('/');
		}).catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error)
		});
};

exports.getProducts = (req, res, next) => {
	Product.find({ user: req.user._id }).
		// select('title price imageUrl -_id').
		// populate('userId').  
		then((products) => {
			res.status(200).render('admin/products', {
				products: products,
				title: 'Products',
				hasProduct: products.length > 0,
				path: '/admin/products'
			});
		}).catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error)
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit === 'true';
	if (!editMode) {
		return res.redirect('/');
	}
	Product.findOne({ _id: req.params.id, user: req.user._id })
		.then(product => {
			if (!product) {
				return res.redirect('/admin/products')
			}
			delete(product.imageUrl);
			res.status(200).render('admin/edit-product', {
				title: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				errors: []
			});
		}).catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error)
		});
};

exports.postEditProduct = (req, res, next) => {
	const { id, title, price, description } = req.body;
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(200).render('admin/edit-product', {
			title: 'Edit Product',
			path: '/admin/edit-product',
			editing: true,
			product: { _id: id, title, imageUrl, price, description },
			errorMsg: error.array()[0].msg,
			errors: error.array()
		});
	}
	Product.findOne({ _id: req.body.id, user: req.user._id }).then(product => {
		if(!product){
			req.flash('error', 'Product does not exist')
			return res.redirect('/admin/products')
		}
		if(req.file){
			deleteFile(product.imageUrl)
			product.imageUrl = `/${req.file.path}`
		}
		product.title = title;
		product.price = price;
		product.description = description;
		return product.save().then(result => {
			req.flash('success', 'Product updated')
			res.redirect('/admin/products');
		})
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
}

exports.deleteProduct = (req, res, next) => {
	Product.findOne({ _id: req.body.id, user: req.user._id }).then(product => {
		if(!product){
			req.flash('error', 'Product does not exist')
			return res.redirect('/admin/products')
		}
		deleteFile(product.imageUrl)
		return Product.deleteOne({ _id: req.body.id, user: req.user._id })
	}).then(result => {
		req.flash('success', 'Product deleted')
		res.redirect('/admin/products');
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	});
}