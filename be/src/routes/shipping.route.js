import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  calculateShippingFromAddress,
  calculateShippingFromCoordinates,
  getAddressFromCoordinates,
  getStoreInfo
} from '../controllers/shipping.controller.js';

const router = express.Router();

// Tính phí ship từ địa chỉ (cần auth)
router.post('/calculate', authMiddleware, calculateShippingFromAddress);

// Tính phí ship từ tọa độ (cần auth)
router.post('/calculate-from-coordinates', authMiddleware, calculateShippingFromCoordinates);

// Lấy địa chỉ từ tọa độ (cần auth)
router.get('/get-address-from-coordinates', authMiddleware, getAddressFromCoordinates);

// Lấy thông tin cửa hàng (public)
router.get('/store-info', getStoreInfo);

export default router; 