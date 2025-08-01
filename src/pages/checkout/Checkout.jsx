import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './Checkout.css';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';
import PaymentRedirectModal from '../../components/checkout/PaymentRedirectModal';
import { CartContext } from '../../context/CartContext';
import { getAllAddress } from '../../service/Address.service';
import { getVoucherByCode } from '../../service/Voucher.service';
import { createOrder, createVNPayPayment } from '../../service/Checkout.service.js';

// Xử lý mã voucher

const Checkout = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const [userAddress, setUserAddress] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State cho payment redirect modal
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectData, setRedirectData] = useState({ paymentUrl: '', orderId: '' });
  


  const productFromState = location.state?.product;
  const productsToDisplay = productFromState ? [productFromState] : cartItems;

  useEffect(() => {
    // Kiểm tra sản phẩm trong giỏ hàng trước khi cho phép thanh toán
    if (productsToDisplay.length === 0) {
      setVoucherMessage('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
      // Redirect về trang chủ sau 2 giây
      setTimeout(() => {
        navigate('/');
      }, 2000);
      return;
    }

    // Xử lý error message từ VNPayLoading
    if (location.state && location.state.error) {
      setVoucherMessage(location.state.error);
      // Clear error state
      navigate(location.pathname, { replace: true });
      return;
    }

    // Nếu có địa chỉ được chọn từ SelectAddress, ưu tiên hiển thị địa chỉ này
    if (location.state && location.state.selectedAddress) {
      setUserAddress(location.state.selectedAddress);
      return;
    }
    // Lấy địa chỉ giao hàng của user
    const fetchAddress = async () => {
      try {
        const res = await getAllAddress();
        let addresses = res.data.data || [];
        // Ưu tiên địa chỉ mặc định, nếu không có lấy địa chỉ đầu tiên
        let mainAddress = addresses.find(a => a.is_default) || addresses[0] || null;
        setUserAddress(mainAddress);
      } catch (err) {
        setUserAddress(null);
      }
    };
    fetchAddress();
  }, [location.state, navigate, cartItems.length, productFromState]);

  // Hàm xử lý khi nhấn nút "Áp dụng" mã voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      setVoucher(null);
      return;
    }

    try {
      const res = await getVoucherByCode(voucherCode);
      // Nếu API trả về { data: { ...voucher } }
      const voucherData = res.data; // tuỳ API trả về
      // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
      if (total < voucherData.min_order_value) {
        setVoucher(null);
        setVoucherMessage(
          `Đơn hàng tối thiểu ${voucherData.min_order_value.toLocaleString()}đ mới được áp dụng mã này.`
        );
        return;
      }
      setVoucher(voucherData);
      setVoucherMessage(
        `Mã giảm giá ${voucherData.code} được áp dụng thành công!`
      );
    } catch (error) {
      setVoucher(null);
      setVoucherMessage(
        error.response?.data?.message ||
        'Mã giảm giá không hợp lệ hoặc đã hết hạn.'
      );
    }
  };

    // Hàm xử lý đặt hàng
  const handleOrder = async () => {
    if (!userAddress) {
      setVoucherMessage('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }
    
    if (!paymentMethod) {
      setVoucherMessage('Vui lòng chọn phương thức thanh toán!');
      return;
    }
    
    if (productsToDisplay.length === 0) {
      setVoucherMessage('Giỏ hàng trống, vui lòng thêm sản phẩm!');
      return;
    }

    setIsProcessing(true);
    setVoucherMessage('');

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      address: `${userAddress.address_detail}, ${userAddress.ward}, ${userAddress.district}, ${userAddress.city}`,
      receiver: userAddress.receiver,
      sdt: userAddress.phone,
      items: productsToDisplay.map(item => ({
        product_id: item.id || item.product_id._id,
        qty: item.quantity || item.qty
      })),
      payment_method: paymentMethod,
      note: note,
      total_amount: calculateTotal(), // Thêm tổng tiền cho VNPAY
    };

    if (voucher && voucher.code) {
      orderData.voucher_code = voucher.code;
    }

    try {
      // Tạo đơn hàng trước (cho cả COD và VNPAY)
      try {
        const orderResponse = await createOrder(orderData);
        console.log('Order created:', orderResponse);
        console.log('Order ID from response:', orderResponse.data._id);
        
        if (paymentMethod === 'vnpay') {
          // Xử lý thanh toán VNPAY - truyền orderId từ orderResponse
          const paymentData = {
            ...orderData,
            _id: orderResponse.data._id // Thêm orderId từ response
          };
          
          console.log('Payment data with orderId:', paymentData);
          console.log('Payment data _id:', paymentData._id);
          
          const paymentResponse = await createVNPayPayment(paymentData);
          console.log('VNPAY API Response:', paymentResponse);
          console.log('Payment URL:', paymentResponse.url);
          
          if (paymentResponse.success && paymentResponse.url) {
            // Hiển thị modal chuyển hướng
            setRedirectData({
              paymentUrl: paymentResponse.url,
              orderId: orderResponse.data._id
            });
            setShowRedirectModal(true);
          } else {
            setVoucherMessage('Không thể tạo thanh toán VNPAY, vui lòng thử lại!');
          }
        } else {
          // Xử lý thanh toán COD - đơn hàng đã được tạo ở trên
          window.dispatchEvent(new Event('cart-updated'));
          navigate('/checkout/payment/success');
        }
      } catch (orderError) {
        console.error('Create order error:', orderError);
        setVoucherMessage(
          orderError.response?.data?.message || 
          'Không thể tạo đơn hàng, vui lòng thử lại!'
        );
      }
    } catch (err) {
      console.error('Payment error:', err);
      setVoucherMessage(
        err.response?.data?.message || 
        'Đặt hàng thất bại, vui lòng thử lại!'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Tính tổng tiền tạm tính
  const shippingFee = 0;
  const total = productsToDisplay.reduce((total, item) => total + (item.price || item.product_id.price) * (item.quantity || item.qty), 0);
  const subtotal = total + shippingFee;

  const calculateVoucherDiscount = () => {
    if (!voucher) return 0;
    if (voucher.discount_type === 'percentage') {
      const discount = (total * voucher.discount_value) / 100; // Sử dụng total thay vì subtotal
      return Math.min(discount, voucher.max_discount || discount);
    }
    if (voucher.discount_type === 'amount') {
      return Math.min(voucher.discount_value, total); // Không giảm quá tổng tiền hàng
    }
    return 0;
  };

  const voucherDiscount = calculateVoucherDiscount();

  const calculateTotal = () => {
    return subtotal - voucherDiscount;
  };


  // Hiển thị thông báo giỏ hàng trống
  if (productsToDisplay.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Vui lòng thêm sản phẩm trước khi thanh toán.
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

  return (
    <div className="checkout-grid-container grid grid-cols-12 w-full">
      <div className="checkout-main col-span-8 col-start-3 flex flex-col relative">
        {/* Địa chỉ + thanh toán */}
        <div className="checkout-main-box px-4 md:px-6 lg:px-8">
          <h2 className="checkout-title text-center">Thanh toán</h2>
          <div className="checkout-section checkout-address-section">
            <div className="flex justify-between items-center mb-2">
              <span className="checkout-label">Địa chỉ</span>
              <button
                className="checkout-btn-edit flex items-center text-xs"
                onClick={() => navigate('/select-address')}
              >
                <span>Thay đổi</span>
                <FaEdit className="ml-1" />
              </button>
            </div>
            <div className="checkout-address">
              {userAddress ? (
                <>
                  <div className="font-semibold">
                    Giao đến: {userAddress.receiver} {userAddress.phone}
                  </div>
                  <div className="text-sm text-gray-500">
                    {userAddress.address_detail}, {userAddress.ward}, {userAddress.district}, {userAddress.city}
                  </div>
                </>
              ) : (
                <div className="text-gray-400">Chưa có địa chỉ giao hàng</div>
              )}
            </div>
          </div>
          {/* Thông tin đơn hàng */}
          <div className="checkout-section">
            <div className="checkout-label mb-2">Thông tin đơn hàng</div>
            {productsToDisplay.length === 0 ? (
              <div>Không có sản phẩm trong giỏ hàng.</div>
            ) : (
              productsToDisplay.map((item, idx) => (
                <div key={item.id || item._id || `${item.name}-${idx}`} className="checkout-product flex items-center mb-2">
                  <img src={item.image || item.product_id.images[0]} alt={item.name} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name || item.product_id.name}</div>
                    <div className="text-xs text-gray-500">Số lượng: {item.quantity || item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="checkout-price">
                      {((item.price || item.product_id.price) * (item.quantity || item.qty)).toLocaleString()} đ
                    </div>
                    <div className="text-xs text-gray-400">
                      ({(item.price || item.product_id.price).toLocaleString()} đ/Hộp)
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Phương thức thanh toán */}
          <div className="checkout-section">
            <div className="checkout-label mb-2">Phương thức thanh toán (tiền mặt, thẻ, chuyển khoản, ví...)</div>
            <div className="checkout-payment-method flex items-center bg-green-50 rounded-lg p-3 justify-between">
              <span className="text-green-700 font-medium">
                {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPAY'}
              </span>
              <button
                className="checkout-btn-edit text-xs text-blue-500"
                onClick={() => setOpenPaymentModal(true)}
              >
                Thay đổi <FaEdit className="ml-1" />
              </button>
            </div>
          </div>
          {/* Mã giảm giá */}
          <div className="checkout-section">
            <div className="checkout-label mb-2">Mã giảm giá</div>
            <div className="flex">
              <input
                className="checkout-input flex-1"
                placeholder="Nhập mã giảm giá (chỉ áp dụng 1 lần)"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
              <button className="checkout-btn-apply ml-2" onClick={handleApplyVoucher}>
                Áp dụng
              </button>
            </div>
            {voucherMessage && (
              <div
                className={`text-sm mt-2 ${voucher ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {voucherMessage}
              </div>
            )}
            {voucher && (
              <div className="text-xs text-green-600">
                {voucher.discount_type === 'percentage'
                  ? `Giảm ${voucher.discount_value}% tối đa ${voucher.max_discount.toLocaleString()}đ`
                  : `Giảm ${voucher.discount_value.toLocaleString()}đ`}
              </div>
            )}
          </div>
          {/* Ghi chú cho đơn hàng */}
          <div className="checkout-section">
            <div className="checkout-label mb-2">Ghi chú cho đơn hàng</div>
            <textarea
              className="checkout-input w-full min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              placeholder="Nhập ghi chú (ví dụ: Giao buổi sáng, gọi trước khi giao...)"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
          {/* Content rỗng cuối box */}
          <div style={{ height: '300px' }} />
        </div>
        {/* Tổng tiền và đặt hàng sticky bottom */}
        <div className="checkout-total-box-sticky">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#959595]">Tổng tiền:</span>
            <span className="checkout-shipping-fee text-[13px] text-[#959595] font-medium">
              {total.toLocaleString()} đ
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#959595]">Phí vận chuyển:</span>
            <span className="checkout-shipping-fee text-[13px] text-[#959595] font-medium">
            {shippingFee.toLocaleString()} đ
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#959595]">Giảm giá (voucher):</span>
            <span className="text-[13px] text-[#959595] font-medium">
              -{voucherDiscount.toLocaleString()} đ
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Thành tiền:</span>
            <span className="checkout-total font-bold text-lg">
              {calculateTotal().toLocaleString()} đ
            </span>
          </div>
          <button
            className="checkout-btn-order gradient-slide-effect w-full"
            onClick={handleOrder}
            disabled={isProcessing}
          >
            <span>
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {paymentMethod === 'vnpay' ? 'Đang xử lý...' : 'Đang đặt hàng...'}
                </div>
              ) : (
                paymentMethod === 'vnpay' ? 'Thanh toán ngay' : 'Đặt ngay'
              )}
            </span>
          </button>
        </div>
        <PaymentMethodModal
          open={openPaymentModal}
          onClose={() => setOpenPaymentModal(false)}
          selected={paymentMethod}
          onSelect={(key) => {
            setPaymentMethod(key);
            setOpenPaymentModal(false);
          }}
        />
        
        {/* Payment Redirect Modal */}
        <PaymentRedirectModal
          isOpen={showRedirectModal}
          onClose={() => setShowRedirectModal(false)}
          paymentUrl={redirectData.paymentUrl}
          orderId={redirectData.orderId}
        />
      </div>
    </div>
  );
};

export default Checkout;
