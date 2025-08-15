import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cancelOrder, updateOrderStatus, getOrderInfo, retryVNPayPayment } from '../service/Checkout.service.js';

export const usePaymentWaiting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('vnp_OrderInfo') || searchParams.get('orderId');
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVnpayCallback, setIsVnpayCallback] = useState(false);
  const [callbackMessage, setCallbackMessage] = useState('');
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);

  // Xử lý VNPAY callback
  useEffect(() => {
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');
    const vnpTransactionStatus = searchParams.get('vnp_TransactionStatus');
    
    if (vnpResponseCode || vnpTransactionStatus) {
      setIsVnpayCallback(true);
      
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
      
      // Lưu vào localStorage để debug (chỉ trong development)
      if (process.env.NODE_ENV === 'development') {
        const existingLogs = JSON.parse(localStorage.getItem('vnpay_callback_logs') || '[]');
        existingLogs.push(callbackData);
        if (existingLogs.length > 10) {
          existingLogs.splice(0, existingLogs.length - 10);
        }
        localStorage.setItem('vnpay_callback_logs', JSON.stringify(existingLogs));
      }
      
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
        
        const updateOrderStatusToPaid = async () => {
          try {
            await updateOrderStatus(orderId, 'paid');
            setTimeout(() => {
              navigate('/checkout/payment/success', {
                state: {
                  paymentMethod: orderInfo?.payment_method || 'vnpay',
                  orderId: orderId
                }
              });
            }, 2000);
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            toast.error('Có lỗi khi cập nhật trạng thái đơn hàng');
            setTimeout(() => {
              navigate('/checkout/payment/success', {
                state: {
                  paymentMethod: orderInfo?.payment_method || 'vnpay',
                  orderId: orderId
                }
              });
            }, 3000);
          }
        };
        updateOrderStatusToPaid();
      } else {
        const errorMessage = getVnpayErrorMessage(vnpResponseCode);
        setCallbackMessage(`Thanh toán thất bại: ${errorMessage}`);
        setIsPaymentFailed(true);
        toast.error(`Thanh toán thất bại: ${errorMessage}`);
        
        const updateOrderStatusToFailed = async () => {
          try {
            await updateOrderStatus(orderId, 'failed');
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
          }
        };
        updateOrderStatusToFailed();
      }
    }
  }, [searchParams, navigate, orderId]);

  // Fetch order info
  useEffect(() => {
    if (!orderId) {
      toast.error('Không tìm thấy thông tin đơn hàng. Chuyển về trang đơn hàng.');
      setTimeout(() => {
        navigate('/profile/orders');
      }, 2000);
      return;
    }

    const fetchOrderInfo = async () => {
      try {
        const response = await getOrderInfo(orderId);

        if (response.success) {
          const orderData = response.data;
          
          if (!orderData || !orderData.id) {
            toast.error('Không tìm thấy đơn hàng. Chuyển về trang đơn hàng.');
            setTimeout(() => {
              navigate('/profile/orders');
            }, 2000);
            return;
          }

          if (orderData.order_status === 'paid') {
            toast.success('Thanh toán thành công!');
            navigate('/checkout/payment/success', {
              state: {
                paymentMethod: orderData.payment_method || 'vnpay',
                orderId: orderId
              }
            });
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
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        
        if (error.response?.status === 404) {
          toast.error('Không tìm thấy đơn hàng. Chuyển về trang đơn hàng.');
          setTimeout(() => {
            navigate('/profile/orders');
          }, 2000);
        } else if (error.response?.status === 401) {
          toast.error('Token không hợp lệ. Chuyển về trang đăng nhập.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.error('Không thể lấy thông tin đơn hàng. Chuyển về trang đơn hàng.');
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

  // Tính toán timeLeft
  useEffect(() => {
    if (orderInfo && orderInfo.payment_deadline) {
      const now = new Date();
      const deadline = new Date(orderInfo.payment_deadline);
      const remainingTime = Math.max(0, Math.floor((deadline - now) / 1000));

      setTimeLeft(remainingTime);
    }
  }, [orderInfo]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error('Thanh toán thất bại! Hết thời gian thanh toán.');
      
      if (orderInfo && orderInfo.order_status !== 'failed') {
        const updateOrderStatusToFailed = async () => {
          try {
            await updateOrderStatus(orderId, 'failed');
          } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
          }
        };
        updateOrderStatusToFailed();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, orderInfo, orderId]);

  // Handlers
  const handleRetryPayment = async () => {
    try {
      if (!orderInfo) {
        toast.error('Không tìm thấy thông tin đơn hàng');
        return;
      }

      toast.info('Đang tạo thanh toán mới...');

      const orderData = {
        id: orderInfo._id || orderInfo.id, // Thêm ID của đơn hàng
        total_amount: orderInfo.total_amount,
        payment_method: 'vnpay',
        address: orderInfo.address || '',
        receiver: orderInfo.receiver || '',
        sdt: orderInfo.sdt || '',
        note: orderInfo.note || ''
      };

      const response = await retryVNPayPayment(orderData);

      // Sửa: kiểm tra response.success thay vì response?.data?.success
      if (response?.success && response.url) {
        toast.success('Đang chuyển đến trang thanh toán...');
        console.log('Redirecting to VNPAY URL:', response.url);
        window.location.href = response.url;
      } else {
        console.log('Response không có success hoặc url:', response);
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

      if (orderInfo?.order_status === 'paid') {
        toast.error('Không thể hủy đơn hàng đã thanh toán thành công');
        return;
      }

      if (orderInfo?.order_status === 'cancelled') {
        toast.error('Đơn hàng đã được hủy trước đó');
        return;
      }

      const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.');
      
      if (!isConfirmed) return;

      toast.info('Đang hủy đơn hàng...');

      const response = await cancelOrder(orderId);

      if (response.success) {
        toast.success('Đã hủy đơn hàng thành công!');
        setOrderInfo(prev => ({
          ...prev,
          order_status: 'cancelled'
        }));
        setTimeout(() => {
          navigate('/profile/orders');
        }, 2000);
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      
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

  const handleChangePaymentMethod = () => {
    navigate('/checkout');
  };

  return {
    orderId,
    timeLeft,
    orderInfo,
    loading,
    isVnpayCallback,
    callbackMessage,
    isPaymentFailed,
    handleRetryPayment,
    handleCancelOrder,
    handleChangePaymentMethod
  };
}; 