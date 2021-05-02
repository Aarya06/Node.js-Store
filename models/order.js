const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
	products: [{
        product: {
            type: Object,
            require: true
        },
        qty: {
            type: Number,
            required: true
        }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Order', orderSchema);