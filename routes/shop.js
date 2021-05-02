const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.route('/').get(shopController.getHome);

router.route('/products').get(shopController.getAllProducts);

router.route('/product/:id').get(shopController.getProduct)

router.route('/cart')
.get(shopController.getCart)
.post(shopController.addToCart);

router.route('/checkout').get(shopController.getCheckout);

router.route('/orders').
get(shopController.getOrders).
post(shopController.placeOrder);

router.route('/delete-cart-item').post(shopController.deleteCartItem);

module.exports = router;