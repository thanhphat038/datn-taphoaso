import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CheckoutGuard = ({ children }) => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowMessage(true);
      // Redirect sau 3 giây
      const timer = setTimeout(() => {
        navigate('/cart', { replace: true });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, navigate]);

  // Kiểm tra nếu giỏ hàng trống
  if (cartItems.length === 0) {
    if (showMessage) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Đang chuyển hướng về giỏ hàng...
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/product')}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Mua sắm ngay
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      );
    }
    return <Navigate to="/cart" replace />;
  }

  return children;
};

export default CheckoutGuard; 