/**
 * Utility functions cho xử lý đơn hàng
 */

// Import date utilities
import { formatDateTime, compareDates } from './date';

/**
 * Sắp xếp đơn hàng theo thời gian tạo
 * @param {Array} orders - Danh sách đơn hàng
 * @param {string} sortBy - Trường để sắp xếp (mặc định: 'created_at')
 * @param {string} order - Thứ tự sắp xếp ('asc' hoặc 'desc', mặc định: 'desc')
 * @returns {Array} Danh sách đơn hàng đã sắp xếp
 */
export const sortOrdersByDate = (orders, sortBy = 'created_at', order = 'desc') => {
  if (!orders || !Array.isArray(orders)) return [];
  
  return [...orders].sort((a, b) => {
    const result = compareDates(a[sortBy], b[sortBy]);
    
    if (order === 'asc') {
      return result;
    } else {
      return -result; // Đảo ngược để sắp xếp giảm dần
    }
  });
};

/**
 * Lọc đơn hàng theo trạng thái
 * @param {Array} orders - Danh sách đơn hàng
 * @param {string} statusFilter - Trạng thái để lọc ('all' để lấy tất cả)
 * @returns {Array} Danh sách đơn hàng đã lọc
 */
export const filterOrdersByStatus = (orders, statusFilter) => {
  if (!orders || !Array.isArray(orders)) return [];
  
  if (statusFilter === 'all') {
    return orders;
  }
  
  return orders.filter(order => order.order_status === statusFilter);
};

/**
 * Lấy danh sách sản phẩm hiển thị cho đơn hàng
 * @param {Array} items - Danh sách sản phẩm
 * @param {string} orderId - ID đơn hàng
 * @param {Set} expandedOrders - Set các đơn hàng đã mở rộng
 * @param {number} defaultLimit - Số lượng sản phẩm mặc định hiển thị
 * @returns {Object} Object chứa items hiển thị và thông tin mở rộng
 */
export const getOrderDisplayItems = (items, orderId, expandedOrders, defaultLimit = 3) => {
  if (!items || items.length === 0) {
    return {
      displayItems: [],
      isExpanded: false,
      hasMoreItems: false,
      remainingCount: 0
    };
  }
  
  const isExpanded = expandedOrders.has(orderId);
  const displayItems = isExpanded ? items : items.slice(0, defaultLimit);
  const hasMoreItems = items.length > defaultLimit;
  const remainingCount = items.length - defaultLimit;
  
  return {
    displayItems,
    isExpanded,
    hasMoreItems,
    remainingCount
  };
};

/**
 * Tạo object pagination từ response API
 * @param {Object} apiResponse - Response từ API
 * @param {number} defaultLimit - Số lượng mặc định mỗi trang
 * @returns {Object} Object pagination
 */
export const createPaginationFromResponse = (apiResponse, defaultLimit = 3) => {
  if (!apiResponse || !apiResponse.pagination) {
    return {
      total: 0,
      page: 1,
      limit: defaultLimit,
      totalPages: 1
    };
  }
  
  const { pagination } = apiResponse;
  return {
    total: pagination.total || 0,
    page: pagination.page || 1,
    limit: pagination.limit || defaultLimit,
    totalPages: pagination.totalPages || 1
  };
};

/**
 * Kiểm tra xem đơn hàng có thể hủy không
 * @param {string} orderStatus - Trạng thái đơn hàng
 * @returns {boolean} True nếu có thể hủy
 */
export const canCancelOrder = (orderStatus) => {
  const cancellableStatuses = ['pending', 'failed'];
  return cancellableStatuses.includes(orderStatus);
};

/**
 * Kiểm tra xem đơn hàng có thể tiếp tục thanh toán không
 * @param {string} orderStatus - Trạng thái đơn hàng
 * @returns {boolean} True nếu có thể tiếp tục thanh toán
 */
export const canContinuePayment = (orderStatus) => {
  return orderStatus === 'failed';
};

/**
 * Kiểm tra xem đơn hàng có thể đánh giá không
 * @param {string} orderStatus - Trạng thái đơn hàng
 * @returns {boolean} True nếu có thể đánh giá
 */
export const canReviewOrder = (orderStatus) => {
  return orderStatus === 'delivered';
};

/**
 * Lấy thông tin hiển thị cho đơn hàng
 * @param {Object} order - Thông tin đơn hàng
 * @returns {Object} Thông tin hiển thị
 */
export const getOrderDisplayInfo = (order) => {
  if (!order) return null;
  
  return {
    id: order._id,
    shortId: order._id.slice(-6).toUpperCase(),
    createDate: formatDateTime(order.created_at || order.create_at),
    address: order.address,
    status: order.order_status,
    totalAmount: order.total_amount || 0,
    itemCount: order.items?.length || 0,
    canCancel: canCancelOrder(order.order_status),
    canContinuePayment: canContinuePayment(order.order_status),
    canReview: canReviewOrder(order.order_status)
  };
};
