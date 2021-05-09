const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/isAuthenticated');

router
	.route('/add-product')
	.get(isAuthenticated, adminController.getAddProduct)
	.post(isAuthenticated, adminController.postAddProduct);

router
	.route('/products')
	.get(isAuthenticated, adminController.getProducts)

router.route('/edit-product/:id').get(isAuthenticated, adminController.getEditProduct)

router.route('/edit-product').post(isAuthenticated, adminController.postEditProduct)

router.route('/delete-product').post(isAuthenticated, adminController.deleteProduct)

module.exports = router;