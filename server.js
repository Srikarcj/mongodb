const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const moment = require('moment');  // For handling date and time
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userAuth', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  registrationCount: { type: Number, default: 1 },  // Track how many times the user registered
  loginCount: { type: Number, default: 0 },         // Track how many times the user has logged in
  lastLoginDate: Date,                             // Store the last login date and time
  lastLoginDay: String,                            // Store the day of the last login
  lastLoginYear: Number,                           // Store the year of the last login
  lastLoginTime: String,                           // Store the exact time of the last login
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
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
    registrationCount: 1,  // Initialize registration count to 1
  });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
});

// Login Route
app.post('/login', async (req, res) => {
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

  // Update the last login details
  const now = moment();
  user.lastLoginDate = now.format('YYYY-MM-DD'); // Date format
  user.lastLoginDay = now.format('dddd'); // Day of the week (e.g., "Monday")
  user.lastLoginYear = now.year(); // Current year
  user.lastLoginTime = now.format('HH:mm:ss'); // Time format (e.g., "14:30:00")

  // Save updated user data
  await user.save();

  res.status(200).json({ message: `Welcome back, ${user.name}!`, userDetails: user });
});

// Start the server
app.listen(3005, () => {
  console.log('Server running on http://localhost:3001');
});
