const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuthenticated = require('../middleware/isAuthenticated');

router.route('/').get(shopController.getAllProducts);

router.route('/products').get(shopController.getAllProducts);

router.route('/product/:id').get(shopController.getProduct)

router.route('/cart')
.get(isAuthenticated, shopController.getCart)
.post(isAuthenticated, shopController.addToCart);

router.route('/orders').
get(isAuthenticated, shopController.getOrders).
post(isAuthenticated, shopController.placeOrder);

router.route('/order/:id').
get(isAuthenticated, shopController.getInvoice)

router.route('/delete-cart-item').post(isAuthenticated, shopController.deleteCartItem);

module.exports = router;