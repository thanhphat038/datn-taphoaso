import * as vnpayService from '../services/payment/vnpay.service.js';
import OrderService from '../services/order.service.js';

const orderService = new OrderService();

export const createPayment = async (req, res, next) => {
  try {
    const { method, orderId, ...params } = req.body;
    let url;
    let txnRef;
    
    if (method === 'vnpay') {
      const result = await vnpayService.createPaymentUrl({
        ...params,
        orderId, // Truyền orderId để sử dụng làm vnp_TxnRef
        ipAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
      
      url = result.url;
      txnRef = result.txnRef;
      
      // Lưu vnpay_txn_ref vào order nếu có orderId
      if (orderId && txnRef) {
        try {
          await orderService.update(orderId, { vnpay_txn_ref: txnRef });
          console.log(`Saved vnpay_txn_ref: ${txnRef} for order: ${orderId}`);
        } catch (error) {
          console.error('Error saving vnpay_txn_ref:', error);
        }
      }
    } else {
      return res.status(400).json({ message: 'Unsupported payment method' });
    }
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

export const paymentReturn = async (req, res, next) => {
  try {
    const { method = 'vnpay' } = req.query;
    
    if (method === 'vnpay') {
      // Xử lý callback VNPAY
      const callbackResult = vnpayService.processVNPayCallback(req.query);
      console.log('VNPAY Callback Result:', callbackResult);
      
      if (callbackResult.success) {
        // Thanh toán thành công - tìm order theo vnpay_txn_ref và cập nhật trạng thái
        try {
          const vnpayTxnRef = callbackResult.orderId; // Đây là vnp_TxnRef từ VNPAY
          console.log('Looking for order with vnpay_txn_ref:', vnpayTxnRef);
          
          // Tìm order theo vnpay_txn_ref
          const order = await orderService.model.findOne({ vnpay_txn_ref: vnpayTxnRef });
          console.log('Found order:', order ? order._id : 'NOT FOUND');
          
          if (!order) {
            // Log tất cả orders có vnpay_txn_ref để debug
            const allOrdersWithVnpayRef = await orderService.model.find({ vnpay_txn_ref: { $exists: true } });
            console.log('All orders with vnpay_txn_ref:', allOrdersWithVnpayRef.map(o => ({ id: o._id, vnpay_txn_ref: o.vnpay_txn_ref })));
            
            return res.json({
              success: false,
              message: 'Không tìm thấy đơn hàng tương ứng',
              orderId: vnpayTxnRef,
              debug: {
                searchedFor: vnpayTxnRef,
                availableRefs: allOrdersWithVnpayRef.map(o => o.vnpay_txn_ref)
              }
            });
          }
          
          // Cập nhật trạng thái đơn hàng thành 'paid'
          await orderService.updateStatus(order._id, 'paid');
          console.log(`Updated order ${order._id} status to paid`);
          
          res.json({
            success: true,
            message: 'Thanh toán thành công',
            orderId: order._id,
            vnpayTxnRef: vnpayTxnRef,
            transactionInfo: {
              amount: callbackResult.amount,
              bankCode: callbackResult.bankCode,
              cardType: callbackResult.cardType,
              payDate: callbackResult.payDate,
              transactionNo: callbackResult.transactionNo
            }
          });
        } catch (orderError) {
          console.error('Error updating order status:', orderError);
          res.json({
            success: false,
            message: 'Thanh toán thành công nhưng không thể cập nhật trạng thái đơn hàng',
            orderId: callbackResult.orderId
          });
        }
      } else {
        // Thanh toán thất bại
        // Nếu tìm thấy order, cập nhật trạng thái là cancelled
        const vnpayTxnRef = callbackResult.orderId;
        if (vnpayTxnRef) {
          const order = await orderService.model.findOne({ vnpay_txn_ref: vnpayTxnRef });
          if (order) {
            await orderService.updateStatus(order._id, 'cancelled');
          }
        }
        res.json({
          success: false,
          message: callbackResult.message,
          orderId: callbackResult.orderId,
          responseCode: callbackResult.responseCode
        });
      }
    } else {
      res.status(400).json({ success: false, message: 'Unsupported payment method' });
    }
  } catch (error) {
    next(error);
  }
};

// API test để cập nhật trạng thái đơn hàng
export const testUpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing orderId or status' 
      });
    }
    
    const updatedOrder = await orderService.updateStatus(orderId, status);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// API test để tìm order theo vnpay_txn_ref
export const findOrderByVnpayTxnRef = async (req, res, next) => {
  try {
    const { vnpayTxnRef } = req.params;
    
    if (!vnpayTxnRef) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing vnpayTxnRef' 
      });
    }
    
    const order = await orderService.model.findOne({ vnpay_txn_ref: vnpayTxnRef });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        vnpayTxnRef
      });
    }
    
    res.json({
      success: true,
      message: 'Order found',
      order: order
    });
  } catch (error) {
    next(error);
  }
};

// API để xem tất cả orders có vnpay_txn_ref
export const getAllOrdersWithVnpayRef = async (req, res, next) => {
  try {
    const orders = await orderService.model.find({ 
      vnpay_txn_ref: { $exists: true, $ne: null } 
    }).select('_id vnpay_txn_ref order_status total_amount payment_method create_at');
    
    res.json({
      success: true,
      message: 'Orders with VNPAY ref found',
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    next(error);
  }
};

export const paymentIpn = async (req, res, next) => {
  try {
    const { method = 'vnpay' } = req.query;
    let valid = false;
    if (method === 'vnpay') {
      valid = vnpayService.verifyIpn(req.query);
    }
    res.json({ valid });
  } catch (error) {
    next(error);
  }
};

export const paymentQuery = async (req, res, next) => {
  try {
    const { method = 'vnpay', ...params } = req.body;
    let result;
    if (method === 'vnpay') {
      result = await vnpayService.queryDr(params);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const paymentRefund = async (req, res, next) => {
  try {
    const { method = 'vnpay', ...params } = req.body;
    let result;
    if (method === 'vnpay') {
      result = await vnpayService.refund(params);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}; 