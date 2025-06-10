import DBService from './db.service.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
import productService from './product.service.js';
import addressService from './address.service.js';
import voucherService from './voucher.service.js';

class OrderService extends DBService {
  constructor() {
    super(Order);
  }

  async createOrder(userId, orderData) {
    const { address_id, items, voucher_code, payment_method, note } = orderData;

    // Get address information
    const address = await addressService.findById(address_id);
    if (!address) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Address not found');
    }

    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      const product = await productService.findById(item.product_id);
      if (!product) {
        throw new AppError(ERROR_CODES.DB_NOT_FOUND, `Product ${item.product_id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK, `Insufficient stock for product ${product.name}`);
      }
      total_amount += product.price * item.quantity;
    }

    // Apply voucher if provided
    let voucher_id = null;
    if (voucher_code) {
      const voucher = await voucherService.validateVoucher(voucher_code, userId, total_amount);
      if (voucher) {
        voucher_id = voucher._id;
        const discountAmount = voucher.discount_type === 'percentage' 
          ? (total_amount * voucher.discount_value / 100)
          : voucher.discount_value;
        total_amount -= Math.min(discountAmount, voucher.max_discount || discountAmount);
      }
    }

    // Create order
    const order = await this.create({
      user_id: userId,
      voucher_id,
      total_amount,
      payment_method,
      address: `${address.chitlet}, ${address.ward}, ${address.district}`,
      receiver: address.ten_nguoi_nhan,
      sdt: address.sdt,
      note,
      order_status: 'pending'
    });

    // Create order details
    for (const item of items) {
      const product = await productService.findById(item.product_id);
      await OrderDetail.create({
        order_id: order._id,
        product_id: item.product_id,
        qty: item.quantity,
        cur_price: product.price
      });
      // Update product stock
      await productService.updateStock(item.product_id, item.quantity, 'decrease');
    }

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