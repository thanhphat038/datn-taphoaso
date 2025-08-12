import { useState } from 'react';
import { getVoucherByCode } from '../service/Voucher.service';
import { calculateVoucherDiscount } from '../utils/price';

/**
 * Custom hook cho xử lý voucher
 * @param {number} totalAmount - Tổng tiền đơn hàng
 * @returns {Object} Các state và functions liên quan đến voucher
 */
export const useVoucher = (totalAmount = 0) => {
  const [voucher, setVoucher] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  /**
   * Áp dụng mã voucher
   * @param {string} code - Mã voucher
   * @returns {Promise<boolean>} True nếu thành công, false nếu thất bại
   */
  const applyVoucher = async (code) => {
    if (!code || !code.trim()) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      setVoucher(null);
      return false;
    }

    setIsApplyingVoucher(true);
    try {
      const res = await getVoucherByCode(code);
      const voucherData = res.data;
      
      // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
      if (totalAmount < voucherData.min_order_value) {
        setVoucher(null);
        setVoucherMessage(
          `Đơn hàng tối thiểu ${voucherData.min_order_value.toLocaleString()}đ mới được áp dụng mã này.`
        );
        return false;
      }

      setVoucher(voucherData);
      setVoucherMessage(
        `Mã giảm giá ${voucherData.code} được áp dụng thành công!`
      );
      return true;
    } catch (error) {
      setVoucher(null);
      setVoucherMessage(
        error.response?.data?.message ||
        'Mã giảm giá không hợp lệ hoặc đã hết hạn.'
      );
      return false;
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  /**
   * Xóa voucher đã áp dụng
   */
  const removeVoucher = () => {
    setVoucher(null);
    setVoucherCode('');
    setVoucherMessage('');
  };

  /**
   * Tính số tiền được giảm từ voucher
   * @returns {number} Số tiền được giảm
   */
  const getVoucherDiscount = () => {
    if (!voucher || !totalAmount) return 0;
    return calculateVoucherDiscount(voucher, totalAmount);
  };

  /**
   * Kiểm tra xem voucher có hợp lệ cho đơn hàng không
   * @returns {boolean} True nếu hợp lệ
   */
  const isVoucherValid = () => {
    if (!voucher || !totalAmount) return false;
    return totalAmount >= voucher.min_order_value;
  };

  /**
   * Lấy thông tin hiển thị voucher
   * @returns {Object} Thông tin hiển thị
   */
  const getVoucherDisplayInfo = () => {
    if (!voucher) return null;
    
    return {
      code: voucher.code,
      discountType: voucher.discount_type,
      discountValue: voucher.discount_value,
      maxDiscount: voucher.max_discount,
      minOrderValue: voucher.min_order_value,
      description: voucher.discount_type === 'percentage'
        ? `Giảm ${voucher.discount_value}% tối đa ${voucher.max_discount?.toLocaleString()}đ`
        : `Giảm ${voucher.discount_value?.toLocaleString()}đ`
    };
  };

  return {
    // State
    voucher,
    voucherCode,
    voucherMessage,
    isApplyingVoucher,
    
    // Actions
    setVoucherCode,
    applyVoucher,
    removeVoucher,
    
    // Computed values
    voucherDiscount: getVoucherDiscount(),
    isVoucherValid: isVoucherValid(),
    voucherDisplayInfo: getVoucherDisplayInfo(),
    
    // Helpers
    hasVoucher: !!voucher,
    canApplyVoucher: voucherCode.trim().length > 0 && !isApplyingVoucher
  };
};
