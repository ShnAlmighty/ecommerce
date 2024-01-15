const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: { type: mongoose.Schema.Types.Mixed },
  totalAmount: {type: Number },
  discountAmount: { type: Number },
  totalQuantity: { type: Number },
  billableAmount: { type: Number },
  orderByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  discountCode: {type: String },
  created_at: { type: Date, default: new Date() }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
