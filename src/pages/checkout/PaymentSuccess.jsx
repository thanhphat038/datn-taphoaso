import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaShoppingBag, FaHome, FaGift, FaTruck } from 'react-icons/fa';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Lấy thông tin phương thức thanh toán từ state
  const paymentMethod = location.state?.paymentMethod || 'cod';
  const orderId = location.state?.orderId || Math.random().toString(36).substr(2, 9).toUpperCase();
  
  // Xác định trạng thái đơn hàng dựa trên phương thức thanh toán
  const getOrderStatus = () => {
    if (paymentMethod === 'cod') {
      return { text: 'Chờ xử lý', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    } else {
      return { text: 'Đã thanh toán', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    }
  };
  
  const orderStatus = getOrderStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-blue-50/20 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Background circle */}
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
              <FaCheckCircle className="text-white text-6xl animate-pulse" />
            </div>
            
            {/* Floating icons */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
              <FaGift className="text-white text-sm" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: '0.5s' }}>
              <FaTruck className="text-white text-sm" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {paymentMethod === 'cod' ? 'Đặt hàng thành công!' : 'Thanh toán thành công!'}
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.
          </p>
          <div className={`${orderStatus.bgColor} border ${orderStatus.borderColor} rounded-lg p-4 max-w-md mx-auto`}>
            <div className={`flex items-center justify-center gap-2 ${orderStatus.color.replace('text-', 'text-').replace('600', '700')}`}>
              <FaCheckCircle className={orderStatus.color.replace('text-', 'text-').replace('600', '500')} />
              <span className="text-sm font-medium">
                {paymentMethod === 'cod' 
                  ? 'Đơn hàng đã được xác nhận và đang chờ xử lý'
                  : 'Đơn hàng đã được xác nhận và đang được xử lý'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <FaShoppingBag className="text-blue-500" />
            Thông tin đơn hàng
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`font-medium ${orderStatus.color}`}>{orderStatus.text}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-medium text-blue-600">#{orderId}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bước tiếp theo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-xs text-gray-600">Xác nhận đơn hàng</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-xs text-gray-600">Chuẩn bị hàng</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-xs text-gray-600">Giao hàng</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile/orders')}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaShoppingBag className="text-sm" />
              Xem đơn hàng của tôi
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaShoppingBag className="text-sm" />
              Đăng nhập để xem đơn hàng
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-white text-blue-500 border-2 border-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaHome className="text-sm" />
            Về trang chủ
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            {paymentMethod === 'cod' 
              ? 'Bạn sẽ nhận được email xác nhận và thông báo khi đơn hàng được xử lý'
              : 'Bạn sẽ nhận được email xác nhận trong vài phút'
            }
          </p>
          <p className="text-xs text-gray-400">
            Nếu có thắc mắc, vui lòng liên hệ hotline: 1900-xxxx
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 