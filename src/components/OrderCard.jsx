import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getApiUrl } from '../config/api.js';
import { 
  getOrderStatusStyles, 
  getPaymentMethodText,
  formatCurrency,
  sortOrdersByDate,
  filterOrdersByStatus,
  getOrderDisplayItems,
  createPaginationFromResponse,
  canCancelOrder,
  canContinuePayment,
  canReviewOrder,
  getOrderDisplayInfo,
  shouldShowContinuePaymentButton,
  formatPaymentDeadlineRemaining,
  isPaymentDeadlineValid,
  formatDateTime
} from '../utils';
import { calculateSubtotal } from '../utils/price';

const API_BASE_URL = getApiUrl('');

// Component con cho badge trạng thái
const StatusBadge = ({ status }) => {
  const styles = getOrderStatusStyles(status);
  
  // Map utility styles sang CSS classes tương ứng
  const getStatusBadgeClass = (status) => {
    const statusClassMap = {
      'pending': 'bg-gray-100 text-gray-600',
      'paid': 'bg-blue-100 text-blue-700',
      'processing': 'bg-yellow-100 text-yellow-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-600',
      'failed': 'bg-red-100 text-red-600'
    };
    
    return statusClassMap[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusBadgeClass(status)}`}>
      {styles.text}
    </span>
  );
};

// Component con cho sản phẩm trong đơn hàng
const OrderProductItem = ({ item, onReview, order_status }) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border-2 border-transparent hover:border-gray-200">
    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
      <img src={item.product_id?.images?.[0]} alt={item.product_id?.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-grow min-w-0">
      <h4 className="font-medium text-gray-800 mb-1 truncate" title={item.product_id?.name}>
        {item.product_id?.name}
      </h4>
      <p className="text-red-500 font-medium">{formatCurrency(item.cur_price)}</p>
    </div>
    {canReviewOrder(order_status) && (
      <button
        onClick={() => onReview(item.product_id)}
        className="mt-2 px-4 py-2 text-sm rounded-md text-white font-medium transition-colors bg-[#fcd34d] hover:bg-[#fbbf24] cursor-pointer"
      >
        Đánh giá
      </button>
    )}
    <div className="flex items-center gap-3 flex-shrink-0">
      <span className="w-8 text-center font-medium">{item.qty}</span>
    </div>
    <div className="text-right flex-shrink-0 w-24">
      <div className="font-semibold text-gray-800">
        {formatCurrency(item.cur_price * item.qty)}
      </div>
    </div>
  </div>
);

const OrderCard = ({ 
  order, 
  expandedOrders, 
  onToggleExpansion, 
  onReview, 
  onRefresh 
}) => {
  const navigate = useNavigate();

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      const token = Cookies.get('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
      if (!token) {
        alert('Vui lòng đăng nhập để thực hiện thao tác này');
        return;
      }

      const confirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?');
      if (!confirmed) return;

      const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Hủy đơn hàng thành công!');
        // Refresh lại danh sách đơn hàng
        if (onRefresh) {
          onRefresh();
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
    }
  };

  // Get display items
  const getDisplayItems = (items, orderId) => {
    const displayInfo = getOrderDisplayItems(items, orderId, expandedOrders, 3);
    return displayInfo.displayItems;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:border-[#06AEF4] transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-bold text-lg text-blue-600">#{order._id.slice(-6).toUpperCase()}</span>
            <span className="text-gray-500 text-sm">{formatDateTime(order.created_at || order.create_at)}</span>
            <StatusBadge status={order.order_status} />
          </div>
          <p className="text-gray-700 text-base font-semibold mb-1">Địa chỉ: {order.address}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0 justify-end">
          {/* Container cho các action buttons chính */}
          <div className="flex flex-wrap gap-2">
            {canContinuePayment(order.order_status) && (
              <>
                {/* Kiểm tra payment_deadline còn thời hạn không */}
                {(() => {
                  if (!order.payment_deadline) return null;
                  
                  if (shouldShowContinuePaymentButton(order.order_status, order.payment_deadline)) {
                    return (
                      <button
                        onClick={() => navigate(`/checkout/${order._id}`)}
                        className="px-3 py-2 border border-red-500 bg-red-500 hover:bg-red-600 text-white font-medium text-sm rounded-md shadow-sm transition-colors cursor-pointer"
                      >
                        Tiếp tục thanh toán
                      </button>
                    );
                  }
                  
                  // Hiển thị thông báo hết hạn
                  return (
                    <div className="px-3 py-2 text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-md">
                      ⏰ {formatPaymentDeadlineRemaining(order.payment_deadline)}
                    </div>
                  );
                })()}
              </>
            )}
            
            {canCancelOrder(order.order_status) && (
              <>
                {/* Chỉ hiển thị nút "Hủy đơn" khi còn thời hạn thanh toán */}
                {(() => {
                  if (!order.payment_deadline) return null;
                  
                  if (isPaymentDeadlineValid(order.payment_deadline)) {
                    return (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-3 py-2 border border-gray-400 bg-gray-400 hover:bg-gray-500 text-white font-medium text-sm rounded-md shadow-sm transition-colors cursor-pointer"
                      >
                        Hủy đơn
                      </button>
                    );
                  }
                  
                  // Không hiển thị gì khi hết thời hạn thanh toán
                  return null;
                })()}
              </>
            )}
          </div>
          
          {/* Nút "Xem chi tiết" luôn nằm ngoài cùng bên phải */}
          <button
            onClick={() => navigate(`/order/${order._id}`)}
            className="px-3 py-2 border border-blue-500 bg-white hover:bg-blue-50 text-blue-600 font-medium text-sm rounded-md shadow-sm transition-colors cursor-pointer"
          >
            Xem chi tiết
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.items?.length > 0 ? (
          <>
            {getDisplayItems(order.items, order._id).map((item) => (
              <OrderProductItem key={item._id} item={item} onReview={onReview} order_status={order.order_status} />
            ))}
            {(() => {
              const displayInfo = getOrderDisplayItems(order.items, order._id, expandedOrders, 3);
              if (displayInfo.hasMoreItems && !displayInfo.isExpanded) {
                return (
                  <div className="bg-gray-100 rounded-lg p-3 text-center">
                    <p className="text-gray-600 text-sm mb-2">
                      Và {displayInfo.remainingCount} sản phẩm khác
                    </p>
                    <button
                      onClick={() => onToggleExpansion(order._id)}
                      className="text-[#06AEF4] hover:text-[#70d9ff] font-medium text-sm transition-colors cursor-pointer"
                    >
                      Xem tất cả {order.items.length} sản phẩm
                    </button>
                  </div>
                );
              }
              if (displayInfo.hasMoreItems && displayInfo.isExpanded) {
                return (
                  <div className="text-center pt-2">
                                                <button
                              onClick={() => onToggleExpansion(order._id)}
                              className="text-[#06AEF4] hover:text-[#70d9ff] font-medium text-sm transition-colors cursor-pointer"
                            >
                              Thu gọn
                            </button>
                  </div>
                );
              }
              return null;
            })()}
          </>
        ) : (
          <div className="text-gray-400 italic">Không có sản phẩm nào trong đơn hàng này.</div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex gap-4 text-sm justify-between">
          
          {/* Container cho các cột bên trái */}
          <div className="flex gap-4">
            {/* Chỉ hiển thị "Đã thanh toán" khi đơn hàng đã thanh toán hoặc đang xử lý */}
            {(order.order_status === 'paid' || order.order_status === 'processing' || order.order_status === 'delivered') && (
              <div className="text-right">
                <p className="text-gray-600 mb-1">Đã thanh toán</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(order?.total_amount ?? 0)}
                </p>
              </div>
            )}
            
            {/* Chỉ hiển thị "Tiền cần đổi trả" khi đơn hàng đang xử lý hoặc đã giao */}
            {(order.order_status === 'processing' || order.order_status === 'delivered') && (
              <div className="text-right">
                <p className="text-gray-600 mb-1">Tiền cần đổi trả</p>
                <p className="font-semibold text-red-600">{formatCurrency(0)}</p>
              </div>
            )}
          </div>
          
          {/* "Tổng tiền" luôn nằm ngoài cùng bên phải */}
          <div className="text-right">
            <p className="text-gray-600 mb-1">Tổng tiền</p>
            <p className="font-semibold text-gray-800">
              {formatCurrency(order?.total_amount ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
