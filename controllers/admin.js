const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const product = new Product({...req.body, userId: req.user._id});
	product.save().
		then(result => {
			console.log('Product Created');
			res.redirect('/');
		}).catch(err => {
			console.log(err)
		});

};

exports.getProducts = (req, res, next) => {
	Product.fetchAllProducts().then((products) => {
		res.status(200).render('admin/products', {
			products: products,
			title: 'Products',
			hasProduct: products.length > 0,
			path: '/admin/products',
		});
	}).catch(err => {
		console.log(err)
	});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit === 'true';
	if (!editMode) {
		return res.redirect('/');
	}
	Product.findById(req.params.id)
		.then(product => {
			res.status(200).render('admin/edit-product', {
				title: 'Edit Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	const updateProduct = new Product(req.body);
	updateProduct.save();
	res.redirect('/admin/products');
}

exports.deleteProduct = (req, res, next) => {
	Product.deleteById(req.body.id).then(result => {
		res.redirect('/admin/products');
	}).catch(err => {
		console.log(err)
	});
}