import * as vnpayService from '../services/payment/vnpay.service.js';
import OrderService from '../services/order.service.js';

const orderService = new OrderService();

// Function để lấy thông báo lỗi chi tiết từ mã lỗi VNPAY
const getVnpayErrorMessage = (responseCode) => {
  const errorMessages = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
    '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
    '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
    '75': 'Ngân hàng thanh toán đang bảo trì.',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };
  
  return errorMessages[responseCode] || 'Lỗi không xác định';
};

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
      
      if (callbackResult.success || callbackResult.responseCode === '00') {
        // Thanh toán thành công - cập nhật trạng thái theo _id lấy từ vnp_OrderInfo
        try {
          const orderId = req.query.vnp_OrderInfo; // _id thực sự của order
          if (!orderId) {
            return res.json({ success: false, message: 'Thiếu vnp_OrderInfo (orderId)' });
          }
          await orderService.model.updateOne(
            { _id: orderId },
            {
              order_status: 'paid',
              vnpay_txn_ref: req.query.vnp_TxnRef,
              vnpay_response_code: callbackResult.responseCode || '00',
              vnpay_transaction_status: callbackResult.transactionStatus || '',
              vnpay_error_message: 'Thanh toán thành công'
            }
          );
          console.log(`Updated order ${orderId} status to paid (ResponseCode: ${callbackResult.responseCode || '00'})`);
          res.json({
            success: true,
            message: 'Thanh toán thành công',
            orderId: orderId,
            vnpayTxnRef: req.query.vnp_TxnRef,
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
            orderId: req.query.vnp_OrderInfo
          });
        }
      } else {
        // Thanh toán thất bại - xử lý theo mã lỗi VNPAY
        const orderId = req.query.vnp_OrderInfo;
        const responseCode = callbackResult.responseCode;
        // Xác định trạng thái dựa trên mã lỗi
        let orderStatus = 'failed';
        let statusMessage = 'Thanh toán thất bại';
        switch (responseCode) {
          case '00':
          case '07':
            orderStatus = 'paid';
            statusMessage = responseCode === '00' ? 'Thanh toán thành công' : 'Giao dịch bị nghi ngờ - cần xác minh';
            break;
          default:
            orderStatus = 'failed';
            statusMessage = getVnpayErrorMessage(responseCode);
        }
        if (orderId) {
          await orderService.model.updateOne(
            { _id: orderId },
            {
              order_status: orderStatus,
              vnpay_txn_ref: req.query.vnp_TxnRef,
              vnpay_response_code: responseCode,
              vnpay_transaction_status: callbackResult.transactionStatus || '',
              vnpay_error_message: statusMessage
            }
          );
          console.log(`Updated order ${orderId} status to ${orderStatus} (ResponseCode: ${responseCode})`);
        }
        res.json({
          success: false,
          message: statusMessage,
          orderId: orderId,
          responseCode: responseCode,
          orderStatus: orderStatus
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
    }).select('_id vnpay_txn_ref order_status total_amount payment_method created_at');
    
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