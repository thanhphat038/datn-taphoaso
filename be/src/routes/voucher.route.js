import express from 'express';
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  getVoucherByCode,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  applyVoucher,
  getActiveVouchers
} from '../controllers/voucher.controller.js';

const router = express.Router();

// Create new voucher
router.post('/', createVoucher);

// Get all vouchers
router.get('/', getVouchers);

// Validate voucher
router.post('/validate', validateVoucher);

// Get voucher by id
router.get('/:id', getVoucherById);

// Get voucher by code
router.get('/code/:code', getVoucherByCode);

// Update voucher
router.put('/:id', updateVoucher);

// Delete voucher
router.delete('/:id', deleteVoucher);

// Apply voucher to order
router.post('/apply/:orderId', applyVoucher);

// Get active vouchers
router.get('/active', getActiveVouchers);

export default router; 