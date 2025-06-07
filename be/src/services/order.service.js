import DBService from './db.service.js';
import Order from '../models/order.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
import productService from './product.service.js';

class OrderService extends DBService {
  constructor() {
    super(Order);
  }

  async createOrder(userId, orderData) {
    // Check and update product stock
    for (const item of orderData.items) {
      await productService.updateStock(item.product_id, item.quantity, 'decrease');
    }

    const order = await this.create({
      user_id: userId,
      ...orderData,
      status: 'pending'
    });

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = await this.findById(orderId);
    
    if (!order) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Order not found');
    }

    // If order is cancelled, return stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await productService.updateStock(item.product_id, item.quantity, 'increase');
      }
    }

    return await this.update(orderId, { status });
  }

  async getUserOrders(userId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ user_id: userId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getOrderDetails(orderId) {
    return await this.model
      .findById(orderId)
      .populate('user_id', 'username email')
      .populate('items.product_id', 'name price images');
  }

  async calculateOrderStats() {
    return await this.model.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$total_amount' }
        }
      }
    ]);
  }

  async getRecentOrders(limit = 10) {
    return await this.model
      .find()
      .sort({ created_at: -1 })
      .limit(limit)
      .populate('user_id', 'username email');
  }
}

export default OrderService; 