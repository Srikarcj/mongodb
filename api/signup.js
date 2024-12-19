// /api/signup.js
const bcrypt = require('bcryptjs');
const connectDB = require('../db');
const User = require('../models/user');

module.exports = async (req, res) => {
  await connectDB();

  const { name, email, password, phone, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    registrationCount: 1,
  });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
};
