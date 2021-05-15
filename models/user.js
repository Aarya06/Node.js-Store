const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
    password: {
		type: String,
		required: true
	},
    resetToken: String,
    tokenExpiry: Date,
	cart: {
		items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]
	}
});

userSchema.methods.addToCart = function(product) {
    const prodIndex = this.cart.items.findIndex(prod => {
        return prod.product.toString() === product._id.toString()
    })

    let newQty = 1;
    const updatedCartItems = [...this.cart.items]

    if (prodIndex >= 0) {
        newQty = this.cart.items[prodIndex].qty + 1;
        updatedCartItems[prodIndex].qty = newQty;
    } else {
        updatedCartItems.push({
            product: product._id,
            qty: newQty
        })
    }
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCartItem = function(orderId) {
    const updatedCartItems = this.cart.items.filter(c => c._id.toString() !== orderId.toString())
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {
        items: []
    };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);