// order.controller.js
import OrderService from '../services/order.service.js';
import CartService from '../services/cart.service.js';
import VoucherService from '../services/voucher.service.js';
import ProductService from '../services/product.service.js';

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

const orderService = new OrderService();
const cartService = new CartService();
const productService = new ProductService();

export const createOrder = async (req, res, next) => {
  try {
    const { address, receiver, sdt, items, payment_method, note, voucher_code } = req.body;

    if (!address || !receiver || !sdt || !payment_method) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing required fields');
    }

    const userId = req.user.id;
    const cart = await cartService.getCart(userId);

    if (!cart || !cart.items?.length) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cart is empty');
    }

    for (const item of items) {
      console.log('Item:', item);
      console.log('Product ID:', item.product_id);

      const product = await productService.findById(item.product_id);
      if (!product) {
        throw new AppError(ERROR_CODES.NOT_FOUND, `Product with ID ${item.product_id} not found`);
      }
    }

    let voucher = null;
    if (voucher_code) {
      voucher = await voucherService.findValidVoucherByCode(voucher_code, userId);
      if (!voucher) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid or expired voucher');
      }
    }

    const order = await orderService.createOrder({
      user_id: userId,
      address,
      receiver,
      sdt,
      payment_method,
      note,
      items,
      voucher_code,
      voucher, // optional, may be null
    });

    await cartService.clearCart(userId);

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const createbuyNowOrder = async (req, res, next) => {
  try {
    const { address, receiver, sdt, payment_method, note, product_id, quantity = 1, voucher } = req.body;

    if (!address || !receiver || !sdt || !payment_method || !product_id) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing required fields');
    }

    const userId = req.user.id;

    const product = await productService.findById(product_id);
    if (!product) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Product not found');
    }

    const order = await orderService.createOrder({
      user_id: userId,
      voucher,
      address,
      receiver,
      sdt,
      payment_method,
      note,
      items: [
        {
          product_id,
          quantity
        }
      ]
    });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order || order.user_id.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderService.updateStatus(orderId, status);
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await orderService.getOrderStatistics();
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

export const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getRecentOrders();
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deleted = await orderService.delete(orderId);

    if (!deleted) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) { next(err); }
};

export const getOrderProducts = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const products = await orderService.getProductsInOrder(orderId);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getOrderWithDeadline = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const orderInfo = await orderService.getOrderWithDeadline(orderId);
    res.json({ success: true, data: orderInfo });
  } catch (err) {
    next(err);
  }
};

export const getOrderByVnpayRef = async (req, res, next) => {
  try {
    const { vnpayRef } = req.params;
    const orderInfo = await orderService.getOrderByVnpayRef(vnpayRef);
    res.json({ success: true, data: orderInfo });
  } catch (err) {
    next(err);
  }
};

// API cho phép cập nhật trạng thái, mã lỗi, vnp_TxnRef, error message cho order (admin/debug)
export const updateOrderVnpayInfo = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { order_status, vnpay_txn_ref, vnpay_response_code, vnpay_transaction_status, vnpay_error_message } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Missing orderId' });
    }
    const update = {};
    if (order_status) update.order_status = order_status;
    if (vnpay_txn_ref) update.vnpay_txn_ref = vnpay_txn_ref;
    if (vnpay_response_code) update.vnpay_response_code = vnpay_response_code;
    if (vnpay_transaction_status) update.vnpay_transaction_status = vnpay_transaction_status;
    if (vnpay_error_message) update.vnpay_error_message = vnpay_error_message;
    const result = await orderService.model.updateOne({ _id: orderId }, update);
    res.json({ success: true, message: 'Order updated', update });
  } catch (error) {
    next(error);
  }
};
