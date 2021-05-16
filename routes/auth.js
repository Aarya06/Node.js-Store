const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth')
const isAuthenticated = require('../middleware/isAuthenticated');
const validator = require('../middleware/inputValidator');

router.route('/login')
.get(authController.getLoginForm)
.post(authController.postLogin)

router.route('/logout')
.post(isAuthenticated, authController.logout)

router.route('/signup')
.get(authController.getSignUp)
.post(validator.user(), authController.postSignUp)

router.route('/reset')
.get(authController.getResetPassword)
.post(authController.postResetPassword)

router.route('/reset/:token')
.get(authController.getNewPassword)

router.route('/new-password')
.post(authController.postNewPassword)

module.exports = router;