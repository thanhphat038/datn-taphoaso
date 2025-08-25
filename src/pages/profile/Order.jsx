import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getMyOrders } from '../../service/user.service';
import { useAuth } from '../../context/AuthContext';
import { EmptyState, OrderCard } from '../../components';

// Import utilities
import { 
  sortOrdersByDate,
  filterOrdersByStatus,
  createPaginationFromResponse
} from '../../utils';

// Constants - Sử dụng utility functions thay vì hardcode
const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả', color: 'blue' },
  { value: 'paid', label: 'Đã thanh toán', color: 'blue' },
  { value: 'processing', label: 'Đang xử lý ', color: 'yellow' },
  { value: 'pending', label: 'Chờ xử lý', color: 'gray' },
  { value: 'delivered', label: 'Đã giao', color: 'green' },
  { value: 'cancelled', label: 'Đã huỷ', color: 'red' },
  { value: 'failed', label: 'Thanh toán thất bại', color: 'red' }
];

// Component con cho nút filter
const FilterButton = ({ option, isActive, onClick }) => {
  // Map utility styles sang CSS classes tương ứng cho button
  const getButtonClass = (status) => {
    const buttonClassMap = {
      'pending': 'bg-gray-600 text-white',
      'paid': 'bg-blue-600 text-white',
      'processing': 'bg-yellow-600 text-white',
      'delivered': 'bg-green-600 text-white',
      'cancelled': 'bg-red-600 text-white',
      'failed': 'bg-red-600 text-white',
      'all': 'bg-blue-600 text-white'
    };
    
    return buttonClassMap[status] || 'bg-blue-600 text-white';
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? getButtonClass(option.value)
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {option.label}
    </button>
  );
};

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
          <img 
            src={product.images?.[0] || '/img/pd_img.png'} 
            alt={product.name || 'Sản phẩm'} 
            className="w-20 h-20 rounded-xl object-cover"
            onError={(e) => {
              e.target.src = '/img/pd_img.png'; // Fallback image
            }}
          />
          <div>
            <h3 className="font-semibold text-2xl text-gray-800">{product.name || 'Tên sản phẩm không xác định'}</h3>
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
        console.log('🔍 Debug - Fetching orders for page:', page, 'limit:', limit);
        
        const ordersData = await getMyOrders(page, limit);
        console.log('🔍 Debug - Raw ordersData:', ordersData);
        console.log('🔍 Debug - ordersData.data:', ordersData.data);
        console.log('🔍 Debug - ordersData.data.data:', ordersData.data?.data);
        
        // Dữ liệu từ backend đã có cấu trúc đúng, không cần xử lý thêm
        const ordersList = ordersData.data?.data || [];
        
        console.log('🔍 Debug - Orders list:', ordersList);
        console.log('🔍 Debug - Orders list length:', ordersList.length);
        
        if (ordersList.length > 0) {
          console.log('🔍 Debug - First order:', ordersList[0]);
          console.log('🔍 Debug - First order items:', ordersList[0]?.items);
          if (ordersList[0]?.items?.length > 0) {
            console.log('🔍 Debug - First item:', ordersList[0].items[0]);
            console.log('🔍 Debug - First item product_id:', ordersList[0].items[0]?.product_id);
            console.log('🔍 Debug - First item product name:', ordersList[0].items[0]?.product_id?.name);
            console.log('🔍 Debug - First item images:', ordersList[0].items[0]?.product_id?.images);
          }
        }
        
        // Sắp xếp đơn hàng từ mới nhất đến cũ nhất
        const sortedOrders = sortOrdersByDate(ordersList);
        
        setOrders(sortedOrders);
        setPagination(createPaginationFromResponse(ordersData.data));
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
    const filtered = filterOrdersByStatus(orders, statusFilter);
    
    // Log để debug
    console.log('Filtered orders:', filtered);
    
    return filtered;
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
    return (
      <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
        <EmptyState
          variant="order"
          title="Chưa có đơn hàng nào"
          description="Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!"
          actionText="Mua sắm ngay"
          actionUrl="/product"
        />
      </div>
    );
  }

  // No filtered orders state
  const filteredOrders = getFilteredOrders();
  if (filteredOrders.length === 0 && !loading && statusFilter !== 'all') {
    return (
      <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
        <FilterBar statusFilter={statusFilter} onFilterChange={setStatusFilter} />
        <EmptyState
          variant="order"
          title={`Không có đơn hàng nào với trạng thái "${FILTER_OPTIONS.find(opt => opt.value === statusFilter)?.label}"`}
          description="Hãy thử chọn trạng thái khác hoặc tạo đơn hàng mới"
          actionText="Xem tất cả đơn hàng"
          actionUrl="#"
          showAction={false}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
      
      <FilterBar statusFilter={statusFilter} onFilterChange={setStatusFilter} />

      <div className="space-y-8">
        {filteredOrders.map((order) => {
          return (
            <OrderCard
              key={order._id}
              order={order}
              expandedOrders={expandedOrders}
              onToggleExpansion={toggleOrderExpansion}
              onReview={handleOpenPopup}
              onRefresh={() => window.location.reload()}
            />
          );
        })}
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