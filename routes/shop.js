const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shop');

router.route('/').get(shopController.getHome);

router.route('/products').get(shopController.getAllProducts);

router.route('/cart').get(shopController.getCart);

router.route('/checkout').get(shopController.getCheckout);

router.route('/orders').get(shopController.getOrders);

module.exports = router;