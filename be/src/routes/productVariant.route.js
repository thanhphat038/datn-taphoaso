import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createVariant,
  getVariantsByProduct,
  getVariantById,
  updateVariant,
  deleteVariant,
  getDefaultVariant,
  getVariantsByUnit,
  updateStock,
  getAvailableUnits,
  searchVariants
} from '../controllers/productVariant.controller.js';

const router = express.Router();

// Tạo biến thể sản phẩm mới (Admin only)
router.post('/', authMiddleware, createVariant);

// Lấy tất cả biến thể của một sản phẩm (Public)
router.get('/product/:productId', getVariantsByProduct);

// Lấy biến thể theo ID (Public)
router.get('/:variantId', getVariantById);

// Cập nhật biến thể sản phẩm (Admin only)
router.put('/:variantId', authMiddleware, updateVariant);

// Xóa biến thể sản phẩm (Admin only)
router.delete('/:variantId', authMiddleware, deleteVariant);

// Lấy biến thể mặc định của sản phẩm (Public)
router.get('/product/:productId/default', getDefaultVariant);

// Lấy biến thể theo đơn vị (Public)
router.get('/product/:productId/unit', getVariantsByUnit);

// Cập nhật số lượng tồn kho (Admin only)
router.patch('/:variantId/stock', authMiddleware, updateStock);

// Lấy tất cả đơn vị có sẵn (Public)
router.get('/units/available', getAvailableUnits);

// Tìm kiếm biến thể (Public)
router.get('/product/:productId/search', searchVariants);

export default router; 