import express from 'express';
import {
  getVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  toggleVariantStatus,
  getVariantsByProduct,
  getVariantStats,
  setDefaultVariant
} from '../controllers/variant.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);
router.use(isAdmin);

// Get all variants with filters and pagination
router.get('/', getVariants);

// Get variant statistics
router.get('/stats', getVariantStats);

// Get variants by product ID
router.get('/product/:productId', getVariantsByProduct);

// Set default variant for a product
router.patch('/:productId/set-default/:variantId', setDefaultVariant);

// Get variant by ID
router.get('/:id', getVariantById);

// Create new variant
router.post('/', createVariant);

// Update variant
router.put('/:id', updateVariant);

// Toggle variant status
router.patch('/:id/toggle-status', toggleVariantStatus);

// Delete variant
router.delete('/:id', deleteVariant);

export default router; 