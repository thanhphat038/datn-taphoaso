import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blog.controller.js';

const router = express.Router();

// Create new blog
router.post('/', createBlog);

// Get all blogs
router.get('/', getBlogs);

// Get blog by id
router.get('/:id', getBlogById);

// Update blog
router.put('/:id', updateBlog);

// Delete blog
router.delete('/:id', deleteBlog);

export default router; 