import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, CreditCard, Package, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';
import { cancelOrder, updateOrderStatus, getOrderInfo, retryVNPayPayment } from '../../service/Checkout.service.js';

const PaymentWaiting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Lấy orderId từ vnp_OrderInfo (VNPAY trả về) hoặc orderId (fallback)
  const orderId = searchParams.get('vnp_OrderInfo') || searchParams.get('orderId');
  
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isVnpayCallback, setIsVnpayCallback] = useState(false);
  const [callbackMessage, setCallbackMessage] = useState('');
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);

  // Kiểm tra xem có phải callback từ VNPAY không
  useEffect(() => {
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');
    
    if (vnpResponseCode || vnpTransactionStatus) {
      setIsVnpayCallback(true);
      
      // Ghi lại trạng thái callback từ VNPAY
      const callbackData = {
        timestamp: new Date().toISOString(),
        orderId: orderId,
        vnpResponseCode: vnpResponseCode,
        vnpTransactionStatus: vnpTransactionStatus,
        vnpAmount: searchParams.get('vnp_Amount'),
        vnpBankCode: searchParams.get('vnp_BankCode'),
        vnpCardType: searchParams.get('vnp_CardType'),
        vnpOrderInfo: searchParams.get('vnp_OrderInfo'),
        vnpPayDate: searchParams.get('vnp_PayDate'),
        vnpTxnRef: searchParams.get('vnp_TxnRef'),
        vnpTransactionNo: searchParams.get('vnp_TransactionNo'),
        vnpSecureHash: searchParams.get('vnp_SecureHash')
      };
      
      // Log ra console
      console.log('VNPAY Callback Data:', callbackData);
      
      // Lưu vào localStorage để debug
      const existingLogs = JSON.parse(localStorage.getItem('vnpay_callback_logs') || '[]');
      existingLogs.push(callbackData);
      // Giữ lại 10 log gần nhất
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      localStorage.setItem('vnpay_callback_logs', JSON.stringify(existingLogs));
      
      // Xác định thông báo dựa trên response code
      const getVnpayErrorMessage = (responseCode) => {
        const errorMessages = {
          '00': 'Giao dịch thành công',
          '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
          '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
          '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
          '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
          '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
          '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
          '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
          '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
          '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
          '75': 'Ngân hàng thanh toán đang bảo trì.',
          '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
          '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
        };
        
        return errorMessages[responseCode] || 'Lỗi không xác định';
      };
      
      if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
        setCallbackMessage('Thanh toán thành công! Đang cập nhật trạng thái...');
        setIsPaymentFailed(false);
        toast.success('Thanh toán thành công!');
        
        // Cập nhật trạng thái đơn hàng thành paid
        const updateOrderStatusToPaid = async () => {
          try {
            await updateOrderStatus(orderId, 'paid');
            console.log('Đã cập nhật trạng thái đơn hàng thành paid');
            
            // Tự động chuyển hướng sau khi cập nhật thành công
            setTimeout(() => {
              navigate('/checkout/payment/success');
            }, 2000);
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            toast.error('Có lỗi khi cập nhật trạng thái đơn hàng');
            // Vẫn chuyển hướng sau 3 giây nếu có lỗi
            setTimeout(() => {
              navigate('/checkout/payment/success');
            }, 3000);
          }
        };
        updateOrderStatusToPaid();
      } else {
        const errorMessage = getVnpayErrorMessage(vnpResponseCode);
        setCallbackMessage(`Thanh toán thất bại: ${errorMessage}`);
        setIsPaymentFailed(true);
        toast.error(`Thanh toán thất bại: ${errorMessage}`);
        
        // Cập nhật trạng thái đơn hàng thành failed
        const updateOrderStatusToFailed = async () => {
          try {
            await updateOrderStatus(orderId, 'failed');
            console.log('Đã cập nhật trạng thái đơn hàng thành failed');
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
          }
        };
        updateOrderStatusToFailed();
      }
    }
  }, [searchParams, navigate, orderId]);

  useEffect(() => {
    if (!orderId) {
      toast.error('Không tìm thấy thông tin đơn hàng. Chuyển về trang đơn hàng.');
      // Chuyển về trang orders
      setTimeout(() => {
        navigate('/profile/orders');
      }, 2000);
      return;
    }

    // Fetch thông tin đơn hàng
    const fetchOrderInfo = async () => {
      try {
        const response = await getOrderInfo(orderId);

        if (response.data.success) {
          const orderData = response.data.data;
          // Kiểm tra xem order có tồn tại không
          if (!orderData || !orderData.id) {
            toast.error('Không tìm thấy đơn hàng. Chuyển về trang đơn hàng.');
            // Chuyển về trang orders
            setTimeout(() => {
              navigate('/profile/orders');
            }, 2000);
            return;
          }

          // Kiểm tra trạng thái đơn hàng
          if (orderData.order_status === 'paid') {
            // Nếu đã thanh toán thành công, chuyển hướng về trang thành công
            toast.success('Thanh toán thành công!');
            navigate('/checkout/payment/success');
            return;
          }

          setOrderInfo({
            id: orderData.id,
            total_amount: orderData.total_amount,
            order_status: orderData.order_status,
            payment_method: orderData.payment_method,
            created_at: new Date(orderData.created_at).toLocaleString('vi-VN'),
            payment_deadline: new Date(orderData.payment_deadline)
          });

          // Tính thời gian còn lại từ payment_deadline
          const now = new Date();
          const deadline = new Date(orderData.payment_deadline);
          const remainingTime = Math.max(0, Math.floor((deadline - now) / 1000));
          setTimeLeft(remainingTime);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        // Kiểm tra loại lỗi
        if (error.response?.status === 404) {
          toast.error('Không tìm thấy đơn hàng. Chuyển về trang đơn hàng.');
          // Chuyển về trang orders
          setTimeout(() => {
            navigate('/profile/orders');
          }, 2000);
          return;
        } else if (error.response?.status === 401) {
          toast.error('Token không hợp lệ. Chuyển về trang đăng nhập.');
          // Chuyển về trang login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        } else {
          toast.error('Không thể lấy thông tin đơn hàng. Chuyển về trang đơn hàng.');
          // Chuyển về trang orders
          setTimeout(() => {
            navigate('/profile/orders');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderInfo();
  }, [orderId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Hiển thị thông báo thanh toán thất bại
      toast.error('Thanh toán thất bại! Hết thời gian thanh toán.');
      
      // Chuyển về orders sau 2 giây
      setTimeout(() => {
        navigate('/profile/orders');
      }, 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Tự động kiểm tra trạng thái đơn hàng mỗi 10 giây
  useEffect(() => {
    if (!orderId || !orderInfo) return;

    const checkOrderStatus = async () => {
      try {
        const response = await getOrderInfo(orderId);

        if (response.success) {
          const orderData = response.data;
          
          // Nếu trạng thái đã thay đổi thành 'paid', chuyển hướng
          if (orderData.order_status === 'paid') {
            toast.success('Thanh toán thành công!');
            navigate('/checkout/payment/success');
            return;
          }
          
          // Cập nhật thông tin đơn hàng nếu có thay đổi
          setOrderInfo(prev => ({
            ...prev,
            order_status: orderData.order_status
          }));
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái đơn hàng:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    // Comment lại tính năng check API liên tục để tránh bị giật
    // Sau khi thanh toán thành công, VNPAY sẽ return về trang này với trạng thái mới
    /*
    // Chỉ kiểm tra nếu đơn hàng đang ở trạng thái pending
    if (orderInfo.order_status === 'pending') {
      // Tránh gọi API liên tục nếu đang kiểm tra
      if (isCheckingStatus) return;

      setIsCheckingStatus(true);

      // Kiểm tra ngay lập tức
      checkOrderStatus();

      // Sau đó kiểm tra mỗi 10 giây
      const interval = setInterval(checkOrderStatus, 10000);

      return () => {
        clearInterval(interval);
        setIsCheckingStatus(false);
      };
    }
    */
  }, [orderId, orderInfo, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCheckPaymentStatus = async () => {
    try {
      // API kiểm tra trạng thái thanh toán
      // const response = await checkPaymentStatus(orderId);
      // if (response.success && response.data.status === 'paid') {
      //   navigate('/checkout/payment/success');
      //   return;
      // }
      
      toast.info('Đang kiểm tra trạng thái thanh toán...');
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái:', error);
      toast.error('Không thể kiểm tra trạng thái thanh toán');
    }
  };

  const handleRetryPayment = async () => {
    try {
      // Kiểm tra xem có orderId không
      if (!orderId) {
        toast.error('Không tìm thấy thông tin đơn hàng');
        return;
      }

      // Hiển thị loading
      toast.info('Đang tạo thanh toán mới...');

      // Gọi API để tạo lại payment URL
      const response = await retryVNPayPayment(orderId, orderInfo?.total_amount || 0);

      if (response.data.success && response.data.url) {
        // Mở VNPAY trong tab mới
        window.open(response.data.url, '_blank');
        toast.success('Đã mở trang thanh toán mới. Vui lòng hoàn tất thanh toán.');
      } else {
        toast.error('Không thể tạo thanh toán mới');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán mới:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo thanh toán mới');
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (!orderId) {
        toast.error('Không tìm thấy thông tin đơn hàng. Chuyển về trang đơn hàng.');
        setTimeout(() => {
          navigate('/profile/orders');
        }, 2000);
        return;
      }

      // Hiển thị confirm dialog
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.');
      
      if (!isConfirmed) {
        return;
      }

      // Hiển thị loading
      toast.info('Đang hủy đơn hàng...');

      // Gọi API hủy đơn hàng
      const response = await cancelOrder(orderId);

      if (response.success) {
        toast.success('Đã hủy đơn hàng thành công!');
        
        // Cập nhật trạng thái đơn hàng
        setOrderInfo(prev => ({
          ...prev,
          order_status: 'cancelled'
        }));

        // Chuyển về trang orders sau 2 giây
        setTimeout(() => {
          navigate('/profile/orders');
        }, 2000);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền hủy đơn hàng này');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Đơn hàng không thể hủy');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy đơn hàng. Chuyển về trang đơn hàng.');
        setTimeout(() => {
          navigate('/profile/orders');
        }, 2000);
      } else {
        toast.error('Có lỗi xảy ra khi hủy đơn hàng');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-2">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col gap-6">
          {/* Cột trái: Countdown + Order Info + Actions */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chờ thanh toán</h1>
              <p className="text-gray-600 text-sm sm:text-base">Vui lòng hoàn tất thanh toán trong thời gian quy định</p>
            </div>

            {/* Callback Message */}
            {isVnpayCallback && callbackMessage && (
              <div className={`rounded-xl p-4 sm:p-6 border ${
                callbackMessage.includes('thành công') 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : isPaymentFailed || callbackMessage.includes('thất bại') || callbackMessage.includes('lỗi') || callbackMessage.includes('Thanh toán thất bại') || callbackMessage.includes('Giao dịch không thành công')
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {callbackMessage.includes('thành công') ? (
                    <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${
                      isPaymentFailed || callbackMessage.includes('thất bại') || callbackMessage.includes('lỗi') || callbackMessage.includes('Thanh toán thất bại') || callbackMessage.includes('Giao dịch không thành công')
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`} />
                  )}
                  <span className="font-medium">Thông báo từ VNPAY</span>
                </div>
                <p className="text-sm">{callbackMessage}</p>
              </div>
            )}

            {/* Countdown Timer */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Thời gian còn lại</span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 tracking-widest mb-1">{formatTime(timeLeft)}</div>
              <p className="text-xs sm:text-sm text-red-500 text-center">Sau khi hết thời gian, đơn hàng sẽ tự động hủy</p>
            </div>

            {/* Order Info */}
            {orderInfo && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col gap-3 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5" />
                  Thông tin đơn hàng
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium break-all text-right">{orderInfo.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="font-bold text-green-600">{orderInfo.total_amount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`font-medium ${
                      orderInfo.order_status === 'pending' ? 'text-yellow-600' :
                      orderInfo.order_status === 'paid' ? 'text-green-600' :
                      orderInfo.order_status === 'cancelled' ? 'text-red-600' :
                      orderInfo.order_status === 'failed' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {orderInfo.order_status === 'pending' ? 'Chờ thanh toán' :
                       orderInfo.order_status === 'paid' ? 'Đã thanh toán' :
                       orderInfo.order_status === 'cancelled' ? 'Đã hủy' :
                       orderInfo.order_status === 'failed' ? 'Thanh toán thất bại' :
                       orderInfo.order_status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">
                      {orderInfo.payment_method === 'vnpay' ? 'VNPAY' :
                       orderInfo.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' :
                       orderInfo.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thời gian tạo:</span>
                    <span className="font-medium text-right">{orderInfo.created_at}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hạn thanh toán:</span>
                    <span className="font-medium text-red-600 text-right">{orderInfo.payment_deadline.toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {orderInfo?.order_status === 'cancelled' || orderInfo?.order_status === 'failed' ? (
                <>
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    Thử lại thanh toán
                  </button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Đổi phương thức thanh toán
                  </button>
                </>
              ) : orderInfo?.order_status === 'pending' ? (
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Hủy đơn hàng
                </button>
              ) : null}
            </div>
          </div>
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5" />
              Hướng dẫn thanh toán
            </h3>
            <div className="flex flex-col gap-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                <p>Tab thanh toán VNPAY đã được mở. Vui lòng chuyển sang tab đó để hoàn tất thanh toán.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                <p>Sau khi thanh toán thành công, bạn sẽ được chuyển về trang này và thấy thông báo thành công.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                <p>Nếu thanh toán thất bại, bạn có thể thử lại hoặc đổi phương thức thanh toán.</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                {orderInfo?.order_status === 'cancelled' || orderInfo?.order_status === 'failed' ? (
                  <>
                    <p>• Đơn hàng đã bị hủy/thất bại do thanh toán không thành công hoặc hết thời gian</p>
                    <p>• Bạn có thể thử lại thanh toán bằng nút "Thử lại thanh toán"</p>
                    <p>• Hoặc tạo đơn hàng mới từ giỏ hàng</p>
                  </>
                ) : (
                  <>
                    <p>• Không đóng tab thanh toán VNPAY cho đến khi hoàn tất</p>
                    <p>• Nếu hết thời gian, đơn hàng sẽ tự động hủy</p>
                    <p>• Bạn có thể thử lại bằng cách tạo đơn hàng mới</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWaiting; 