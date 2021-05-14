const mongoose = require('mongoose');
const User = require('../models/user');
const { MONGO_URI } = require('./env.config');

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(result => {
    console.log('Connected To Database')
})

module.exports = mongoose.connection