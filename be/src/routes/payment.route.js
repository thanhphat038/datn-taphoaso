import express from 'express';
import {
  createPayment,
  paymentReturn,
  paymentIpn,
  paymentQuery,
  paymentRefund,
  testUpdateOrderStatus,
  findOrderByVnpayTxnRef,
  getAllOrdersWithVnpayRef
} from '../controllers/payment.controller.js';

const router = express.Router();

// Tạo payment url
router.post('/create', createPayment);
// Xử lý return từ cổng thanh toán
router.get('/return', paymentReturn);
// Xử lý IPN từ cổng thanh toán
router.get('/ipn', paymentIpn);
// Truy vấn giao dịch
router.post('/query', paymentQuery);
// Hoàn tiền
router.post('/refund', paymentRefund);
// Test cập nhật trạng thái đơn hàng
router.post('/test-update-status', testUpdateOrderStatus);
// Test tìm order theo vnpay_txn_ref
router.get('/find-order/:vnpayTxnRef', findOrderByVnpayTxnRef);
// Xem tất cả orders có vnpay_txn_ref
router.get('/all-orders-with-vnpay-ref', getAllOrdersWithVnpayRef);

export default router; 