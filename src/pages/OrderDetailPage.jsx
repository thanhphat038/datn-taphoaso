import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = Cookies.get('auth_token');
        if (!token) {
          setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
          return;
        }

        console.log('🔍 Debug - Fetching order detail for ID:', id);
        const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('🔍 Debug - Order detail response:', response.data);
        console.log('🔍 Debug - Order data:', response.data.data);
        console.log('🔍 Debug - Order items:', response.data.data?.items);
        setOrder(response.data.data);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng');
        } else if (err.response?.status === 401) {
          setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
        } else {
          setError('Không thể tải chi tiết đơn hàng');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Không tìm thấy đơn hàng'}</p>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/profile/orders')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách đơn hàng
            </button>
            <br />
            <button 
              onClick={async () => {
                try {
                  const token = Cookies.get('auth_token');
                  const response = await axios.post('http://localhost:3000/api/orders', {
                    address: 'Test Address',
                    receiver: 'Test User',
                    sdt: '0123456789',
                    payment_method: 'cod',
                    items: [
                      { product_id: '6862d1c32df5d5159cc51ef5', qty: 2 }
                    ]
                  }, {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  console.log('🔍 Debug - Test order created:', response.data);
                  alert('Đã tạo đơn hàng test thành công!');
                  // Reload page to show new order
                  window.location.reload();
                } catch (error) {
                  console.error('Error creating test order:', error);
                  alert('Lỗi tạo đơn hàng test: ' + error.message);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Tạo đơn hàng test
            </button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Chi tiết đơn hàng #{order._id?.slice(-6).toUpperCase() || order.id}</h1>
          <p className="text-gray-600">{order.create_at ? new Date(order.create_at).toLocaleString('vi-VN') : order.date}</p>
        </div>
        <button 
          onClick={() => navigate('/profile/orders')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
        {order.timeline && order.timeline.length > 0 ? (
          <div className="relative px-8">
            <div className="grid grid-cols-5 gap-4">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900 text-sm mb-1">{event.status}</div>
                    <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                    <div className="text-xs text-gray-600 leading-tight">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Connecting Line */}
            <div className="absolute top-5 left-16 right-16 h-0.5 bg-blue-200" style={{ zIndex: 0 }}></div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Đơn hàng đang được xử lý</p>
            <p className="text-sm mt-2">Trạng thái: {order.order_status || 'Đang xử lý'}</p>
          </div>
        )}
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Products */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={item._id || index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product_id?.images?.[0] || item.product_id?.image || '/images/image_product.png'}
                        alt={item.product_id?.name || 'Sản phẩm'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/image_product.png';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900">{item.product_id?.name || 'Sản phẩm'}</h3>
                      <div className="mt-1 text-sm text-gray-500">
                        x{item.qty || 1}
                      </div>
                      <div className="mt-1 font-medium text-red-500">
                        {(item.cur_price || item.price || 0).toLocaleString()}đ
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <div className="font-semibold text-gray-900">
                        {((item.cur_price || item.price || 0) * (item.qty || 1)).toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có sản phẩm nào trong đơn hàng này.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</div>
                <div className="text-gray-900">{order.address || 'Chưa có địa chỉ'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Trạng thái đơn hàng</div>
                <div className="text-gray-900">{order.order_status || 'Đang xử lý'}</div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
                <div className="text-gray-900">{order.payment_method || 'Thanh toán khi nhận hàng'}</div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{(order.total_amount || 0).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">0đ</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Tổng tiền</span>
                  <span className="font-semibold text-xl text-red-500">
                    {(order.total_amount || 0).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-[#06AEF4] text-white py-3 rounded-full hover:bg-blue-700 transition-colors font-medium">
              Mua lại
            </button>
            <button className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
