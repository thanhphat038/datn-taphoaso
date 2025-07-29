import express from 'express';
import {
  createBlogCategory,
  getBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory
} from '../controllers/blogCategory.controller.js';

const router = express.Router();

// Create new blog category
router.post('/', createBlogCategory);

// Get all blog categories
router.get('/', getBlogCategories);

// Get blog category by id
router.get('/:id', getBlogCategoryById);

// Update blog category
router.put('/:id', updateBlogCategory);

// Delete blog category
router.delete('/:id', deleteBlogCategory);

export default router; 