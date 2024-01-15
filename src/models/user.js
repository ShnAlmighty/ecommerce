const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],
  created_at: { type: Date, default: new Date() }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
