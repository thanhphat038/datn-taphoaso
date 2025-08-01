import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CartContext } from '../context/CartContext';



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

        const handleReorder = (order) => {
          if (!order || !order.items) return;

          order.items.forEach(item => {
            const product = item.product_id;
            const quantity = item.qty || 1;
            addToCart(product, quantity);
          });

          navigate('/checkout');
        };


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
          <div className="w-20 h-20 bg-gradient-to-br from-[#06AEF4] to-[#70d9ff] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang tải chi tiết đơn hàng...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không thể tải đơn hàng</h2>
          <p className="text-red-500 mb-6">{error || 'Không tìm thấy đơn hàng'}</p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/profile/orders')}
              className="px-6 py-3 bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all font-bold shadow-lg"
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
              className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold"
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
      <div className="bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">Đơn hàng #{order._id?.slice(-6).toUpperCase() || order.id}</h1>
            <p className="text-blue-100 text-sm">{order.create_at ? new Date(order.create_at).toLocaleString('vi-VN') : order.date}</p>
          </div>
          <button 
            onClick={() => navigate('/profile/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all text-white font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      {/* Compact Order Status */}
      <div className="bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-white">
              <h3 className="font-bold text-lg">Trạng thái đơn hàng</h3>
              <p className="text-blue-100">{order.order_status || 'Đang xử lý'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Đang xử lý</span>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Products */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#06AEF4] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Sản phẩm ({order.items?.length || 0})</h2>
            </div>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={item._id || index} className="flex gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product_id?.images?.[0] || item.product_id?.image || '/images/image_product.png'}
                        alt={item.product_id?.name || 'Sản phẩm'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/image_product.png';
                        }}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.product_id?.name || 'Sản phẩm'}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-1 bg-[#06AEF4]/10 text-[#06AEF4] rounded-full text-xs font-semibold">
                          x{item.qty || 1}
                        </span>
                        <span className="font-bold text-red-500">
                          {((item.cur_price || item.price || 0) * (item.qty || 1)).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Không có sản phẩm nào trong đơn hàng này.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-4">
          {/* Compact Info Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#06AEF4] rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Địa chỉ giao hàng</div>
                  <div className="font-semibold text-gray-900">{order.address || 'Chưa có địa chỉ'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#06AEF4] rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phương thức thanh toán</div>
                  <div className="font-semibold text-gray-900">{order.payment_method || 'Thanh toán khi nhận hàng'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#06AEF4] rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Tổng thanh toán</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">{(order.total_amount || 0).toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold">0đ</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Tổng tiền</span>
                <span className="font-bold text-xl text-[#06AEF4]">
                  {(order.total_amount || 0).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {order.order_status === 'delivered' ? (
              <>
                <button
                  onClick={() => handleReorder(order)}
                  className="w-1/2 bg-[#06AEF4] text-white py-3 rounded-xl hover:bg-[#70d9ff] transition-colors font-semibold"
                >
                  Mua lại
                </button>

                <button className="w-1/2 border border-[#06AEF4] text-[#06AEF4] py-3 rounded-xl hover:bg-[#06AEF4] hover:text-white transition-colors font-semibold">
                  Liên hệ hỗ trợ
                </button>
              </>
            ) : (
              <button className="w-1/2 ml-auto border border-[#06AEF4] text-[#06AEF4] py-3 rounded-xl hover:bg-[#06AEF4] hover:text-white transition-colors font-semibold">
                Liên hệ hỗ trợ
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
