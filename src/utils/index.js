/**
 * Index file để export tất cả các utility functions
 */

// Price utilities
export {
  calculateTotalPrice,
  calculateVoucherDiscount,
  calculateFinalTotal,
  formatCurrency
} from './price';

// Order status utilities
export {
  getOrderStatusText,
  getOrderStatusColor,
  getOrderStatusBgColor,
  getOrderStatusBorderColor,
  getPaymentMethodText,
  getOrderStatusStyles
} from './orderStatus';

// Order utilities
export {
  sortOrdersByDate,
  filterOrdersByStatus,
  getOrderDisplayItems,
  createPaginationFromResponse,
  canCancelOrder,
  canContinuePayment,
  canReviewOrder,
  getOrderDisplayInfo
} from './order';

// Date utilities
export {
  formatDateSafely,
  formatDateShort,
  formatDateTime,
  formatDateCustom,
  isValidDate,
  compareDates
} from './date';

// Payment utilities
export {
  isPaymentDeadlineValid,
  getPaymentDeadlineRemaining,
  formatPaymentDeadlineRemaining,
  shouldShowContinuePaymentButton
} from './payment';
