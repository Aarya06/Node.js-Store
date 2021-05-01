const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (mongoUri, cb) => {
    MongoClient.connect(mongoUri, { useUnifiedTopology: true }).
        then(client => {
            console.log('Connected To DB')
            _db = client.db();
            cb();
        }).
        catch(err => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if(_db){
        return _db
    }
    throw 'No Db found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;