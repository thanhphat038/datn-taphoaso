import DBService from './db.service.js';
import Order from '../models/order.model.js';
import OrderDetail from '../models/orderDetail.model.js';

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

import AddressService from './address.service.js';
import VoucherService from './voucher.service.js';
import ProductService from './product.service.js';
import Product from '../models/product.model.js';

const productService = new ProductService();
const addressService = new AddressService();
const voucherService = new VoucherService();

class OrderService extends DBService {
  constructor() {
    super(Order);
  }

  async getAllOrders(filter = {}, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    const orders = await this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'name email') // nếu cần thông tin người dùng
      .lean();

      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await OrderDetail.find({ order_id: order._id }).populate('product_id');
          return { ...order, items };
        })
      );
  
      const total = await this.model.countDocuments(filter);
  
      return {
        ordersWithItems,
        total,
        page,
        limit
      };
    }

  async getOrderById(orderId) {
    console.log('🔍 Debug - getOrderById called with orderId:', orderId);
    const order = await this.model.findById(orderId).populate('user_id');
    console.log('🔍 Debug - Found order:', order);
    if (order) {
      const items = await OrderDetail.find({ order_id: order._id }).populate('product_id');
      console.log('🔍 Debug - Found items:', items);
      
      // If no items found, create dummy data for testing
      if (!items || items.length === 0) {
        console.log('🔍 Debug - No items found, creating dummy data');
        const product = await Product.findOne();
        if (product) {
          const dummyItems = [{
            _id: 'dummy_id',
            order_id: order._id,
            product_id: product,
            qty: 2,
            cur_price: product.price
          }];
          console.log('🔍 Debug - Created dummy items:', dummyItems);
          const result = { ...order.toObject(), items: dummyItems };
          console.log('🔍 Debug - Final result with dummy data:', result);
          return result;
        }
      }
      
      const result = { ...order.toObject(), items };
      console.log('🔍 Debug - Final result:', result);
      return result;
    }
    return order;
  }

  async getOrderWithDeadline(orderId) {
    const order = await this.model.findById(orderId)
      .populate('user_id')
      .select('_id total_amount order_status payment_method payment_deadline create_at');
    
    if (!order) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Order not found');
    }

    return {
      id: order._id,
      total_amount: order.total_amount,
      order_status: order.order_status,
      payment_method: order.payment_method,
      payment_deadline: order.payment_deadline,
      created_at: order.create_at
    };
  }

  async getOrderByVnpayRef(vnpayTxnRef) {
    const order = await this.model.findOne({ vnpay_txn_ref: vnpayTxnRef })
      .populate('user_id')
      .select('_id total_amount order_status payment_method payment_deadline create_at vnpay_txn_ref');
    
    if (!order) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Order not found with this VNPAY reference');
    }

    return {
      id: order._id,
      total_amount: order.total_amount,
      order_status: order.order_status,
      payment_method: order.payment_method,
      payment_deadline: order.payment_deadline,
      created_at: order.create_at,
      vnpay_txn_ref: order.vnpay_txn_ref
    };
  }

  async createOrder(orderData) {
    const { user_id, address, receiver, sdt, items, voucher_code, payment_method, note } = orderData;

    console.log('🔍 Debug - createOrder called with items:', items);

    if (!user_id || !address?.trim() || !receiver?.trim() || !sdt?.trim() || !Array.isArray(items) || items.length === 0 || !payment_method) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing required fields');
    }

    let total_amount = 0;
    for (const item of items) {
      console.log('🔍 Debug - Processing item:', item);
      const product = await productService.findById(item.product_id);
      if (!product) throw new AppError(ERROR_CODES.DB_NOT_FOUND, `Product ${item.product_id} not found`);
      if (product.stock < item.qty) throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK, `Insufficient stock for product ${product.name}`);
      total_amount += product.price * item.qty;
    }
    // Luôn cộng phí ship 15000
    total_amount += 15000;
    let voucher_id = null;
    if (voucher_code) {
      const voucher = await voucherService.validateVoucherCode(voucher_code, user_id, total_amount);
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

    console.log('🔍 Debug - Created order:', order._id);

    for (const item of items) {
      console.log('🔍 Debug - Creating OrderDetail for item:', item);
      const product = await productService.findById(item.product_id);
      const orderDetail = await OrderDetail.create({
        order_id: order._id,
        product_id: item.product_id,
        qty: item.qty,
        cur_price: product.price
      });
      console.log('🔍 Debug - Created OrderDetail:', orderDetail);
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

  async getProductsInOrder(orderId) {
    // Lấy tất cả OrderDetail theo orderId và populate product_id
    return await OrderDetail.find({ order_id: orderId }).populate('product_id');
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
    const validStatuses =['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

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