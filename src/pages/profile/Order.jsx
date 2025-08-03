import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getMyOrders } from '../../service/UserService';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { getOrderDetailsByOrderId } from '../../service/Admin.Service';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:3000/api';

const fetchOrderProducts = async (orderId, token) => {
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

const Order = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 3,
    totalPages: 1
  });

  // State để quản lý việc hiển thị sản phẩm trong từng đơn hàng
  const [expandedOrders, setExpandedOrders] = useState(new Set());

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
        setOrders(ordersData.data.data);
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
    }
    console.log('Đánh giá:', data);
    createReview(data);
    setShowPopup(false);
  };

  const handlePageChange = (newPage) => {
    console.log('newPage:', newPage);
    console.log('pagination.totalPages:', pagination.totalPages);
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination((prev) => ({
      ...prev,
      page: newPage
    }));
  };

  // Hàm để toggle hiển thị tất cả sản phẩm của một đơn hàng
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

  // Hàm để lấy danh sách sản phẩm cần hiển thị
  const getDisplayItems = (items, orderId) => {
    if (!items || items.length === 0) return [];
    
    const isExpanded = expandedOrders.has(orderId);
    return isExpanded ? items : items.slice(0, 3);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }



  // Thêm component con cho từng sản phẩm trong đơn hàng
  const OrderProductItem = ({ item, onReview }) => {
    // Lấy ảnh đầu tiên từ mảng images nếu có
    const product = item.product_id;
    const imageUrl = Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : '/images/image_product.png';
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm mb-3 transition hover:shadow-md">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
          <img src={imageUrl} alt={product?.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow min-w-0 w-full">
          <h4 className="font-semibold text-gray-800 mb-1 truncate text-base sm:text-lg" title={product?.name}>{product?.name}</h4>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-500 font-bold text-base">{item.cur_price?.toLocaleString()}đ</span>
            <span className="text-gray-400 text-sm line-through">{item.old_price ? item.old_price.toLocaleString() + 'đ' : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Số lượng:</span>
            <span className="font-medium text-gray-800">{item.qty}</span>
          </div>
          <button
            onClick={() => onReview(product)}
            className="mt-2 px-4 py-2 text-xs sm:text-sm rounded-md text-white font-semibold bg-gradient-to-r from-yellow-400 to-yellow-300 shadow hover:from-yellow-500 hover:to-yellow-400 transition-colors"
          >
            Đánh giá sản phẩm
          </button>
        </div>
        <div className="text-right flex-shrink-0 w-24 hidden sm:block">
          <div className="font-semibold text-gray-800 text-base">{(item.cur_price * item.qty).toLocaleString()}đ</div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h2>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Đang tải đơn hàng...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-red-500 text-center py-8">{error}</div>
      )}

      {/* Empty state - khi chưa có order nào */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="mt-2">Chưa có đơn hàng nào</p>
          <p className="text-sm text-gray-400">Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên</p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:border-[#06AEF4] transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-lg text-blue-600">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-gray-500 text-sm">{new Date(order.create_at).toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${order.order_status === 'Đã giao' ? 'bg-green-100 text-green-700' : order.order_status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{order.order_status}</span>
                </div>
                <p className="text-gray-700 text-base font-semibold mb-1">Địa chỉ: {order.address}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button 
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="px-5 py-2 border border-blue-600 bg-white hover:bg-blue-50 text-blue-600 font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Xem chi tiết
                </button>
                <button className="px-5 py-2 border border-[#06AEF4] bg-[#06AEF4] hover:bg-[#70d9ff] text-white font-semibold rounded-lg shadow-sm transition-colors">
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {order.items?.length > 0 ? (
                <>
                  {getDisplayItems(order.items, order._id).map((item) => (
                    <OrderProductItem key={item._id} item={item} onReview={handleOpenPopup} />
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
      )}

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="w-full">
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 ${
                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            {/* Hiển thị số trang thông minh */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
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
              onClick={() => handlePageChange(pagination.page + 1)}
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
          
          {/* Thông tin phân trang */}
          <div className="text-center mt-4 text-sm text-gray-600">
            Trang {pagination.page} / {pagination.totalPages} - Tổng {pagination.total} đơn hàng
          </div>
        </div>
      )}

      {/* Popup đánh giá */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl cursor-pointer"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <div className="flex items-center gap-6 mb-6">
              <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="font-semibold text-2xl text-gray-800">{selectedProduct.name}</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-base text-gray-600 mb-2">Chọn số sao:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
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
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmitReview}
              className="w-full bg-[#06AEF4] hover:bg-[#70d9ff] text-white py-3 rounded-lg text-base font-semibold transition-colors"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;