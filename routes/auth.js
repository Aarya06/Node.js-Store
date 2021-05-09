const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')
const isAuthenticated = require('../middleware/isAuthenticated');

router.route('/login')
.get(authController.getLoginForm)
.post(authController.postLogin)

router.route('/logout')
.post(isAuthenticated, authController.logout)

router.route('/signup')
.get(authController.getSignUp)
.post(authController.postSignUp)

module.exports = router;