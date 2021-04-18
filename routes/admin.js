const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const router = express.Router();

const products = [];

router
	.route('/add-product')
	.get((req, res, next) => {
		res.status(200).render('add-product', {
			title: 'add-products',
			path: '/admin/add-product'
		});
	})
	.post((req, res, next) => {
		products.push({title: req.body.title})
		console.log('Post Success !');
		res.redirect('/');
	});

exports.routes = router;
exports.products = products;
