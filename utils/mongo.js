const mongodb = require('mongodb');

exports.getObjectId = (id) => new mongodb.ObjectId(id); 