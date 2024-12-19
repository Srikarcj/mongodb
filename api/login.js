// /api/login.js
const bcrypt = require('bcryptjs');
const moment = require('moment');
const connectDB = require('../db');
const User = require('../models/user');

module.exports = async (req, res) => {
  await connectDB();

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Increment login count
  user.loginCount += 1;

  // Update last login details
  const now = moment();
  user.lastLoginDate = now.format('YYYY-MM-DD');
  user.lastLoginDay = now.format('dddd');
  user.lastLoginYear = now.year();
  user.lastLoginTime = now.format('HH:mm:ss');

  // Save updated user data
  await user.save();

  res.status(200).json({ message: `Welcome back, ${user.name}!`, userDetails: user });
};
