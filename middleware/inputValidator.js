const { body } = require('express-validator');
const User = require('../models/user');

exports.user = () => [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom(value => {
            return User.findOne({ email: value }).then(user => {
                if (user) {
                    return Promise.reject('E-mail already in use');
                }
            });
        })
        .normalizeEmail(),
    body('password', 'Please enter an alpha-numeric password of atleast 5 characters')
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
]

exports.product = () => [
    body('title', 'Invalid product title')
        .trim()
        .isString()
        .isLength({min: 3}),
    body('price', 'Invalid product Price')
        .trim()
        .isCurrency(),
    body('description', 'Invalid product description')
        .trim()
        .isLength({min: 5, max: 400})
]