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

// Public read-only routes
router.get('/product/:productId', getVariantsByProduct);
router.get('/:id', getVariantById);

// Admin-protected routes
router.use(authMiddleware);
router.use(isAdmin);

router.get('/', getVariants);
router.get('/stats', getVariantStats);
router.patch('/:productId/set-default/:variantId', setDefaultVariant);
router.post('/', createVariant);
router.put('/:id', updateVariant);
router.patch('/:id/toggle-status', toggleVariantStatus);
router.delete('/:id', deleteVariant);

export default router; 