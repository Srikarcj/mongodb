// /models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  registrationCount: { type: Number, default: 1 },
  loginCount: { type: Number, default: 0 },
  lastLoginDate: Date,
  lastLoginDay: String,
  lastLoginYear: Number,
  lastLoginTime: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
