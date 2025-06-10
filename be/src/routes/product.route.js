import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  getProductsByCategory,
  getRelatedProducts
} from '../controllers/product.controller.js';

const router = express.Router();

// Create new product
router.post('/', createProduct);

// Get all products
router.get('/', getProducts);

// Get products by category
router.get('/category/:categoryId', getProductsByCategory);

// Get related products
router.get('/:id/related', getRelatedProducts);

// Get product by id
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// Deactivate product
router.patch('/:id/deactivate', deactivateProduct);

export default router;
