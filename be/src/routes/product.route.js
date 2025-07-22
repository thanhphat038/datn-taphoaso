import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  activateProduct,
  deactivateProduct,
  getProductsByCategory,
  searchProducts,
  getTopRatedProducts,
  getNewArrivals,
  getRelatedProducts,
} from '../controllers/product.controller.js';
import { getReviewsByProductId } from '../controllers/review.controller.js';

const router = express.Router();

// Create new product
router.post('/', createProduct);

// Get all products (hỗ trợ filter, search, sort, pagination)
router.get('/', getProducts);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:categoryId', getProductsByCategory);

// Get top rated products
router.get('/top-rated', getTopRatedProducts);

// Get new arrivals
router.get('/new-arrivals', getNewArrivals);

// Get related products
router.get('/:id/related', getRelatedProducts);

// Lấy review theo productId
router.get('/:productId/reviews', getReviewsByProductId);

// Get product by id
router.get('/:id', getProductById);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// Activate product
router.patch('/:id/activate', activateProduct);

// Deactivate product
router.patch('/:id/deactivate', deactivateProduct);

export default router;
