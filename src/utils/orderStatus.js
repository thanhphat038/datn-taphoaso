/**
 * Utility functions cho xử lý trạng thái đơn hàng
 */

/**
 * Lấy text hiển thị cho trạng thái đơn hàng
 * @param {string} status - Trạng thái đơn hàng
 * @returns {string} Text hiển thị
 */
export const getOrderStatusText = (status) => {
  const statusMap = {
    'pending': 'Chờ xử lý',
    'paid': 'Đã thanh toán',
    'cancelled': 'Đã hủy',
    'failed': 'Thanh toán thất bại',
    'processing': 'Đang xử lý',
    'delivered': 'Đã giao hàng',
    'returned': 'Đã trả hàng'
  };
  
  return statusMap[status] || status;
};

/**
 * Lấy màu sắc cho trạng thái đơn hàng
 * @param {string} status - Trạng thái đơn hàng
 * @returns {string} CSS class màu sắc
 */
export const getOrderStatusColor = (status) => {
  const colorMap = {
    'pending': 'text-yellow-600',
    'paid': 'text-green-600',
    'cancelled': 'text-red-600',
    'failed': 'text-red-600',
    'processing': 'text-blue-600',
    'delivered': 'text-green-600',
    'returned': 'text-orange-600'
  };
  
  return colorMap[status] || 'text-gray-600';
};

/**
 * Lấy background color cho trạng thái đơn hàng
 * @param {string} status - Trạng thái đơn hàng
 * @returns {string} CSS class background color
 */
export const getOrderStatusBgColor = (status) => {
  const bgColorMap = {
    'pending': 'bg-yellow-50',
    'paid': 'bg-green-50',
    'cancelled': 'bg-red-50',
    'failed': 'bg-red-50',
    'processing': 'bg-blue-50',
    'delivered': 'bg-green-50',
    'returned': 'bg-orange-50'
  };
  
  return bgColorMap[status] || 'bg-gray-50';
};

/**
 * Lấy border color cho trạng thái đơn hàng
 * @param {string} status - Trạng thái đơn hàng
 * @returns {string} CSS class border color
 */
export const getOrderStatusBorderColor = (status) => {
  const borderColorMap = {
    'pending': 'border-yellow-200',
    'paid': 'border-green-200',
    'cancelled': 'border-red-200',
    'failed': 'border-red-200',
    'processing': 'border-blue-200',
    'delivered': 'border-green-200',
    'returned': 'border-orange-200'
  };
  
  return borderColorMap[status] || 'border-gray-200';
};

/**
 * Lấy text hiển thị cho phương thức thanh toán
 * @param {string} method - Phương thức thanh toán
 * @returns {string} Text hiển thị
 */
export const getPaymentMethodText = (method) => {
  const methodMap = {
    'vnpay': 'VNPAY',
    'cod': 'Thanh toán khi nhận hàng',
    'momo': 'Ví MoMo',
    'zalopay': 'Ví ZaloPay',
    'bank_transfer': 'Chuyển khoản ngân hàng'
  };
  
  return methodMap[method] || method;
};

/**
 * Lấy object chứa tất cả thông tin styling cho trạng thái
 * @param {string} status - Trạng thái đơn hàng
 * @returns {Object} Object chứa các CSS classes
 */
export const getOrderStatusStyles = (status) => {
  return {
    text: getOrderStatusText(status),
    color: getOrderStatusColor(status),
    bgColor: getOrderStatusBgColor(status),
    borderColor: getOrderStatusBorderColor(status)
  };
};
