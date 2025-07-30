import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders,
  deleteOrder,
  getOrderProducts
} from '../controllers/order.controller.js';

const router = express.Router();
router.use(authMiddleware);

// Create order (User)
router.post('/', createOrder);

// Get all orders (Admin)
router.get('/', getOrders);

// Get my orders (User)
router.get('/my', getUserOrders);

// Get order stats (Admin)
router.get('/stats', getOrderStats);

// Get recent orders (Admin)
router.get('/recent', getRecentOrders);

// Update order status (Admin)
router.put('/:orderId/status', updateOrderStatus);

// Get order by ID (Admin)
router.get('/:orderId', getOrderById);

// Get products in an order (Admin/User)
router.get('/:orderId/products', getOrderProducts);

// Delete order (Admin)
router.delete('/:orderId', deleteOrder);

export default router;