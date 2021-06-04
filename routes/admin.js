const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const validator = require('../middleware/inputValidator');
const isAuthenticated = require('../middleware/isAuthenticated');

router
	.route('/add-product')
	.get(isAuthenticated, adminController.getAddProduct)
	.post(isAuthenticated, validator.product(), adminController.postAddProduct);

router
	.route('/products')
	.get(isAuthenticated, adminController.getProducts)

router.route('/edit-product/:id').get(isAuthenticated, adminController.getEditProduct)

router.route('/edit-product').post(isAuthenticated, validator.product(), adminController.postEditProduct)

router.route('/product/:id').delete(isAuthenticated, adminController.deleteProduct)

module.exports = router;