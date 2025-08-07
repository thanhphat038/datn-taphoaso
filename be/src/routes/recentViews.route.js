import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  addView,
  getRecentViews,
  removeView,
  clearAllViews,
  getViewCount,
  getSimilarProducts
} from '../controllers/recentViews.controller.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authMiddleware);

// Thêm sản phẩm vào danh sách xem gần đây
router.post('/add', addView);

// Lấy danh sách sản phẩm xem gần đây
router.get('/', getRecentViews);

// Lấy số lượng sản phẩm xem gần đây
router.get('/count', getViewCount);

// Xóa một sản phẩm khỏi danh sách xem gần đây
router.delete('/:productId', removeView);

// Xóa tất cả sản phẩm khỏi danh sách xem gần đây
router.delete('/', clearAllViews);

// Lấy sản phẩm tương tự
router.get('/similar/:productId', getSimilarProducts);

export default router; 