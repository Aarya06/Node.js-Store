const {getDb} = require('../config/mongo.config');
const { getObjectId } = require('../utils/mongo');

module.exports = class User {
	constructor({name, email, cart, _id}) {
		this.name = name;
        this.email = email;
		this.cart = cart;
		this._id = _id;
	}

	save() {
		const db = getDb();
		return db.collection('Users').insertOne(this)
	}

	addToCart(productId) {
		const prodIndex = this.cart.items.findIndex(prod => {
			return prod.productId.toString() === productId.toString()
		})

		let newQty = 1;
		const updatedCartItems = [...this.cart.items]

		if (prodIndex >= 0) {
			newQty = this.cart.items[prodIndex].qty + 1;
			updatedCartItems[prodIndex].qty = newQty;
		} else {
			updatedCartItems.push({
				productId: getObjectId(productId),
				qty: newQty
			})
		}
		const updatedCart = { items: updatedCartItems }
		const db = getDb();
		return db.collection('Users').updateOne({ _id: getObjectId(this._id) }, { $set: { cart: updatedCart } })
	}

	getCartItems(){
		const db = getDb();
		const prodIds = this.cart.items.map(prod => prod.productId)
		return db.collection('Products').find({_id: {$in: prodIds}}).toArray().then(prod => {
			return prod.map(p => {
				return {
					...p,
					qty: this.cart.items.find(c => c.productId.toString() === p._id.toString()).qty
				}
			})
		})
	}

	deleteCartItem(productId) {
		const updatedCartItems = this.cart.items.filter(c => c.productId.toString() !== productId.toString())
		const updatedCart = { items: updatedCartItems }
		const db = getDb();
		return db.collection('Users').updateOne({ _id: getObjectId(this._id) }, { $set: { cart: updatedCart } })
	}

	addOrder(){
		const db = getDb();
		return this.getCartItems().then(items => {
			const order = {
				items,
				user: {
					_id: getObjectId(this._id),
					email: this.email
				}
			}
			return db.collection('Orders').insertOne(order).then(res => {
				this.cart = [];
				const updatedCart = { items: [] }
				return db.collection('Users').updateOne({ _id: getObjectId(this._id) }, { $set: { cart: updatedCart } })
			})
		})
	}

	getOrders() {
		const db = getDb();
		return db.collection('Orders').find({ 'user._id': getObjectId(this._id) }).toArray()
	}

	static findById(id) {
		const db = getDb();
		return db.collection('Users').findOne({_id: getObjectId(id)})
	}
};