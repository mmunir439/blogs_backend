const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Register route
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'This email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user: { username, email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login route
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email or password does not match' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email or password does not match' });
    }

// Generate JWT token
const token = jwt.sign(
  { userId: user._id, username: user.username, role: user.role },
  process.env.JWT_SECRET || 'yoursecretkey',
  { expiresIn: '7d' } // Set token to expire in 7 days
);

    res.json({
      message: 'Login successful',
      token,
      user: { username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    // Only allow admin or the user themself to access this info
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get only the loged in information
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update user (user can update their own info)
exports.updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.json({ message: 'User updated successfully', user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};