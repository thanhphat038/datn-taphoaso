import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { addToCart } from '../service/Cart.service';
import { useAlertContext } from '../components/AlertProvider';
import { getApiUrl } from '../config/api.js';

import { ArrowLeft, Calendar, MapPin, User, Phone, Package } from 'lucide-react';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const { showAlert } = useAlertContext();

  // Lấy user_id từ token
  const getUserId = () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  // Hàm xử lý mua lại
  const handleReorder = async (order) => {
    if (loadingReorder) return;
    
    const userId = getUserId();
    if (!userId) {
      showAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để mua lại đơn hàng',
        type: 'warning'
      });
      return;
    }

    if (!order || !order.items || order.items.length === 0) {
      showAlert({
        title: 'Lỗi',
        message: 'Không có sản phẩm nào trong đơn hàng này',
        type: 'error'
      });
      return;
    }

    setLoadingReorder(true);
    try {
      // Thêm tất cả sản phẩm từ đơn hàng vào giỏ hàng
      for (const item of order.items) {
        const productId = item.product_id?._id || item.product_id;
        const quantity = item.qty || 1;
        
        if (productId) {
          await addToCart(productId, quantity);
        }
      }

      // Dispatch event để cập nhật cart context
      window.dispatchEvent(new Event('cart-updated'));
      
      showAlert({
        title: 'Thành công',
        message: 'Đã thêm tất cả sản phẩm vào giỏ hàng!',
        type: 'success'
      });

      // Chuyển đến trang thanh toán sau 1 giây
      setTimeout(() => {
        navigate('/checkout');
      }, 1000);
      
    } catch (error) {
      console.error('Error in handleReorder:', error);
      showAlert({
        title: 'Lỗi',
        message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
        type: 'error'
      });
    } finally {
      setLoadingReorder(false);
    }
  };

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

        const response = await axios.get(`${getApiUrl(`/orders/${id}`)}`, {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'processing':
        return 'Đang xử lý';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Chờ xử lý';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Đang tải chi tiết đơn hàng...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải đơn hàng</h2>
            <p className="text-red-500 mb-6">{error || 'Không tìm thấy đơn hàng'}</p>
            <button 
              onClick={() => navigate('/profile/orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/profile/orders')}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Đơn hàng #{order._id?.slice(-6).toUpperCase() || order.id}
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {order.create_at ? new Date(order.create_at).toLocaleString('vi-VN') : order.date}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.order_status)}`}>
            {getStatusText(order.order_status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đặt</h2>
            
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div 
                    key={item._id || index} 
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
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
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product_id?.name || 'Sản phẩm'}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Số lượng: {item.qty || 1}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {item.cur_price?.toLocaleString() || item.price?.toLocaleString()}đ/chiếc
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">
                            {((item.cur_price || item.price || 0) * (item.qty || 1)).toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Không có sản phẩm nào trong đơn hàng này.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</p>
                  <p className="font-semibold text-gray-900">{order.address || 'Chưa có địa chỉ'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Người nhận</p>
                  <p className="font-semibold text-gray-900">{order.receiver || 'Chưa có thông tin'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-semibold text-gray-900">{order.sdt || 'Chưa có số điện thoại'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phương thức</span>
                <span className="font-semibold text-gray-900">
                  {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 
                   order.payment_method === 'vnpay' ? 'VNPAY' : 
                   order.payment_method || 'Chưa xác định'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.order_status)}`}>
                  {getStatusText(order.order_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Tổng thanh toán</h3>
            
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
                <span className="font-bold text-xl text-blue-600">
                  {(order.total_amount || 0).toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {(order.order_status === 'delivered' || order.order_status === 'cancelled') ? (
              <>
                <button
                  onClick={() => handleReorder(order)}
                  disabled={loadingReorder}
                  className="w-1/2 bg-[#06AEF4] text-white py-3 rounded-xl hover:bg-[#70d9ff] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingReorder ? (
                    <>
                      <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      Mua lại
                    </>
                  )}
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
