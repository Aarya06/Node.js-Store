const express = require('express');
const path = require('path');
const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');


router.route('/').get((req, res, next) => {
	const products = adminData.products;
	res.status(200).render('shop', {
		products, 
		title: 'Shop',
		hasProduct: products.length > 0,
		path: '/'
	});
})

module.exports = router;