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
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/top-rated', getTopRatedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id/related', getRelatedProducts);
router.get('/:productId/reviews', getReviewsByProductId);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authMiddleware, isAdmin, createProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.patch('/:id/activate', authMiddleware, isAdmin, activateProduct);
router.patch('/:id/deactivate', authMiddleware, isAdmin, deactivateProduct);

export default router;
