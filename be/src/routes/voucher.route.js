import express from 'express';
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  getVoucherByCode,
  updateVoucher,
  deleteVoucher
} from '../controllers/voucher.controller.js';

const router = express.Router();

// Create new voucher
router.post('/', createVoucher);

// Get all vouchers
router.get('/', getVouchers);

// Get voucher by id
router.get('/:id', getVoucherById);

// Get voucher by code
router.get('/code/:code', getVoucherByCode);

// Update voucher
router.put('/:id', updateVoucher);

// Delete voucher
router.delete('/:id', deleteVoucher);

export default router; 