const express = require('express');
const router = express.Router();

const productsController = require('../controllers/products');

router
	.route('/add-product')
	.get(productsController.getAddProduct)
	.post(productsController.postAddProduct);

module.exports = router;