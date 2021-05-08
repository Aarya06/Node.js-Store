const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		isAuthenticated: req.session.isLoggedIn
	});
};

exports.postAddProduct = (req, res, next) => {
	Product.create({ ...req.body, user: req.user }).
		then(result => {
			res.redirect('/');
		}).catch(err => {
			console.log(err);
		});
};

exports.getProducts = (req, res, next) => {
	Product.find().
		// select('title price imageUrl -_id').
		// populate('userId').  
		then((products) => {
			res.status(200).render('admin/products', {
				products: products,
				title: 'Products',
				hasProduct: products.length > 0,
				path: '/admin/products',
				isAuthenticated: req.session.isLoggedIn
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
				product: product,
				isAuthenticated: req.session.isLoggedIn
			});
		}).catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res, next) => {
	Product.findByIdAndUpdate(req.body.id, { ...req.body }).then(result => {
		res.redirect('/admin/products');
	}).catch(err => {
		console.log(err)
	})
}

exports.deleteProduct = (req, res, next) => {
	Product.findByIdAndDelete(req.body.id).then(result => {
		res.redirect('/admin/products');
	}).catch(err => {
		console.log(err)
	});
}