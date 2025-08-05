import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaMapMarkerAlt, FaCreditCard, FaTruck, FaGift, FaStickyNote } from 'react-icons/fa';
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
      // Kiểm tra xem có phải mua ngay không
      const buyNowProduct = localStorage.getItem('buyNowProduct');
      if (!buyNowProduct) {
        setVoucherMessage('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
        // Redirect về trang chủ sau 2 giây
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
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
      <div className="min-h-screen bg-[#F5FBFB] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
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
    <div className="min-h-screen bg-[#F5FBFB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Địa chỉ giao hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Địa chỉ giao hàng</h2>
                </div>
                <button
                  onClick={() => navigate('/select-address')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Thay đổi</span>
                </button>
              </div>

              {userAddress ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-800 mb-2">
                    {userAddress.receiver} • {userAddress.phone}
                  </div>
                  <div className="text-gray-600">
                    {userAddress.address_detail}, {userAddress.ward}, {userAddress.district}, {userAddress.city}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <div className="text-yellow-600 font-medium">Chưa có địa chỉ giao hàng</div>
                  <button
                    onClick={() => navigate('/select-address')}
                    className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Thêm địa chỉ ngay
                  </button>
                </div>
              )}
            </div>

            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaTruck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Thông tin đơn hàng</h2>
              </div>

              {productsToDisplay.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không có sản phẩm trong giỏ hàng.</div>
              ) : (
                <div className="space-y-4">
                  {productsToDisplay.map((item, idx) => (
                    <div key={item.id || item._id || `${item.name}-${idx}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={item.image || item.product_id.images[0]}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name || item.product_id.name}</div>
                        <div className="text-sm text-gray-500">Số lượng: {item.quantity || item.qty}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {((item.price || item.product_id.price) * (item.quantity || item.qty)).toLocaleString()} đ
                        </div>
                        <div className="text-xs text-gray-400">
                          {(item.price || item.product_id.price).toLocaleString()} đ/Hộp
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Phương thức thanh toán</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaCreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">
                      {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPAY'}
                    </div>
                    <div className="text-sm text-blue-600">
                      {paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng' : 'Thanh toán trực tuyến an toàn'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenPaymentModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Thay đổi
                </button>
              </div>
            </div>

            {/* Mã giảm giá */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <FaGift className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Mã giảm giá</h2>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập mã giảm giá..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                  />
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleApplyVoucher}
                    disabled={!voucherCode.trim()}
                  >
                    Áp dụng
                  </button>
                </div>

                {voucherMessage && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${voucher ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {voucher ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {voucherMessage}
                  </div>
                )}

                {voucher && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-800">Mã {voucher.code} đã áp dụng!</div>
                        <div className="text-sm text-green-600">
                          {voucher.discount_type === 'percentage'
                            ? `Giảm ${voucher.discount_value}% tối đa ${voucher.max_discount?.toLocaleString()}đ`
                            : `Giảm ${voucher.discount_value?.toLocaleString()}đ`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setVoucher(null);
                          setVoucherCode('');
                          setVoucherMessage('');
                        }}
                        className="text-green-600 hover:text-green-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ghi chú */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FaStickyNote className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Ghi chú đơn hàng</h2>
              </div>

              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Nhập ghi chú (ví dụ: Giao buổi sáng, gọi trước khi giao...)"
                value={note}
                onChange={e => setNote(e.target.value)}
                rows="3"
              />
            </div>
          </div>

          {/* Sidebar - Tổng tiền */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-800">
                    {total.toLocaleString()} đ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>

                {voucherDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-green-600">- {voucherDiscount.toLocaleString()} đ</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Thành tiền:</span>
                  <span className="text-2xl font-bold text-red-500">
                    {calculateTotal().toLocaleString()} đ
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleOrder}
                disabled={isProcessing || !userAddress}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {paymentMethod === 'vnpay' ? 'Đang xử lý...' : 'Đang đặt hàng...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaCreditCard className="w-5 h-5" />
                    {paymentMethod === 'vnpay' ? 'Thanh toán ngay' : 'Đặt hàng ngay'}
                  </div>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Bằng việc tiếp tục, bạn đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản sử dụng</span> và <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span>
                </p>
              </div>
            </div>
          </div>
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