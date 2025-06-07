import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Create new category
router.post('/', createCategory);

// Get all categories
router.get('/', getCategories);

// Get category by id
router.get('/:id', getCategoryById);

// Update category
router.put('/:id', updateCategory);

// Delete category
router.delete('/:id', deleteCategory);

export default router; 