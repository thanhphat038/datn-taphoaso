import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './Checkout.css';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';
import { CartContext } from '../../context/CartContext';
import { getAllAddress } from '../../service/Address.service';
import { getVoucherByCode } from '../../service/Voucher.service';
import { createOrder } from '../../service/Checkout.service';

// Xử lý mã voucher

const Checkout = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const [userAddress, setUserAddress] = useState(null);
  const [voucher, setVoucher] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
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
  }, [location.state]);

  const productFromState = location.state?.product;

  const productsToDisplay = productFromState ? [productFromState] : cartItems;

  // Hàm xử lý khi nhấn nút "Áp dụng" mã voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      setVoucher(null);
      setVoucherDiscount(0);
      return;
    }

    try {
      const res = await getVoucherByCode(voucherCode);
      // Nếu API trả về { data: { ...voucher } }
      const voucherData = res.data; // tuỳ API trả về
      // Kiểm tra điều kiện giá trị đơn hàng tối thiểu
      if (subtotal < voucherData.min_order_value) {
        setVoucher(null);
        setVoucherDiscount(0);
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
setVoucherDiscount(0);
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
    };

    if (voucher && voucher._id) {
      orderData.voucher_id = voucher._id;
    }
    try {
      await createOrder(orderData);
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/payment-success');
    } catch (err) {
      setVoucherMessage('Đặt hàng thất bại, vui lòng thử lại!');
    }
  };

  // Tính tổng tiền tạm tính
  const shippingFee = 15000;
  const total = productsToDisplay.reduce((total, item) => total + (item.price || item.product_id.price) * (item.quantity || item.qty), 0);
  const subtotal = productsToDisplay.reduce((total, item) => total + (item.price || item.product_id.price) * (item.quantity || item.qty), 0) + shippingFee;

  const calculateVoucherDiscount = () => {
    if (!voucher) return 0;
    if (voucher.discount_type === 'percentage') {
      const discount = (subtotal * voucher.discount_value) / 100;
      return Math.min(discount, voucher.max_discount);
    }
    if (voucher.discount_type === 'amount') {
      return voucher.discount_value;
    }
    return 0;
  };


  const calculateTotal = () => {
    return subtotal - calculateVoucherDiscount();
  };



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
                    <div className="checkout-price">{(item.price * item.quantity || item.product_id.price * item.qty).toLocaleString()} đ</div>
                    <div className="text-xs text-gray-400">({item.price.toLocaleString() || item.product_id.price.toLocaleString()} đ/Hộp)</div>
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
                className={`text-sm mt-2 ${voucherDiscount > 0 ? 'text-green-600' : 'text-red-600'
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
              15.000 đ
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#959595]">Giảm giá (voucher):</span>
            <span className="text-[13px] text-[#959595] font-medium">
              -{calculateVoucherDiscount().toLocaleString()} đ
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
          >
            <span>Đặt ngay</span>
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
      </div>
    </div>
  );
};

export default Checkout;
