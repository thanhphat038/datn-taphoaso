/**
 * Utility functions cho xử lý ngày tháng
 */

/**
 * Format ngày tháng an toàn, tránh lỗi Invalid Date
 * @param {string|Date} date - Ngày tháng cần format
 * @param {string} locale - Locale để format (mặc định: 'vi-VN')
 * @param {Object} options - Options cho toLocaleString
 * @returns {string} Ngày tháng đã format hoặc 'N/A' nếu không hợp lệ
 */
export const formatDateSafely = (date, locale = 'vi-VN', options = {}) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    // Nếu không có options, sử dụng format mặc định
    if (Object.keys(options).length === 0) {
      return dateObj.toLocaleString(locale);
    }
    
    return dateObj.toLocaleString(locale, options);
  } catch (error) {
    console.error('Lỗi khi format ngày tháng:', error);
    return 'N/A';
  }
};

/**
 * Format ngày tháng ngắn gọn (chỉ ngày/tháng/năm)
 * @param {string|Date} date - Ngày tháng cần format
 * @param {string} locale - Locale để format (mặc định: 'vi-VN')
 * @returns {string} Ngày tháng đã format hoặc 'N/A' nếu không hợp lệ
 */
export const formatDateShort = (date, locale = 'vi-VN') => {
  return formatDateSafely(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Format ngày tháng đầy đủ (ngày/tháng/năm giờ:phút)
 * @param {string|Date} date - Ngày tháng cần format
 * @param {string} locale - Locale để format (mặc định: 'vi-VN')
 * @returns {string} Ngày tháng đã format hoặc 'N/A' nếu không hợp lệ
 */
export const formatDateTime = (date, locale = 'vi-VN') => {
  return formatDateSafely(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format ngày tháng với tùy chọn tùy chỉnh
 * @param {string|Date} date - Ngày tháng cần format
 * @param {string} locale - Locale để format (mặc định: 'vi-VN')
 * @param {Object} options - Options cho toLocaleDateString
 * @returns {string} Ngày tháng đã format hoặc 'N/A' nếu không hợp lệ
 */
export const formatDateCustom = (date, locale = 'vi-VN', options = {}) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    // Kiểm tra xem date có hợp lệ không
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Lỗi khi format ngày tháng:', error);
    return 'N/A';
  }
};

/**
 * Kiểm tra xem date có hợp lệ không
 * @param {string|Date} date - Ngày tháng cần kiểm tra
 * @returns {boolean} True nếu date hợp lệ
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * So sánh hai ngày tháng an toàn
 * @param {string|Date} dateA - Ngày tháng thứ nhất
 * @param {string|Date} dateB - Ngày tháng thứ hai
 * @returns {number} -1 nếu dateA < dateB, 0 nếu bằng nhau, 1 nếu dateA > dateB
 */
export const compareDates = (dateA, dateB) => {
  const dateObjA = new Date(dateA);
  const dateObjB = new Date(dateB);
  
  // Kiểm tra date hợp lệ
  if (isNaN(dateObjA.getTime()) || isNaN(dateObjB.getTime())) {
    return 0; // Giữ nguyên thứ tự nếu date không hợp lệ
  }
  
  if (dateObjA < dateObjB) return -1;
  if (dateObjA > dateObjB) return 1;
  return 0;
};
