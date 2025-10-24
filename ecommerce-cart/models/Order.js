const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [
{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }
],
total: { type: Number, required: true },
coupon: { code: String, discountAmount: Number },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);