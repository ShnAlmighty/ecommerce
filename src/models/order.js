const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ type: String }],
  totalAmount: Number,
  orderBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  discountCode: String,
  created_at: { type: Date, default: new Date() }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
