const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')

router.route('/login')
.get(authController.getLoginForm)
.post(authController.postLogin)

router.route('/logout')
.post(authController.logout)

module.exports = router;