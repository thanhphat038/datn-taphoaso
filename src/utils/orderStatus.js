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
 * Kiểm tra xem trạng thái đơn hàng có thể chỉnh sửa được không
 * @param {string} status - Trạng thái đơn hàng
 * @returns {boolean} True nếu có thể chỉnh sửa
 */
export const canEditOrderStatus = (status) => {
  // Block delivered và cancelled - không thể chỉnh sửa
  const nonEditableStatuses = ['delivered', 'cancelled'];
  return !nonEditableStatuses.includes(status);
};

/**
 * Lấy trạng thái tiếp theo theo thứ tự
 * @param {string} currentStatus - Trạng thái hiện tại
 * @returns {string|null} Trạng thái tiếp theo hoặc null nếu không có
 */
export const getNextStatus = (currentStatus) => {
  const statusSequence = ['pending', 'processing', 'delivered'];
  const currentIndex = statusSequence.indexOf(currentStatus);
  
  if (currentIndex === -1 || currentIndex === statusSequence.length - 1) {
    return null; // Không có trạng thái tiếp theo
  }
  
  return statusSequence[currentIndex + 1];
};

/**
 * Kiểm tra xem có thể chuyển từ trạng thái hiện tại sang trạng thái mới không
 * @param {string} currentStatus - Trạng thái hiện tại
 * @param {string} newStatus - Trạng thái mới
 * @returns {boolean} True nếu có thể chuyển đổi
 */
export const canChangeToStatus = (currentStatus, newStatus) => {
  // Nếu trạng thái hiện tại là delivered hoặc cancelled thì không thể thay đổi
  if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
    return false;
  }
  
  // Nếu trạng thái mới là cancelled thì chỉ cho phép khi đang ở trạng thái pending
  if (newStatus === 'cancelled') {
    return currentStatus === 'pending';
  }
  
  // Kiểm tra thứ tự trạng thái
  const statusSequence = ['pending', 'processing', 'delivered'];
  const currentIndex = statusSequence.indexOf(currentStatus);
  const newIndex = statusSequence.indexOf(newStatus);
  
  // Chỉ cho phép chuyển sang trạng thái tiếp theo
  return newIndex === currentIndex + 1;
};

/**
 * Lấy danh sách trạng thái có thể chuyển đổi từ trạng thái hiện tại
 * @param {string} currentStatus - Trạng thái hiện tại
 * @returns {Array} Danh sách các trạng thái có thể chuyển đổi
 */
export const getAvailableStatuses = (currentStatus) => {
  const allStatuses = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'delivered', label: 'Đã nhận hàng' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];
  
  // Nếu trạng thái hiện tại là delivered hoặc cancelled thì không thể chuyển đổi
  if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
    return [];
  }
  
  // Lấy trạng thái tiếp theo
  const nextStatus = getNextStatus(currentStatus);
  
  // Trả về trạng thái tiếp theo và cancelled (chỉ khi đang ở pending)
  return allStatuses.filter(status => 
    status.value === nextStatus || (status.value === 'cancelled' && currentStatus === 'pending')
  );
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
    borderColor: getOrderStatusBorderColor(status),
    canEdit: canEditOrderStatus(status)
  };
};
