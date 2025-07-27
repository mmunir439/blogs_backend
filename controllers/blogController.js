const Blog = require('../models/blogs');
// Get all blogs (public route)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username email');
    if (!blogs.length) {
      return res.json({ message: 'No blogs found.' });
    }
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get all blogs for the logged-in user (protected)
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.userId });
    if (!blogs.length) {
      return res.json({ message: 'No blogs found for this user.' });
    }
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Create a new blog (protected)
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const blog = new Blog({
      title,
      content,
      tags,
      author: req.user.userId // set by authMiddleware
    });
    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a blog (protected)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Only the author can update
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;
    blog.updatedAt = Date.now();

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a blog (protected)
// Delete a blog (protected)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Only the author can delete
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get all blogs by a specific user (admin only)
exports.getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).populate('author', 'username email');
    if (!blogs.length) {
      return res.json({ message: 'No blogs found for this user.' });
    }
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};