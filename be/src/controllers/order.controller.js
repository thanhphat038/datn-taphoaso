import { orderService } from '../services/index.js';
import OrderDetail from '../models/orderDetail.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { orderDetails, ...orderData } = req.body;
    
    // Create order
    const order = await orderService.create(orderData);

    // Create order details
    if (orderDetails && orderDetails.length > 0) {
      const details = orderDetails.map(detail => ({
        ...detail,
        order_id: order._id
      }));
      await OrderDetail.insertMany(details);
    }

    // Get complete order with details
    const completeOrder = await orderService.findById(order._id, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'address_id' },
        { path: 'voucher_id' }
      ]
    });

    const orderDetailsList = await OrderDetail.find({ order_id: order._id })
      .populate('product_id');

    res.status(201).json({
      success: true,
      data: {
        ...completeOrder.toObject(),
        orderDetails: orderDetailsList
      }
    });
  } catch (error) {
    next(error);
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
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetails(req.params.id);
    if (!order) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Order not found');
    }
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
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
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    // Delete order details first
    await OrderDetail.deleteMany({ order_id: req.params.id });
    
    // Then delete order
    await orderService.delete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    res.json({
      success: true,
      data: orders
    });
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
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get order statistics
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await orderService.calculateOrderStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get recent orders
export const getRecentOrders = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const orders = await orderService.getRecentOrders(limit);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
