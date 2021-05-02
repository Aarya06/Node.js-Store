const mongoose = require('mongoose');
const User = require('../models/user');
const { mongoUri } = require('./env.config');

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(result => {
    console.log('Connected To Database')
    User.findOne().then(user => {
        if (!user) {
            User.create({
                name: 'Rajnish Aarya',
                email: 'raj.aarya@gmail.com',
                cart: {
                    items: []
                }
            })
        }
    })
})

module.exports = mongoose.connection