const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const {title, imageUrl, description, price} = req.body;
	const product = new Product(null, title, imageUrl, description, price);
	product.save();
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

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit === 'true';
	if (!editMode) {
		return res.redirect('/');
	}
	Product.findById(req.params.id, (product) => {
		if (!product) {
			return res.redirect('/');
		}
		res.status(200).render('admin/edit-product', {
			title: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const {id, title, imageUrl, price, description} = req. body;
	const updateProduct = new Product(id, title, imageUrl, description, price);
	updateProduct.save();
	res.redirect('/admin/products');
}

exports.deleteProduct = (req, res, next) => {
	Product.deleteById(req.body.id);
	res.redirect('/admin/products');
}