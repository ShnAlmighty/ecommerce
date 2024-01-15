const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  item_id: { type: String, unique: true, index: true },
  name: { type: String },
  quantity: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  amount: { type: Number },
  created_at: { type: Date, default: new Date() }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
