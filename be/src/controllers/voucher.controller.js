import { voucherService } from '../services/index.js';

import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Create new voucher
export const createVoucher = async (req, res, next) => {
  try {
    const voucher = await voucherService.create(req.body);
    res.status(201).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    next(error);
  }
};

// Get all vouchers
export const getVouchers = async (req, res, next) => {
  try {
    const vouchers = await voucherService.findAll();
    res.json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    next(error);
  }
};

// Get voucher by id
export const getVoucherById = async (req, res, next) => {
  try {
    const voucher = await voucherService.findById(req.params.id);
    if (!voucher) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Voucher not found');
    }
    res.json({
      success: true,
      data: voucher
    });
  } catch (error) {
    next(error);
  }
};

// Get voucher by code
export const getVoucherByCode = async (req, res) => {
  try {
    const voucher = await voucherService.findOne({ code: req.params.code });
    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Voucher not found' 
      });
    }
    
    // Trả về response format nhất quán
    res.json({
      success: true,
      data: voucher
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update voucher
export const updateVoucher = async (req, res, next) => {
  try {
    const voucher = await voucherService.update(req.params.id, req.body);
    res.json({
      success: true,
      data: voucher
    });
  } catch (error) {
    next(error);
  }
};

// Delete voucher
export const deleteVoucher = async (req, res, next) => {
  try {
    await voucherService.delete(req.params.id);
    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Validate voucher
export const validateVoucher = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user?.id; // Lấy user ID từ auth middleware
    
    // Gọi đúng method name
    const voucher = await voucherService.validateVoucherCode(code, userId, orderAmount);
    
    // Tính toán discount amount
    let discountAmount = 0;
    if (voucher.discount_type === 'percentage') {
      discountAmount = (orderAmount * voucher.discount_value) / 100;
      if (voucher.max_discount && discountAmount > voucher.max_discount) {
        discountAmount = voucher.max_discount;
      }
    } else {
      discountAmount = voucher.discount_value;
    }
    
    res.json({
      success: true,
      data: { 
        voucher,
        discountAmount,
        isValid: true 
      }
    });
  } catch (error) {
    next(error);
  }
};

// Apply voucher to order
export const applyVoucher = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { code } = req.body;
    const order = await voucherService.applyVoucher(orderId, code);
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get active vouchers
export const getActiveVouchers = async (req, res, next) => {
  try {
    const vouchers = await voucherService.getActiveVouchers();
    res.json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    next(error);
  }
};

// Get voucher statistics
export const getVoucherStats = async (req, res, next) => {
  try {
    const stats = await voucherService.getVoucherStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}; 