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

router.route('/edit-product').post(adminController.postEditProduct)

router.route('/edit-product/:id').get(adminController.getEditProduct)

router.route('/delete-product').post(adminController.deleteProduct)

module.exports = router;