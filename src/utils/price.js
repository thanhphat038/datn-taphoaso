/**
 * Utility functions cho tính toán giá và giảm giá
 */

/**
 * Tính tổng tiền sản phẩm
 * @param {Array} items - Danh sách sản phẩm
 * @param {string} priceField - Tên field chứa giá (mặc định: 'price')
 * @param {string} quantityField - Tên field chứa số lượng (mặc định: 'quantity')
 * @returns {number} Tổng tiền
 */
export const calculateSubtotal = (items, priceField = 'price', quantityField = 'quantity') => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const price = item[priceField] || item.product_id?.[priceField] || 0;
    const quantity = item[quantityField] || item.qty || 0;
    return total + (price * quantity);
  }, 0);
};

/**
 * Tính giảm giá voucher
 * @param {Object} voucher - Thông tin voucher
 * @param {number} totalAmount - Tổng tiền đơn hàng
 * @returns {number} Số tiền được giảm
 */
export const calculateVoucherDiscount = (voucher, totalAmount) => {
  if (!voucher || !totalAmount) return 0;
  
  if (voucher.discount_type === 'percentage') {
    const discount = (totalAmount * voucher.discount_value) / 100;
    return Math.min(discount, voucher.max_discount || discount);
  }
  
  if (voucher.discount_type === 'fixed' || voucher.discount_type === 'amount') {
    return Math.min(voucher.discount_value, totalAmount);
  }
  
  return 0;
};

/**
 * Tính tổng tiền cuối cùng sau khi áp dụng giảm giá và phí vận chuyển
 * @param {number} subtotal - Tổng tiền hàng
 * @param {number} shippingFee - Phí vận chuyển
 * @param {number} voucherDiscount - Giảm giá voucher
 * @returns {number} Tổng tiền cuối cùng
 */
export const calculateTotal = (subtotal, shippingFee = 0, voucherDiscount = 0) => {
  return subtotal + shippingFee - voucherDiscount;
};

/**
 * Format tiền tệ theo định dạng Việt Nam
 * @param {number} amount - Số tiền
 * @returns {string} Tiền đã format
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '0 đ';
  return `${amount.toLocaleString()} đ`;
};

// Alias để backward compatibility
export const calculateTotalPrice = calculateSubtotal;
export const calculateFinalTotal = calculateTotal;
