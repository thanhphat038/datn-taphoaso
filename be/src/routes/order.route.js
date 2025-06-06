import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../controllers/order.controller.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get all orders
router.get('/', getOrders);

// Get order by id
router.get('/:id', getOrderById);

// Update order
router.put('/:id', updateOrder);

// Delete order
router.delete('/:id', deleteOrder);

export default router;
