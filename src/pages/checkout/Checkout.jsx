import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './Checkout.css';
import PaymentMethodModal from '../../components/checkout/PaymentMethodModal';
import { CartContext } from '../../context/CartContext';

// Xử lý mã voucher
const applyVoucher = async (voucherCode) => {
  // Giả lập dữ liệu voucher
  const voucherData = {
    FREESHIP: {
      code: 'FREESHIP',
      discount: 15000, 
      message: 'Mã giảm giá FREESHIP được áp dụng thành công! Giảm 15,000 VNĐ.',
    },
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (voucherData[voucherCode]) {
        resolve(voucherData[voucherCode]);
      } else {
        reject(new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn.'));
      }
    }, 1000);
  });
};

const Checkout = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [voucherCode, setVoucherCode] = useState(''); 
  const [voucherDiscount, setVoucherDiscount] = useState(0); 
  const [voucherMessage, setVoucherMessage] = useState(''); 
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useContext(CartContext);

  const productFromState = location.state?.product;

  const productsToDisplay = productFromState ? [productFromState] : cartItems;

  // Hàm xử lý khi nhấn nút "Áp dụng" mã voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      setVoucherMessage('Vui lòng nhập mã giảm giá.');
      return;
    }

    try {
      const result = await applyVoucher(voucherCode.toUpperCase());
      setVoucherDiscount(result.discount);
      setVoucherMessage(result.message);
    } catch (error) {
      setVoucherDiscount(0);
      setVoucherMessage(error.message);
    }
  };

  // Hàm xử lý đặt hàng
  const handleOrder = () => {
    navigate('/payment-success');
  };

  // Tính tổng tiền tạm tính
  const calculateTotal = () => {
    const subtotal = productsToDisplay.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = 15000;
    return subtotal + shippingFee - voucherDiscount;
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
              <div className="font-semibold">Giao đến: Khắc Trí 0909749XXX</div>
              <div className="text-sm text-gray-500">
                XXX Nguyễn Văn Thủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh
              </div>
            </div>
          </div>
          {/* Thông tin đơn hàng */}
          <div className="checkout-section">
            <div className="checkout-label mb-2">Thông tin đơn hàng</div>
            {productsToDisplay.length === 0 ? (
              <div>Không có sản phẩm trong giỏ hàng.</div>
            ) : (
              productsToDisplay.map((item) => (
                <div key={item.id} className="checkout-product flex items-center mb-2">
                  <img src={item.image || '/img/pd_img.png'} alt={item.name} />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">Số lượng: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="checkout-price">{(item.price * item.quantity).toLocaleString()} đ</div>
                    <div className="text-xs text-gray-400">({item.price.toLocaleString()} đ/Hộp)</div>
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
                className={`text-sm mt-2 ${
                  voucherDiscount > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {voucherMessage}
              </div>
            )}
          </div>
          {/* Content rỗng cuối box */}
          <div style={{ height: '300px' }} />
        </div>
        {/* Tổng tiền và đặt hàng sticky bottom */}
        <div className="checkout-total-box-sticky">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-[#959595]">Phí vận chuyển:</span>
            <span className="checkout-shipping-fee text-[13px] text-[#959595] font-medium">
              15.000 đ
            </span>
          </div>
          {voucherDiscount > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] text-[#959595]">Giảm giá (voucher):</span>
              <span className="text-[13px] text-green-600 font-medium">
                -{voucherDiscount.toLocaleString()} đ
              </span>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-lg">Tổng tiền tạm tính:</span>
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