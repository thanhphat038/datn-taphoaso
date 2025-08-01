import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getMyOrders } from '../../service/UserService';

const Order = () => {
  const navigate = useNavigate();
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

  function renderOrderStatusBadge(order_status) {
    const statusMap = {
      pending: {
        label: "Chờ thanh toán",
        className: "bg-gray-100 text-gray-600",
      },
      paid: {
        label: "Đã thanh toán",
        className: "bg-blue-100 text-blue-700",
      },
      processing: {
        label: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-700",
      },
      delivered: {
        label: "Đã giao thành công",
        className: "bg-green-100 text-green-700",
      },
      cancelled: {
        label: "Đã huỷ",
        className: "bg-red-100 text-red-600",
      },
    };

    const status = statusMap[order_status] || {
      label: "Không xác định",
      className: "bg-gray-100 text-gray-600",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${status.className}`}
      >
        {status.label}
      </span>
    );
  }



  useEffect(() => {
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
  }, [pagination.page]);

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

  if (orders.length === 0 && !loading) {
    return <div className="text-center py-10 text-red-500">Không có đơn hàng nào.</div>;
  }

  // Thêm component con cho từng sản phẩm trong đơn hàng
  const OrderProductItem = ({ item, onReview, order_status }) => (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border-2 border-transparent hover:border-gray-200">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img src={item.product_id?.images?.[0]} alt={item.product_id?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-gray-800 mb-1 truncate" title={item.product_id?.name}>{item.product_id?.name}</h4>
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
        <div className="font-semibold text-gray-800">{(item.cur_price * item.qty).toLocaleString()}đ</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-2 sm:p-6 shadow border border-gray-100 min-h-[60vh]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lịch sử đơn hàng</h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:border-[#06AEF4] transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-lg text-blue-600">#{order._id.slice(-6).toUpperCase()}</span>
                  <span className="text-gray-500 text-sm">{new Date(order.create_at).toLocaleString()}</span>
                  {/* <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${order.order_status === 'Đã giao' ? 'bg-green-100 text-green-700' : order.order_status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{order.order_status}</span> */}
                  <span>{renderOrderStatusBadge(order.order_status)}</span>
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
                {/* <button className="px-5 py-2 border border-[#06AEF4] bg-[#06AEF4] hover:bg-[#70d9ff] text-white font-semibold rounded-lg shadow-sm transition-colors">
                  Liên hệ hỗ trợ
                </button> */}
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
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Đã thanh toán</p>
                  <p className="font-semibold text-green-600">
                    {(order?.originalTotal ?? 0).toLocaleString()}đ
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tiền cần đổi trả</p>
                  <p className="font-semibold text-red-600">0đ</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="w-full">
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 ${pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${pagination.page === pageNum
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
              className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 ${pagination.page === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
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