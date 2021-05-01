const {getDb} = require('../config/mongo.config');
const { getObjectId } = require('../utils/mongo');

module.exports = class Product {
	constructor({id, title, imageUrl, description, price, userId}) {
		this._id = id ? getObjectId(id) : null;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
		this.userId = userId
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			dbOp = db.collection('Products').updateOne({ _id: this._id }, { $set: this })
		} else {
			dbOp = db.collection('Products').insertOne(this)
		}
		return dbOp
			.then(res => {
			}
			).catch(err => {
				console.log(err)
			})
	}

	static fetchAllProducts() {
		const db = getDb();
		return db.collection('Products').find().toArray()
		.then(res => {
			return res
		})
		.catch(err => {
			console.log(err)
		})
	}

	static findById(id) {
		const db = getDb();
		return db.collection('Products').find({_id: getObjectId(id)}).next()
		.then(res => {
			return res
		})
		.catch(err => {
			console.log(err)
		})
	}

	static deleteById(id){
		const db = getDb();
		return db.collection('Products').deleteOne({_id: getObjectId(id)})
		.then(res => {
			return res
		})
		.catch(err => {
			console.log(err)
		})
	}
};