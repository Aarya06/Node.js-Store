const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const router = express.Router();

router
	.route('/add-product')
	.get((req, res, next) => {
		res.status(200).sendFile(path.join(rootDir, 'views', 'add-product.html'));
	})
	.post((req, res, next) => {
		res.status(200).send(req.body.title);
	});

module.exports = router;