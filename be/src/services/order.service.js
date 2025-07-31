import DBService from './db.service.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

import AddressService from './address.service.js';
import VoucherService from './voucher.service.js';
import ProductService from './product.service.js';

const productService = new ProductService();
const addressService = new AddressService();
const voucherService = new VoucherService();

class OrderService extends DBService {
  constructor() {
    super(Order);
  }

  async getAllOrders(filter = {}, options = {}) {
    const { sort = { created_at: -1 } } = options;

    const orders = await this.model
      .find(filter)
      .sort(sort)
      .populate('user_id', 'name email') // nếu cần thông tin người dùng
      .lean();

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDetail.find({ order_id: order._id }).populate('product_id');
        return { ...order, items };
      })
    );

    return {
      ordersWithItems,
      total: ordersWithItems.length
    };
  }

  async getOrderById(orderId) {
    return await this.model.findById(orderId).populate('user_id');
  }

  async createOrder(orderData) {
    const { user_id, address, receiver, sdt, items, voucher_code, payment_method, note } = orderData;

    if (!user_id || !address?.trim() || !receiver?.trim() || !sdt?.trim() || !Array.isArray(items) || items.length === 0 || !payment_method) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing required fields');
    }

    let total_amount = 0;
    for (const item of items) {
      const product = await productService.findById(item.product_id);
      if (!product) throw new AppError(ERROR_CODES.DB_NOT_FOUND, `Product ${item.product_id} not found`);
      if (product.stock < item.qty) throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK, `Insufficient stock for product ${product.name}`);
      total_amount += product.price * item.qty;
    }

    let voucher_id = null;
    if (voucher_code) {
      const voucher = await voucherService.validateVoucher(voucher_code, user_id, total_amount);
      if (voucher) {
        voucher_id = voucher._id;
        const discountAmount = voucher.discount_type === 'percentage'
          ? (total_amount * voucher.discount_value / 100)
          : voucher.discount_value;
        total_amount -= Math.min(discountAmount, voucher.max_discount || discountAmount);
      }
    }

    const order = await this.create({
      user_id,
      voucher_id,
      total_amount,
      payment_method,
      address,
      receiver,
      sdt,
      note,
      order_status: 'pending'
    });

    for (const item of items) {
      const product = await productService.findById(item.product_id);
      await OrderDetail.create({
        order_id: order._id,
        product_id: item.product_id,
        qty: item.qty,
        cur_price: product.price
      });
      await productService.updateStock(item.product_id, item.qty, 'decrease');
    }

    return order;
  }

  async updateOrderStatus(orderId, status) {
    const order = await this.findById(orderId);
    if (!order) throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Order not found');
    return await this.update(orderId, { order_status: status });
  }

  async getUserOrders(userId) {
    return await this.model.find({ user_id: userId }).sort({ create_at: -1 });
  }

  async getOrdersByUser(userId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    const query = { user_id: userId };

    const [orders, total] = await Promise.all([
      this.model.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(query)
    ]);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderDetail.find({ order_id: order._id }).populate('product_id');
        return { ...order.toObject(), items };
      })
    );

    return {
      data: ordersWithItems,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getOrderDetails(orderId) {
    const order = await this.model.findById(orderId);
    if (!order) return null;

    const items = await OrderDetail.find({ order_id: orderId }).populate('product_id');
    return { ...order.toObject(), items };
  }

  async calculateOrderStats() {
    return await this.model.aggregate([
      { $group: { _id: '$order_status', count: { $sum: 1 }, total: { $sum: '$total_amount' } } }
    ]);
  }

  async calculateCartTotal(userId) {
    const items = await this.model.find({ user_id: userId }).populate('product_id');
    
    return items.reduce((total, item) => {
      const price = item.price || (item.product_id?.price || 0); 
      return total + (price * item.qty);
    }, 0);
  }

  async updateStatus(orderId, status) {
    const validStatuses =['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Invalid order status');
    }

    const order = await this.update(orderId, { order_status: status });

    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    return order;
  }

  async getRecentOrders(limit = 10) {
    return await this.model.find().sort({ create_at: -1 }).limit(limit).populate('user_id');
  }

  async getOrderStatistics() {
  const totalOrders = await this.model.countDocuments();
  const totalRevenue = await this.model.aggregate([
    { $match: { order_status: { $in: ['completed'] } } },
    { $group: { _id: null, total: { $sum: '$total_amount' } } }
  ]);

  const pendingOrders = await this.model.countDocuments({ order_status: 'pending' });
  const completedOrders = await this.model.countDocuments({ order_status: 'completed' });
  const cancelledOrders = await this.model.countDocuments({ order_status: 'cancelled' });

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue: totalRevenue[0]?.total || 0
  };
}
}

export default OrderService;