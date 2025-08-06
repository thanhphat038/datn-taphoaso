import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaShoppingBag, FaHome, FaGift, FaTruck } from 'react-icons/fa';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <FaCheckCircle className="text-green-500" />
              <span className="text-sm font-medium">
                Đơn hàng đã được xác nhận và đang được xử lý
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
              <span className="font-medium text-green-600">Đã thanh toán</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-medium text-blue-600">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
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
            Bạn sẽ nhận được email xác nhận trong vài phút
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