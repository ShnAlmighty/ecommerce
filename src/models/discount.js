const mongoose = require('mongoose');

const discountsSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  discountCode: { type: String },
  created_at: { type: Date, default: new Date() }
});

const Discount = mongoose.model('discounts', discountsSchema);

module.exports = Discount;
