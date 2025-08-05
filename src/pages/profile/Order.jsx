import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getMyOrders } from '../../service/UserService';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { getOrderDetailsByOrderId } from '../../service/Admin.Service';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3000/api';

// Constants
const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Chờ xử lý",
    className: "bg-gray-100 text-gray-600",
    buttonClass: "bg-gray-600 text-white"
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-blue-100 text-blue-700",
    buttonClass: "bg-blue-600 text-white"
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-yellow-100 text-yellow-700",
    buttonClass: "bg-yellow-600 text-white"
  },
  delivered: {
    label: "Đã giao thành công",
    className: "bg-green-100 text-green-700",
    buttonClass: "bg-green-600 text-white"
  },
  cancelled: {
    label: "Đã huỷ",
    className: "bg-red-100 text-red-600",
    buttonClass: "bg-red-600 text-white"
  },
  failed: {
    label: "Thanh toán thất bại",
    className: "bg-red-100 text-red-600",
    buttonClass: "bg-red-600 text-white"
  }
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả', color: 'blue' },
  { value: 'paid', label: 'Đã thanh toán', color: 'blue' },
  { value: 'processing', label: 'Đang xử lý ', color: 'yellow' },
  { value: 'pending', label: 'Chờ xử lý', color: 'gray' },
  { value: 'delivered', label: 'Đã giao', color: 'green' },
  { value: 'cancelled', label: 'Đã huỷ', color: 'red' },
  { value: 'failed', label: 'Thanh toán thất bại', color: 'red' }
];

const fetchOrderProducts = async (orderId) => {
  let token = Cookies.get('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
  if (!token) {
    console.warn('Không tìm thấy token, bỏ qua gọi API products');
    return [];
  }
  console.log('Token dùng cho API:', token);
  const res = await axios.get(`${API_BASE_URL}/orders/${orderId}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Component con cho nút filter
const FilterButton = ({ option, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? `${ORDER_STATUS_CONFIG[option.value]?.buttonClass || 'bg-blue-600 text-white'}`
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {option.label}
  </button>
);

// Component con cho filter bar
const FilterBar = ({ statusFilter, onFilterChange }) => (
  <div className="flex flex-wrap justify-center gap-2 mb-6">
    {FILTER_OPTIONS.map((option) => (
      <FilterButton
        key={option.value}
        option={option}
        isActive={statusFilter === option.value}
        onClick={() => onFilterChange(option.value)}
      />
    ))}
  </div>
);

// Component con cho badge trạng thái
const StatusBadge = ({ status }) => {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: "Không xác định",
    className: "bg-gray-100 text-gray-600"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${config.className}`}>
      {config.label}
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
      <p className="text-red-500 font-medium">{item.cur_price?.toLocaleString()}đ</p>
    </div>
    {order_status === 'delivered' && (
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
        {(item.cur_price * item.qty).toLocaleString()}đ
      </div>
    </div>
  </div>
);

// Component con cho popup đánh giá
const ReviewPopup = ({ show, product, rating, comment, onRatingChange, onCommentChange, onSubmit, onClose }) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex items-center gap-6 mb-6">
          <img src={product.images?.[0]} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
          <div>
            <h3 className="font-semibold text-2xl text-gray-800">{product.name}</h3>
          </div>
        </div>
        <div className="mb-6">
          <p className="text-base text-gray-600 mb-2">Chọn số sao:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => onRatingChange(star)}
                className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-base text-gray-600 mb-2">Nội dung đánh giá:</p>
          <textarea
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 text-base"
            placeholder="Nhập nội dung đánh giá..."
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </div>
        <button
          onClick={onSubmit}
          className="w-full bg-[#06AEF4] hover:bg-[#70d9ff] text-white py-3 rounded-lg text-base font-semibold transition-colors"
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

// Component con cho pagination
const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 ${
            pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
              pagination.page === pageNum
                ? 'bg-[#06AEF4] text-white border-[#06AEF4]'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 ${
            pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Trang {pagination.page} / {pagination.totalPages} - Tổng {pagination.total} đơn hàng
      </div>
    </div>
  );
};

const Order = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 3,
    totalPages: 1
  });

  // Fetch orders
  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async (page = 1, limit = 3) => {
      try {
        setLoading(true);
        setError(null);
        const ordersData = await getMyOrders(page, limit);
        console.log('ordersData:', ordersData.data.data);
        
        // Sắp xếp đơn hàng từ mới nhất đến cũ nhất
        const sortedOrders = ordersData.data.data.sort((a, b) => {
          return new Date(b.create_at) - new Date(a.create_at);
        });
        
        setOrders(sortedOrders);
        setPagination(ordersData.data.pagination);
      } catch (err) {
        setOrders([]);
        setError(err?.message || 'Đã xảy ra lỗi khi lấy đơn hàng.');
        console.error('Lỗi khi lấy đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders(pagination.page, pagination.limit);
  }, [pagination.page, isAuthenticated, navigate]);

  // Filter orders
  const getFilteredOrders = () => {
    if (statusFilter === 'all') {
      return orders;
    }
    return orders.filter(order => order.order_status === statusFilter);
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Get display items
  const getDisplayItems = (items, orderId) => {
    if (!items || items.length === 0) return [];
    const isExpanded = expandedOrders.has(orderId);
    return isExpanded ? items : items.slice(0, 3);
  };

  // Handle review popup
  const handleOpenPopup = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment('');
    setShowPopup(true);
  };

  const handleSubmitReview = () => {
    const data = {
      product_id: selectedProduct._id,
      rating,
      content: comment
    };
    console.log('Đánh giá:', data);
    createReview(data);
    setShowPopup(false);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      page: newPage
    }));
  };

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
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.');
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải đơn hàng...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // No orders state
  if (orders.length === 0 && !loading) {
    return <div className="text-center py-10 text-red-500">Không có đơn hàng nào.</div>;
  }

  // No filtered orders state
  const filteredOrders = getFilteredOrders();
  if (filteredOrders.length === 0 && !loading && statusFilter !== 'all') {
    return (
      <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
        <FilterBar statusFilter={statusFilter} onFilterChange={setStatusFilter} />
        <div className="text-center py-10 text-gray-500">
          Không có đơn hàng nào với trạng thái "{FILTER_OPTIONS.find(opt => opt.value === statusFilter)?.label}".
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
      
      <FilterBar statusFilter={statusFilter} onFilterChange={setStatusFilter} />

      <div className="space-y-8">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:border-[#06AEF4] transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-lg text-blue-600">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-gray-500 text-sm">{new Date(order.create_at).toLocaleString()}</span>
                  <StatusBadge status={order.order_status} />
                </div>
                <p className="text-gray-700 text-base font-semibold mb-1">Địa chỉ: {order.address}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                {order.order_status === 'failed' && (
                  <button
                    onClick={() => navigate(`/checkout/${order._id}`)}
                    className="px-5 py-2 border border-red-600 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Tiếp tục thanh toán
                  </button>
                )}
                
                {order.order_status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-5 py-2 border border-gray-500 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Hủy đơn
                  </button>
                )}
                
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="px-5 py-2 border border-blue-600 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {order.items?.length > 0 ? (
                <>
                  {getDisplayItems(order.items, order._id).map((item) => (
                    <OrderProductItem key={item._id} item={item} onReview={handleOpenPopup} order_status={order.order_status} />
                  ))}
                  {order.items.length > 3 && !expandedOrders.has(order._id) && (
                    <div className="bg-gray-100 rounded-lg p-3 text-center">
                      <p className="text-gray-600 text-sm mb-2">
                        Và {order.items.length - 3} sản phẩm khác
                      </p>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="text-[#06AEF4] hover:text-[#70d9ff] font-medium text-sm transition-colors"
                      >
                        Xem tất cả {order.items.length} sản phẩm
                      </button>
                    </div>
                  )}
                  {order.items.length > 3 && expandedOrders.has(order._id) && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="text-[#06AEF4] hover:text-[#70d9ff] font-medium text-sm transition-colors"
                      >
                        Thu gọn
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-400 italic">Không có sản phẩm nào trong đơn hàng này.</div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tổng tiền</p>
                  <p className="font-semibold text-gray-800">
                    {(order?.total_amount ?? 0).toLocaleString()}đ
                  </p>
                </div>
                {order.order_status !== 'cancelled' && (

                <div className="text-center">
                  <p className="text-gray-600 mb-1">Đã thanh toán</p>
                  <p className="font-semibold text-green-600">
                    {(order?.total_amount ?? 0).toLocaleString()}đ
                  </p>
                </div>
                )}

                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tiền cần đổi trả</p>
                  <p className="font-semibold text-red-600">0đ</p>
                </div>
              
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      <ReviewPopup
        show={showPopup}
        product={selectedProduct}
        rating={rating}
        comment={comment}
        onRatingChange={setRating}
        onCommentChange={setComment}
        onSubmit={handleSubmitReview}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default Order;