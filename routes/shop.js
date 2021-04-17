const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const router = express.Router();

router.route('/').get((req, res, next) => {
	res.status(200).sendFile(path.join(rootDir, 'views', 'shop.html'));
})

module.exports = router;