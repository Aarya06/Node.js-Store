const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router
	.route('/add-product')
	.get(adminController.getAddProduct)
	.post(adminController.postAddProduct);

router
	.route('/products')
	.get(adminController.getProducts)

module.exports = router;