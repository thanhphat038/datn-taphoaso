import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MapPin, CreditCard, Tag, Truck, StickyNote, ShoppingCart, ChevronRight } from 'lucide-react';
import './Checkout.css';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';
import { CartContext } from '../../context/CartContext';
import { getAllAddress } from '../../service/Address.service';
import { getVoucherByCode } from '../../service/Voucher.service';
import { createOrder, createVNPayPayment } from '../../service/Checkout.service';

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
            // Chuyển hướng đến trang processing payment
            navigate('/checkout/payment/processing', { 
              state: { 
                paymentUrl: paymentResponse.url,
                orderData: paymentData // Truyền paymentData có _id thay vì orderData
              } 
            });
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
  const shippingFee = 15000;
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
            <ShoppingCart className="w-8 h-8 text-yellow-600" />
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 min-w-0 flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* Địa chỉ giao hàng */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">Địa chỉ giao hàng</span>
              </div>
              <button
                className="text-xs text-blue-500 flex items-center gap-1 hover:underline"
                onClick={() => navigate('/select-address')}
              >
                Thay đổi <FaEdit className="ml-1" />
              </button>
            </div>
            <div className="mb-6">
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
            {/* Thông tin đơn hàng */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-900">Sản phẩm</span>
              </div>
              {productsToDisplay.map((item, idx) => (
                <div key={item.id || item._id || `${item.name}-${idx}`} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <img src={item.image || item.product_id.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.name || item.product_id.name}</div>
                    <div className="text-xs text-gray-500">Số lượng: {item.quantity || item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {((item.price || item.product_id.price) * (item.quantity || item.qty)).toLocaleString()} đ
                    </div>
                    <div className="text-xs text-gray-400">
                      ({(item.price || item.product_id.price).toLocaleString()} đ/Hộp)
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Phương thức thanh toán */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-gray-900">Phương thức thanh toán</span>
              </div>
              <div className="flex items-center bg-purple-50 rounded-lg p-3 justify-between">
                <span className="text-purple-700 font-medium">
                  {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPAY'}
                </span>
                <button
                  className="text-xs text-blue-500 flex items-center gap-1 hover:underline"
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Thay đổi <FaEdit className="ml-1" />
                </button>
              </div>
            </div>
            {/* Mã giảm giá */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-gray-900">Mã giảm giá</span>
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mã giảm giá"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  onClick={handleApplyVoucher}
                >
                  Áp dụng
                </button>
              </div>
              {voucherMessage && (
                <div className={`text-sm mt-2 ${voucher ? 'text-green-600' : 'text-red-600'}`}>
                  {voucherMessage}
                </div>
              )}
              {voucher && (
                <div className="text-xs text-green-600 mt-1">
                  {voucher.discount_type === 'percentage'
                    ? `Giảm ${voucher.discount_value}% tối đa ${voucher.max_discount.toLocaleString()}đ`
                    : `Giảm ${voucher.discount_value.toLocaleString()}đ`}
                </div>
              )}
            </div>
            {/* Ghi chú cho đơn hàng */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-900">Ghi chú cho đơn hàng</span>
              </div>
              <textarea
                className="w-full min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                placeholder="Nhập ghi chú (ví dụ: Giao buổi sáng, gọi trước khi giao...)"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Summary Sidebar */}
        <div className="lg:col-span-1 min-w-[320px] max-w-sm w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4 w-full">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-gray-900">Tổng kết đơn hàng</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium text-gray-900">
                  {total.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium text-gray-900">{shippingFee.toLocaleString()}đ</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="font-medium text-green-600">-{voucherDiscount.toLocaleString()}đ</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Thành tiền:</span>
                <span className="text-2xl font-bold text-red-600">
                  {calculateTotal().toLocaleString()}đ
                </span>
              </div>
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
              onClick={handleOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {paymentMethod === 'vnpay' ? 'Đang xử lý...' : 'Đang đặt hàng...'}
                </div>
              ) : (
                <>
                  {paymentMethod === 'vnpay' ? 'Thanh toán ngay' : 'Đặt ngay'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
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
      </div>
    </div>
  );
};

export default Checkout;
