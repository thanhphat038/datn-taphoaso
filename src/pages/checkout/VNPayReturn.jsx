import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { processPaymentReturn } from '../../service/Checkout.service.js';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        setIsLoading(true);
        
        // Lấy tất cả query parameters từ URL
        const queryParams = {};
        for (const [key, value] of searchParams.entries()) {
          queryParams[key] = value;
        }

        console.log('VNPAY Return URL params:', queryParams);

        // Gọi API để xử lý payment return
        const result = await processPaymentReturn(queryParams);
        console.log('Payment return result:', result);
        
        setPaymentResult(result);
        
        // Redirect sau khi xử lý
        if (result.success) {
          // Chuyển đến trang waiting để hiển thị trạng thái và cho phép hủy đơn hàng
          const orderId = queryParams.vnp_OrderInfo || queryParams.vnp_TxnRef || result.orderId;
          if (orderId && orderId.trim() !== '') {
            setTimeout(() => {
              navigate(`/checkout/payment/waiting?orderId=${orderId}`);
            }, 2000);
          } else {
            setTimeout(() => {
              navigate('/checkout/payment/success');
            }, 2000);
          }
          // Tự đóng tab sau 10 giây
          setTimeout(() => {
            window.close();
          }, 10000);
        } else {
          // Nếu thanh toán fail, chuyển về trang chờ thanh toán với orderId
          const orderId = queryParams.vnp_OrderInfo || queryParams.vnp_TxnRef || result.orderId;
          if (orderId && orderId.trim() !== '') {
            // Vnp_TxnRef có thể không phải MongoDB ObjectId
            setTimeout(() => {
              navigate(`/checkout/payment/waiting?orderId=${orderId}`);
            }, 3000);
            // Tự đóng tab sau 10 giây
            setTimeout(() => {
              window.close();
            }, 10000);
          } else {
            console.warn('No orderId found in payment result');
            setTimeout(() => {
              navigate('/profile/orders');
            }, 3000);
            // Tự đóng tab sau 10 giây
            setTimeout(() => {
              window.close();
            }, 10000);
          }
        }
      } catch (err) {
        console.error('Error processing payment return:', err);
        setError('Có lỗi xảy ra khi xử lý thanh toán');
        setTimeout(() => {
          // Thử lấy orderId từ URL params
          const orderId = searchParams.get('vnp_OrderInfo') || searchParams.get('vnp_TxnRef');
          if (orderId && orderId.trim() !== '') {
            // Vnp_TxnRef có thể không phải MongoDB ObjectId
            navigate(`/checkout/payment/waiting?orderId=${orderId}`);
          } else {
            console.warn('No orderId found in error handling');
            navigate('/profile/orders');
          }
        }, 3000);
        // Tự đóng tab sau 10 giây
        setTimeout(() => {
          window.close();
        }, 10000);
      } finally {
        setIsLoading(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lỗi xử lý thanh toán</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="text-blue-600">Tab này sẽ tự đóng sau 10 giây.</span>
            </p>
            <button
              onClick={() => {
                const orderId = searchParams.get('vnp_TxnRef');
                if (orderId && orderId.trim() !== '') {
                  // Vnp_TxnRef có thể không phải MongoDB ObjectId
                  navigate(`/checkout/payment/waiting?orderId=${orderId}`);
                } else {
                  navigate('/profile/orders');
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Chờ thanh toán
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full mx-4">
        <div className="text-center">
          {paymentResult?.success ? (
            <>
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h2>
              <p className="text-gray-600 mb-6">{paymentResult.message}</p>
              
              {paymentResult.transactionInfo && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">Thông tin giao dịch:</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Mã đơn hàng:</span> {paymentResult.orderId}</div>
                    <div><span className="font-medium">Số tiền:</span> {paymentResult.transactionInfo.amount?.toLocaleString('vi-VN')} VNĐ</div>
                    <div><span className="font-medium">Ngân hàng:</span> {paymentResult.transactionInfo.bankCode || 'N/A'}</div>
                    <div><span className="font-medium">Loại thẻ:</span> {paymentResult.transactionInfo.cardType || 'N/A'}</div>
                    <div><span className="font-medium">Mã giao dịch:</span> {paymentResult.transactionInfo.transactionNo || 'N/A'}</div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-4">
                Bạn sẽ được chuyển hướng về trang thành công trong 5 giây...
                <br />
                <span className="text-blue-600">Tab này sẽ tự đóng sau 10 giây.</span>
              </p>
            </>
          ) : (
            <>
              <div className="text-red-500 text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thất bại</h2>
              <p className="text-gray-600 mb-6">{paymentResult?.message || 'Có lỗi xảy ra trong quá trình thanh toán'}</p>
              
              {paymentResult?.responseCode && (
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <p className="text-red-700 text-sm">
                    <span className="font-medium">Mã lỗi:</span> {paymentResult.responseCode}
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-4">
                Bạn sẽ được chuyển hướng về trang chờ thanh toán trong 3 giây...
                <br />
                <span className="text-blue-600">Tab này sẽ tự đóng sau 10 giây.</span>
              </p>
              
              <button
                onClick={() => {
                  const orderId = paymentResult?.orderId || searchParams.get('vnp_OrderInfo') || searchParams.get('vnp_TxnRef');
                  if (orderId && orderId.trim() !== '') {
                    // Vnp_TxnRef có thể không phải MongoDB ObjectId
                    navigate(`/checkout/payment/waiting?orderId=${orderId}`);
                  } else {
                    console.warn('No orderId found in button click');
                    navigate('/profile/orders');
                  }
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chờ thanh toán
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn; 