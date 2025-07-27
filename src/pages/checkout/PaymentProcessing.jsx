import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../../service/Checkout.service';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Lấy thông tin từ location state
  const { paymentUrl, orderData } = location.state || {};
  
  // Log URL nhận được từ API
  console.log('Payment URL from API:', paymentUrl);
  console.log('Order Data:', orderData);
  console.log('Order ID from orderData:', orderData?._id);
  console.log('Order ID from orderData.orderId:', orderData?.orderId);
  console.log('Full orderData object:', JSON.stringify(orderData, null, 2));

  // Tạo đơn hàng nếu chưa có (backup)
  useEffect(() => {
    const createOrderIfNeeded = async () => {
      if (orderData && !orderData.orderId) {
        try {
          console.log('Creating order from PaymentProcessing...');
          const orderResponse = await createOrder(orderData);
          console.log('Order created from PaymentProcessing:', orderResponse);
        } catch (error) {
          console.error('Error creating order from PaymentProcessing:', error);
        }
      }
    };
    
    createOrderIfNeeded();
  }, [orderData]);

  useEffect(() => {
    // Confirm trước khi user tắt trang hoặc refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Bạn có chắc muốn tắt trang? Thanh toán sẽ bị hủy.';
      return 'Bạn có chắc muốn tắt trang? Thanh toán sẽ bị hủy.';
    };

    // Chặn refresh trang
    const handleKeyDown = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        alert('Không thể refresh trang trong quá trình thanh toán!');
        return false;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    // Chặn quay lại trang trước đó
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      alert('Không thể quay lại trang trước đó trong quá trình thanh toán!');
    };

    // Thêm state vào history để chặn back button
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    // Chuyển hướng ngay lập tức
    if (paymentUrl) {
      // Delay nhỏ để user thấy loading screen
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 500);
    } else {
      navigate('/checkout', { 
        state: { error: 'Không thể tạo thanh toán' } 
      });
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [paymentUrl, navigate]);

  const handleCancelPayment = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    navigate('/checkout', { 
      state: { error: 'Thanh toán đã bị hủy' } 
    });
  };

  const handleContinuePayment = () => {
    setShowConfirm(false);
  };

  const handleManualRedirect = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  // Bảo mật: Chặn truy cập trực tiếp vào route này
  if (!paymentUrl || !orderData) {
    // Redirect về checkout nếu truy cập trực tiếp
    useEffect(() => {
      navigate('/checkout', { 
        state: { error: 'Truy cập không hợp lệ. Vui lòng thực hiện thanh toán từ trang checkout.' } 
      });
    }, [navigate]);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Truy cập không hợp lệ</h2>
          <p className="text-gray-600 mb-6">
            Vui lòng thực hiện thanh toán từ trang checkout.
          </p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Quay lại checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
        {/* Loading Animation */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>

        {/* Payment Gateway Logo */}
        <div className="mb-4">
          <img 
            src="/img/vnpay.png" 
            alt="Payment Gateway" 
            className="h-8 mx-auto"
          />
        </div>

        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          Đang chuyển hướng thanh toán...
        </h2>

        <p className="text-gray-600 mb-4">
          Vui lòng chờ trong giây lát
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleManualRedirect}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Chuyển ngay
          </button>
          <button
            onClick={handleCancelPayment}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy thanh toán
          </button>
        </div>

        {/* Order Info */}
        {orderData && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h3 className="font-semibold mb-2">Thông tin đơn hàng:</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Order ID:</strong> {orderData._id || orderData.orderId || 'N/A'}</p>
              <p>Tổng tiền: {orderData.total_amount?.toLocaleString()} đ</p>
              <p>Người nhận: {orderData.receiver}</p>
              <p>SĐT: {orderData.sdt}</p>
              <p>Phương thức: {orderData.payment_method}</p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận hủy thanh toán</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn hủy thanh toán? Đơn hàng sẽ không được tạo.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleContinuePayment}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Tiếp tục
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing; 