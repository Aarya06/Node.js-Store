const mongoose = require('mongoose');
const User = require('../models/user');
const { mongoUri } = require('./env.config');

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(result => {
    console.log('Connected To Database')
})

module.exports = mongoose.connection