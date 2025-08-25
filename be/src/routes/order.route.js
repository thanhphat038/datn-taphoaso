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
  getOrderProducts,
  getOrderWithDeadline,
  getOrderByVnpayRef,
  updateOrderVnpayInfo,
  cancelOrder
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

// Get order by ID (Admin)
router.get('/:orderId', getOrderById);

// Update order status (Admin)
router.put('/:orderId/status', updateOrderStatus);

// Cancel order (User)
router.patch('/:orderId/cancel', cancelOrder);

// Update VNPAY info for order (admin/debug)
router.put('/:orderId/vnpay-info', updateOrderVnpayInfo);

// Get products in an order (Admin/User)
router.get('/:orderId/products', getOrderProducts);

// Get order with deadline info (Admin/User)
router.get('/:orderId/deadline', getOrderWithDeadline);

// Get order by VNPAY reference (Admin/User)
router.get('/find-by-vnpay-ref/:vnpayRef', getOrderByVnpayRef);

// Delete order (Admin)
router.delete('/:orderId', deleteOrder);

export default router;