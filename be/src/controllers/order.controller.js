// order.controller.js
import OrderService from '../services/order.service.js';
import CartService from '../services/cart.service.js';
import VoucherService from '../services/voucher.service.js';
import ProductService from '../services/product.service.js';
import UserService from '../services/user.service.js';
import { sendOrderSuccessEmail } from '../services/mailler/emailService.js';

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

const orderService = new OrderService();
const cartService = new CartService();
const voucherService = new VoucherService();
const productService = new ProductService();
const userService = new UserService();

export const createOrder = async (req, res, next) => {
  try {
    const { address, receiver, sdt, items, payment_method, note, voucher_code } = req.body;

    console.log('🔍 Debug - createOrder called with items:', items);

    // Validation
    if (!address || !receiver || !sdt || !payment_method) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing required fields');
    }

    const userId = req.user.id;
    console.log('🔍 Debug - User ID:', userId);

    // Validate items
    for (const item of items) {
      if (!item.product_id || !item.qty || item.qty <= 0) {
        throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid item data');
      }
    }

    // Validate voucher nếu có (với error handling)
    let voucher = null;
    if (voucher_code) {
      try {
        voucher = await voucherService.findValidVoucherByCode(voucher_code, userId);
        console.log('🔍 Debug - Validated voucher:', voucher?.code);
      } catch (voucherError) {
        console.log('🔍 Debug - Voucher validation failed:', voucherError.message);
        // Không throw error, chỉ bỏ qua voucher
        voucher = null;
      }
    }

    // Tạo order
    const order = await orderService.createOrder({
      user_id: userId,
      address,
      receiver,
      sdt,
      payment_method,
      note,
      items,
      voucher_code: voucher ? voucher_code : undefined,
      voucher: voucher ? voucher._id : undefined,
    });

    console.log('🔍 Debug - Created order:', order._id);
    
    // Clear cart sau khi tạo order thành công
    await cartService.clearCart(userId);

    // Gửi email xác nhận đơn hàng
    try {
      const user = await userService.findById(userId);
      if (user && user.email) {
        const orderDetailLink = `${process.env.FRONTEND_URL}/order/${order._id}`;
        
        // Lấy thông tin đầy đủ của order với items (đã được cải thiện trong service)
        const fullOrder = await orderService.getOrderById(order._id);
        const orderItems = fullOrder.items || [];
        const totalAmount = fullOrder.total_amount || 0;
        
        console.log(`[createOrder] Order items for email:`, orderItems.map(item => ({
          name: item.product_id?.name,
          qty: item.qty,
          price: item.cur_price,
          total: item.total_price
        })));
        
        // Chuyển đổi dữ liệu để phù hợp với email template
        const emailOrderItems = orderItems.map(item => ({
          product_name: item.product_id?.name || 'Sản phẩm không xác định',
          qty: item.qty || 0,
          price: item.cur_price || 0,
          quantity: item.qty || 0
        }));
        
        await sendOrderSuccessEmail({
          to: user.email,
          name: user.full_name || receiver,
          orderId: order._id,
          orderDetailLink,
          orderItems: emailOrderItems,
          totalAmount
        });
        console.log(`[createOrder] Order confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error('[createOrder] Failed to send order confirmation email:', emailError);
      // Không throw error vì email không ảnh hưởng đến việc tạo order
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error('🔍 Debug - Error in createOrder:', err);
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
          qty: quantity
        }
      ]
    });

    // Gửi email xác nhận đơn hàng
    try {
      const user = await userService.findById(userId);
      if (user && user.email) {
        const orderDetailLink = `${process.env.FRONTEND_URL}/order/${order._id}`;
        
        // Lấy thông tin đầy đủ của order với items (đã được cải thiện trong service)
        const fullOrder = await orderService.getOrderById(order._id);
        const orderItems = fullOrder.items || [];
        const totalAmount = fullOrder.total_amount || 0;
        
        console.log(`[createbuyNowOrder] Order items for email:`, orderItems.map(item => ({
          name: item.product_id?.name,
          qty: item.qty,
          price: item.cur_price,
          total: item.total_price
        })));
        
        // Chuyển đổi dữ liệu để phù hợp với email template
        const emailOrderItems = orderItems.map(item => ({
          product_name: item.product_id?.name || 'Sản phẩm không xác định',
          qty: item.qty || 0,
          price: item.cur_price || 0,
          quantity: item.qty || 0
        }));
        
        await sendOrderSuccessEmail({
          to: user.email,
          name: user.full_name || receiver,
          orderId: order._id,
          orderDetailLink,
          orderItems: emailOrderItems,
          totalAmount
        });
        console.log(`[createbuyNowOrder] Order confirmation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error('[createbuyNowOrder] Failed to send order confirmation email:', emailError);
      // Không throw error vì email không ảnh hưởng đến việc tạo order
    }

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await orderService.getOrdersByUser(req.user.id, { page, limit });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    // Kiểm tra xem order có thuộc về user hiện tại không
    let orderUserId;
    if (typeof order.user_id === 'object' && order.user_id._id) {
      orderUserId = order.user_id._id;
    } else {
      orderUserId = order.user_id;
    }
    
    if (orderUserId.toString() !== userId.toString()) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'You can only view your own orders');
    }

    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    console.log('🔍 [OrderController] updateOrderStatus called');
    console.log('🔍 [OrderController] Request params:', req.params);
    console.log('🔍 [OrderController] Request body:', req.body);
    
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      console.error('❌ [OrderController] Status is missing');
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Status is required');
    }

    console.log('✅ [OrderController] Calling orderService.updateStatus...');
    const order = await orderService.updateStatus(orderId, status);
    console.log('✅ [OrderController] Order updated successfully:', order);
    
    res.json({ success: true, data: order });
  } catch (err) { 
    console.error('❌ [OrderController] Error in updateOrderStatus:', err);
    next(err); 
  }
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
    const userId = req.user.id;

    // Kiểm tra xem order có tồn tại và thuộc về user hiện tại không
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    let orderUserId;
    if (typeof order.user_id === 'object' && order.user_id._id) {
      orderUserId = order.user_id._id;
    } else {
      orderUserId = order.user_id;
    }
    
    if (orderUserId.toString() !== userId.toString()) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'You can only delete your own orders');
    }

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
    const userId = req.user.id;

    // Kiểm tra xem order có tồn tại và thuộc về user hiện tại không
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    let orderUserId;
    if (typeof order.user_id === 'object' && order.user_id._id) {
      orderUserId = order.user_id._id;
    } else {
      orderUserId = order.user_id;
    }
    
    if (orderUserId.toString() !== userId.toString()) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'You can only view products from your own orders');
    }

    const products = await orderService.getProductsInOrder(orderId);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getOrderWithDeadline = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Kiểm tra xem order có tồn tại và thuộc về user hiện tại không
    const order = await orderService.getOrderById(orderId);
    
    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }

    let orderUserId;
    if (typeof order.user_id === 'object' && order.user_id._id) {
      orderUserId = order.user_id._id;
    } else {
      orderUserId = order.user_id;
    }
    
    if (orderUserId.toString() !== userId.toString()) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'You can only view your own orders');
    }

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

export const cancelOrder = async (req, res, next) => {
  try {
    console.log('🔍 Debug - cancelOrder function started');
    const { orderId } = req.params;
    const userId = req.user.id;

    console.log('🔍 Debug - cancelOrder called with orderId:', orderId, 'userId:', userId);

    // Kiểm tra xem đơn hàng có tồn tại và thuộc về user hiện tại không
    const order = await orderService.getOrderById(orderId);
    
    console.log('🔍 Debug - Found order:', order);
    console.log('🔍 Debug - Order user_id:', order?.user_id);
    console.log('🔍 Debug - Order status:', order?.order_status);
    
    if (!order) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order not found');
    }
    
    if (!order.user_id) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Order user_id not found');
    }

    // Kiểm tra xem đơn hàng có thuộc về user hiện tại không
    let orderUserId;
    if (typeof order.user_id === 'object' && order.user_id._id) {
      orderUserId = order.user_id._id;
    } else {
      orderUserId = order.user_id;
    }
    
    console.log('🔍 Debug - orderUserId:', orderUserId, 'userId:', userId);
    console.log('🔍 Debug - orderUserId.toString():', orderUserId.toString(), 'userId.toString():', userId.toString());
    console.log('🔍 Debug - typeof orderUserId:', typeof orderUserId);
    console.log('🔍 Debug - typeof userId:', typeof userId);
    
    if (orderUserId.toString() !== userId.toString()) {
      throw new AppError(ERROR_CODES.FORBIDDEN, 'You can only cancel your own orders');
    }

    // Kiểm tra xem đơn hàng có thể hủy không (chỉ hủy được khi đang pending hoặc failed)
    if (order.order_status !== 'pending' && order.order_status !== 'failed') {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Order cannot be cancelled. Only pending or failed orders can be cancelled.');
    }

    // Cập nhật trạng thái thành cancelled
    const updatedOrder = await orderService.updateStatus(orderId, 'cancelled');
    
    console.log('🔍 Debug - Order cancelled successfully:', updatedOrder);
    
    res.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      data: updatedOrder 
    });
  } catch (err) { 
    console.error('🔍 Debug - Error in cancelOrder:', err);
    console.error('🔍 Debug - Error message:', err.message);
    console.error('🔍 Debug - Error stack:', err.stack);
    next(err); 
  }
};
