const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');

// Public route: Get all blogs
router.get('/', blogController.getAllBlogs);
// Protected: Create a new blog
router.post('/createblog', authMiddleware, blogController.createBlog);

// Protected: Get all blogs for the logged-in user
router.get('/myblogs', authMiddleware, blogController.getUserBlogs);

// Protected: Get a blog by ID
router.get('/:id', authMiddleware, blogController.getBlogById);
// Protected: Update a blog
router.put('/:id', authMiddleware, blogController.updateBlog);

// Protected: Delete a blog
router.delete('/:id', authMiddleware, blogController.deleteBlog);
// In your blog router file
router.get('/user/:userId', authMiddleware, adminMiddleware, blogController.getBlogsByUser);

module.exports = router;