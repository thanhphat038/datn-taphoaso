import express from 'express';
import {
  createPayment,
  paymentReturn,
  paymentIpn,
  paymentQuery,
  paymentRefund
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

export default router; 