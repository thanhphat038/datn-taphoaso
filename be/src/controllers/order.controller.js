import { orderService } from '../services/index.js';
import OrderDetail from '../models/orderDetail.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
import mongoose from 'mongoose';
import {
  created,
  badRequest,
  notFound,
  ok,
  serverError,
  noContent,
  unprocessableEntity
} from '../utils/response.js';

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;

    if (!orderData.address_id || !orderData.items || !orderData.payment_method) {
      return badRequest(res, 'Missing required fields: address_id, items, payment_method');
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return badRequest(res, 'Items must be a non-empty array');
    }

    for (const item of orderData.items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) {
        return unprocessableEntity(res, 'Each item must have product_id and quantity (minimum 1)');
      }
    }

    const order = await orderService.createOrder(userId, orderData);
    
    return created(res, order, 'Order created successfully');
  } catch (error) {
    if (error instanceof AppError) {
      return badRequest(res, error.message);
    }
    return serverError(res, 'Error creating order', error);
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const { user_id, status, from_date, to_date } = req.query;
    const filters = {};

    if (user_id) filters.user_id = user_id;
    if (status) filters.status = status;
    if (from_date || to_date) {
      filters.create_at = {};
      if (from_date) filters.create_at.$gte = new Date(from_date);
      if (to_date) filters.create_at.$lte = new Date(to_date);
    }

    const orders = await orderService.findAll(filters, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'address_id' },
        { path: 'voucher_id' }
      ]
    });

    if (orders.length === 0) {
      return ok(res, [], 'No orders found');
    }

    return ok(res, orders, 'Orders retrieved successfully');
  } catch (error) {
    return serverError(res, 'Error retrieving orders', error);
  }
};

// Get order by id
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequest(res, 'Invalid order ID format');
    }

    const order = await orderService.getOrderDetails(id);
    if (!order) {
      return notFound(res, 'Order not found');
    }

    return ok(res, order, 'Order retrieved successfully');
  } catch (error) {
    return serverError(res, 'Error retrieving order', error);
  }
};

// Update order
export const updateOrder = async (req, res) => {
  try {
    const { status, payment_status, shipping_status } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (shipping_status) updateData.shipping_status = shipping_status;

    const order = await orderService.update(req.params.id, updateData);
    return ok(res, order, 'Order updated successfully');
  } catch (error) {
    return badRequest(res, error.message);
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    await OrderDetail.deleteMany({ order_id: req.params.id });
    await orderService.delete(req.params.id);
    return noContent(res);
  } catch (error) {
    return badRequest(res, error.message);
  }
};

// Get user orders
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    return ok(res, orders);
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(orderId, status);
    return ok(res, order, 'Order status updated successfully');
  } catch (error) {
    next(error);
  }
};

// Get order statistics
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await orderService.calculateOrderStats();
    return ok(res, stats);
  } catch (error) {
    next(error);
  }
};

// Get recent orders
export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const orders = await orderService.getRecentOrders(limit);
    return ok(res, orders);
  } catch (error) {
    next(error);
  }
};
