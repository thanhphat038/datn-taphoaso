import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  calculateShippingFromAddress,
  getStoreInfo
} from '../controllers/shipping.controller.js';

const router = express.Router();

// Tính phí ship từ địa chỉ (cần auth) - Vietmap API
router.post('/calculate-from-address', authMiddleware, calculateShippingFromAddress);

// Tính phí ship từ địa chỉ (cần auth) - Free API
router.post('/calculate', authMiddleware, calculateShippingFromAddress);

// Lấy thông tin cửa hàng (public)
router.get('/store-info', getStoreInfo);

export default router; 