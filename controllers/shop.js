const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const fs = require('fs');
const pdfDocument = require('pdfkit');

exports.getAllProducts = (req, res, next) => {
	const page = req?.query?.page ? parseInt(req.query.page) : 1;
	const size = req?.query?.size ? parseInt(req.query.size) : 2;
	const skip = page > 1 ? (page - 1) * size : 0;
	Product.find().countDocuments().then(totalItems => {
		// const isLast = (page * size) >= totalItems;
		// const isFirst = page == 1;
		const last = Math.ceil(totalItems / size);
		const first = 1;
		const next = (page + 1) >= last ? last : page + 1;
		const prev = (page - 1) <= first ? first : page - 1;
		const current = page;
		Product.find().
			skip(skip).
			limit(size).
			then((products) => {
				const renderPage = req.path === '/' ? 'shop/index': 'shop/product-list';
				const title = req.path === '/' ? 'Shop' : 'Products';
				res.status(200).render(renderPage, {
					products: products,
					title,
					hasProduct: products.length > 0,
					path: req.path,
					totalItems,
					// isLast,
					// isFirst,
					next,
					prev,
					last,
					first,
					current
				});
			})
	})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error)
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
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
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
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
};

exports.addToCart = async (req, res, next) => {
	Product.findById(req.body.id).then(product => {
		return req.user.addToCart(product)
	}).then(result => {
		res.redirect('/cart')
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
};

exports.getOrders = (req, res, next) => {
	Order.find({ user: req.user._id }).then(orders => {
		res.status(200).render('shop/orders', {
			title: 'Orders',
			path: '/orders',
			orders
		});
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
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
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
}

exports.deleteCartItem = (req, res, next) => {
	req.user.deleteCartItem(req.body.id).then(prod => {
		res.redirect('/cart');
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
};

exports.getInvoice = (req, res, next) => {
	Order.findById(req.params.id).then(order => {
		if (!order) {
			return next(new Error('order does not exist'))
		}
		if (order.user.toString() !== req.user._id.toString()) {
			return next(new Error('user unauthorized'))
		}
		const invoice = `invoice-${req.params.id}.pdf`
		const invoicePath = path.join('data', 'invoices', invoice)

		const pdfDoc = new pdfDocument();
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'inline; fileName="' + invoice + '"');
		pdfDoc.pipe(fs.createWriteStream(invoicePath));
		pdfDoc.pipe(res)
		pdfDoc.fontSize(26).text('Invoice', {
			underline: true,
			align: 'center'
		})
		let total = 0;
		pdfDoc.fontSize(16).text('---------------------------------------------------------------------------------------')
		order.products.forEach((product, i) => {
			total = total + (product.product.price * product.qty)
			pdfDoc.text(`${i + 1}. ${product.product.title} --> ${product.product.price} X ${product.qty} = ${product.product.price * product.qty}`)
		})
		pdfDoc.text('---------------------------------------------------------------------------------------')
		pdfDoc.fontSize(20).text(`Total = ${total}`)
		pdfDoc.end()
	}).catch(err => {
		const error = new Error(err);
		error.httpStatusCode = 500;
		return next(error)
	})
}