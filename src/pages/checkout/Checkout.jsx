import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaMapMarkerAlt, FaCreditCard, FaTruck, FaStickyNote } from 'react-icons/fa';
import './Checkout.css';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';
import PaymentRedirectModal from '../../components/checkout/PaymentRedirectModal';
import VoucherSection from '../../components/VoucherSection';
import { CartContext } from '../../context/CartContext';
import { getAllAddress } from '../../service/Address.service';
import { createOrder, createVNPayPayment } from '../../service/Checkout.service.js';
import { calculateShippingFee } from '../../service/Shipping.service.js';
import { calculateSubtotal, calculateVoucherDiscount, calculateTotal } from '../../utils/price';
import { useVoucher } from '../../hooks/useVoucher';

const Checkout = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const [userAddress, setUserAddress] = useState(null);
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  // State cho payment redirect modal
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectData, setRedirectData] = useState({ paymentUrl: '', orderId: '' });
  
  const productFromState = location.state?.product;
  const productsToDisplay = productFromState ? [productFromState] : cartItems;

  // Sử dụng custom hook cho voucher và tính toán totals
  const subtotal = calculateSubtotal(productsToDisplay);
  const {
    voucherCode,
    voucherMessage,
    voucherDiscount,
    voucher,
    showVoucherDropdown,
    availableVouchers,
    loadingVouchers,
    setVoucherCode,
    setVoucherMessage,
    setVoucherDiscount,
    setVoucher,
    setShowVoucherDropdown,
    handleApplyVoucher,
    handleSelectVoucher,
    handleRemoveVoucher,
  } = useVoucher(subtotal);

  // Tính toán totals một lần
  const voucherDiscountAmount = calculateVoucherDiscount(voucher, subtotal);
  const finalTotal = calculateTotal(subtotal, shippingFee, voucherDiscountAmount);

  // Nhận voucher data từ CartPage
  const cartPageVoucher = location.state?.appliedVoucher;
  const cartPageVoucherDiscount = location.state?.voucherDiscount;
  const cartPageVoucherCode = location.state?.voucherCode;

  useEffect(() => {
    // Kiểm tra sản phẩm trong giỏ hàng trước khi cho phép thanh toán
    if (productsToDisplay.length === 0) {
      const buyNowProduct = localStorage.getItem('buyNowProduct');
      if (!buyNowProduct) {
        setVoucherMessage('Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
    }

    // Xử lý error message từ VNPayLoading
    if (location.state && location.state.error) {
      setVoucherMessage(location.state.error);
      navigate(location.pathname, { replace: true });
      return;
    }

    // Khởi tạo voucher state từ CartPage nếu có
    if (cartPageVoucher && cartPageVoucherCode) {
      setVoucher(cartPageVoucher);
      setVoucherCode(cartPageVoucherCode);
      setVoucherMessage(`Mã giảm giá ${cartPageVoucher.code} đã được áp dụng!`);
      setVoucherDiscount(cartPageVoucherDiscount || 0);
    }

    // Nếu có địa chỉ được chọn từ SelectAddress, ưu tiên hiển thị địa chỉ này
    if (location.state && location.state.selectedAddress) {
      setUserAddress(location.state.selectedAddress);
      calculateShippingFeeForAddress(location.state.selectedAddress);
      return;
    }

    // Lấy địa chỉ giao hàng của user
    const fetchAddress = async () => {
      try {
        const res = await getAllAddress();
        let addresses = res.data.data || [];
        let mainAddress = addresses.find(a => a.is_default) || addresses[0] || null;
        setUserAddress(mainAddress);
        
        if (mainAddress) {
          await calculateShippingFeeForAddress(mainAddress);
        }
      } catch (err) {
        setUserAddress(null);
      }
    };
    fetchAddress();
  }, [location.state, navigate, cartItems.length, productFromState, cartPageVoucher, cartPageVoucherCode, productsToDisplay]);

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
      total_amount: finalTotal, // Dùng finalTotal đã tính sẵn
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
          // Xử lý thanh toán VNPAY
          const paymentData = {
            ...orderData,
            _id: orderResponse.data._id
          };

          const paymentResponse = await createVNPayPayment(paymentData);
          console.log('VNPAY API Response:', paymentResponse);

          if (paymentResponse.success && paymentResponse.url) {
            setRedirectData({
              paymentUrl: paymentResponse.url,
              orderId: orderResponse.data._id
            });
            setShowRedirectModal(true);
          } else {
            setVoucherMessage('Không thể tạo thanh toán VNPAY, vui lòng thử lại!');
          }
        } else {
          // Xử lý thanh toán COD
          window.dispatchEvent(new Event('cart-updated'));
          navigate('/checkout/payment/success', { 
            state: { 
              paymentMethod: 'cod',
              orderId: orderResponse.data._id 
            } 
          });
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

  // Hàm tính phí vận chuyển
  const calculateShippingFeeForAddress = async (address) => {
    if (!address) return;
    
    setIsCalculatingShipping(true);
    try {
      const deliveryAddress = `${address.address_detail}, ${address.ward}, ${address.district}, ${address.city}`;
      const shippingResponse = await calculateShippingFee(deliveryAddress, 'default');
      
      if (shippingResponse.success && shippingResponse.shippingFee !== undefined) {
        setShippingFee(shippingResponse.shippingFee);
      } else {
        setShippingFee(0);
        console.log('Shipping API error, using default free shipping:', shippingResponse.message);
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      setShippingFee(0);
    } finally {
      setIsCalculatingShipping(false);
    }
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

            {/* VoucherSection component */}
            <VoucherSection
              voucherCode={voucherCode}
              voucherMessage={voucherMessage}
              voucherDiscount={voucherDiscount}
              voucher={voucher}
              showVoucherDropdown={showVoucherDropdown}
              availableVouchers={availableVouchers}
              loadingVouchers={loadingVouchers}
              onVoucherCodeChange={setVoucherCode}
              onApplyVoucher={handleApplyVoucher}
              onSelectVoucher={handleSelectVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              onToggleDropdown={setShowVoucherDropdown}
            />

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
                    {subtotal.toLocaleString()} đ
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    {userAddress && (
                      <button
                        onClick={() => calculateShippingFeeForAddress(userAddress)}
                        disabled={isCalculatingShipping}
                        className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                        title="Tính lại phí vận chuyển"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {isCalculatingShipping ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-gray-500 text-sm">Đang tính...</span>
                    </div>
                  ) : shippingFee === 0 ? (
                    <span className="font-medium text-green-600">Miễn phí</span>
                  ) : (
                    <span className="font-medium text-gray-800">{shippingFee.toLocaleString()} đ</span>
                  )}
                </div>

                {voucherDiscountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-green-600">- {voucherDiscountAmount.toLocaleString()} đ</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tổng cộng:</span>
                  <span className="font-medium text-gray-800">
                    {(subtotal + shippingFee).toLocaleString()} đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Thành tiền:</span>
                  <span className="text-2xl font-bold text-red-500">
                    {finalTotal.toLocaleString()} đ
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