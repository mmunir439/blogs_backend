require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});