const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};

// Register route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// Get all users (admin only)
router.get('/all', authMiddleware, adminMiddleware, userController.getAllUsers);

// Update user (user can update their own info)
router.put('/update', authMiddleware, userController.updateUser);
router.get('/', authMiddleware, userController.getMe);

module.exports = router;