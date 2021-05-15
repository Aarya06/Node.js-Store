const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.status(200).render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		editing: false
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
	Product.find({user: req.user._id}).
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
			console.log(err)
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit === 'true';
	if (!editMode) {
		return res.redirect('/');
	}
	Product.findOne({_id: req.params.id, user: req.user._id})
		.then(product => {
			if(!product){
				return res.redirect('/admin/products')
			}
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
	Product.findOneAndUpdate({_id: req.body.id, user: req.user._id}, { ...req.body }).then(result => {
		res.redirect('/admin/products');
	}).catch(err => {
		console.log(err)
	})
}

exports.deleteProduct = (req, res, next) => {
	Product.findOneAndDelete({_id: req.body.id, user: req.user._id}).then(result => {
		res.redirect('/admin/products');
	}).catch(err => {
		console.log(err)
	});
}