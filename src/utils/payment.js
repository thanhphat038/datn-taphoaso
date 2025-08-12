/**
 * Utility functions cho xử lý payment deadline
 */

/**
 * Kiểm tra xem payment deadline có còn thời hạn không
 * @param {string} paymentDeadline - ISO string của payment deadline
 * @returns {boolean} True nếu còn thời hạn, False nếu đã hết hạn
 */
export const isPaymentDeadlineValid = (paymentDeadline) => {
  if (!paymentDeadline) return false;
  
  try {
    const now = new Date();
    const deadline = new Date(paymentDeadline);
    
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(deadline.getTime())) return false;
    
    return now <= deadline;
  } catch (error) {
    console.error('Lỗi khi kiểm tra payment deadline:', error);
    return false;
  }
};

/**
 * Lấy thời gian còn lại của payment deadline
 * @param {string} paymentDeadline - ISO string của payment deadline
 * @returns {Object} Object chứa thông tin thời gian còn lại
 */
export const getPaymentDeadlineRemaining = (paymentDeadline) => {
  if (!paymentDeadline) return null;
  
  try {
    const now = new Date();
    const deadline = new Date(paymentDeadline);
    
    if (isNaN(deadline.getTime())) return null;
    
    const timeDiff = deadline.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      return {
        isValid: false,
        remainingMs: 0,
        remainingHours: 0,
        remainingMinutes: 0,
        isExpired: true
      };
    }
    
    const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      isValid: true,
      remainingMs: timeDiff,
      remainingHours,
      remainingMinutes,
      isExpired: false
    };
  } catch (error) {
    console.error('Lỗi khi tính thời gian còn lại:', error);
    return null;
  }
};

/**
 * Format thời gian còn lại thành text dễ đọc
 * @param {string} paymentDeadline - ISO string của payment deadline
 * @returns {string} Text mô tả thời gian còn lại
 */
export const formatPaymentDeadlineRemaining = (paymentDeadline) => {
  const remaining = getPaymentDeadlineRemaining(paymentDeadline);
  
  if (!remaining || remaining.isExpired) {
    return 'Đã hết thời hạn thanh toán';
  }
  
  if (remaining.remainingHours > 0) {
    return `Còn ${remaining.remainingHours} giờ ${remaining.remainingMinutes} phút để thanh toán`;
  }
  
  if (remaining.remainingMinutes > 0) {
    return `Còn ${remaining.remainingMinutes} phút để thanh toán`;
  }
  
  return 'Còn ít thời gian để thanh toán';
};

/**
 * Kiểm tra xem có nên hiển thị nút "Tiếp tục thanh toán" không
 * @param {string} orderStatus - Trạng thái đơn hàng
 * @param {string} paymentDeadline - ISO string của payment deadline
 * @returns {boolean} True nếu nên hiển thị nút
 */
export const shouldShowContinuePaymentButton = (orderStatus, paymentDeadline) => {
  // Chỉ hiển thị khi trạng thái là 'failed' và còn thời hạn thanh toán
  return orderStatus === 'failed' && isPaymentDeadlineValid(paymentDeadline);
};
