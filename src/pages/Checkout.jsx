import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import './Checkout.css';
import PaymentMethodModal from '../components/checkout/PaymentMethodModal';

const Checkout = () => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const navigate = useNavigate();

  const handleOrder = () => {
    navigate('/payment-success');
  };

  return (
    <div className="checkout-bg min-h-screen flex flex-col items-center">
      <div className="checkout-grid-container grid grid-cols-12 w-full max-w-5xl mx-auto">
        <div className="col-span-12 md:col-span-8 md:col-start-3 flex flex-col relative">
          {/* Địa chỉ + thanh toán */}
          <div className="checkout-main-box">
            <h2 className="checkout-title text-center">Thanh toán</h2>
            <div className="checkout-section checkout-address-section">
              <div className="flex justify-between items-center mb-2">
                <span className="checkout-label">Địa chỉ</span>
                <button className="checkout-btn-edit flex items-center text-xs" onClick={() => navigate('/select-address')}><span>Thay đổi</span><FaEdit className="ml-1" /></button>
              </div>
              <div className="checkout-address">
                <div className="font-semibold">Giao đến: Khắc Trí 0909749XXX</div>
                <div className="text-sm text-gray-500">XXX Nguyễn Văn Thủ , Phường Đa kao, Quận 1, TP. Hồ Chí Minh</div>
              </div>
            </div>
            {/* Thông tin đơn hàng */}
            <div className="checkout-section">
              <div className="checkout-label mb-2">Thông tin đơn hàng</div>
              <div className="checkout-product flex items-center mb-2">
                <img src="/img/pd_img.png" alt="Sữa chua Nutimilk" />
                <div className="flex-1">
                  <div className="font-medium">Lốc 4 hộp sữa chua có đường Nutimilk 100g</div>
                  <div className="text-xs text-gray-500">Số lượng: 1</div>
                </div>
                <div className="text-right">
                  <div className="checkout-price">25.500 đ</div>
                  <div className="text-xs text-gray-400">(7.000 đ/Hộp)</div>
                </div>
              </div>
              <div className="checkout-product flex items-center">
                <img src="/img/thung-48-hop-sua-tuoi-tiet-trung-it-duong-vinamilk-100-sua-tuoi-180ml-202310071419459272 1.png" alt="Sữa tươi Vinamilk" />
                <div className="flex-1">
                  <div className="font-medium">Thùng 48 hộp sữa tươi tiệt trùng ít đường Vinamilk 100% Sữa tươi 180ml</div>
                  <div className="text-xs text-gray-500">Số lượng: 1</div>
                </div>
                <div className="text-right">
                  <div className="checkout-price">353.500 đ</div>
                  <div className="text-xs text-gray-400">(7.354 đ/Hộp)</div>
                </div>
              </div>
            </div>
            {/* Phương thức thanh toán */}
            <div className="checkout-section">
              <div className="checkout-label mb-2">Phương thức thanh toán( tiền mặt, thẻ, chuyển khoản, ví...)</div>
              <div className="flex items-center bg-green-50 rounded-lg p-3 justify-between">
                <span className="text-green-700 font-medium">
                  {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPAY'}
                </span>
                <button className="checkout-btn-edit text-xs text-blue-500" onClick={() => setOpenPaymentModal(true)}>Thay đổi <FaEdit className="ml-1" /></button>
              </div>
            </div>
            {/* Mã giảm giá */}
            <div className="checkout-section">
              <div className="checkout-label mb-2">Mã giảm giá</div>
              <div className="flex">
                <input className="checkout-input flex-1" placeholder="Nhập mã giảm giá( chỉ áp dụng 1 lần )" />
                <button className="checkout-btn-apply ml-2">Áp dụng</button>
              </div>
            </div>
            {/* Content rỗng cuối box */}
            <div style={{ height: '300px' }} />
          
          </div>
          {/* Tổng tiền và đặt hàng sticky bottom */}
          <div className="checkout-total-box-sticky">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">Tổng tiền tạm tính:</span>
              <span className="checkout-total">379.000 đ</span>
            </div>
            <button className="checkout-btn-order w-full" onClick={handleOrder}>Đặt ngay</button>
          </div>
          
          <PaymentMethodModal
            open={openPaymentModal}
            onClose={() => setOpenPaymentModal(false)}
            selected={paymentMethod}
            onSelect={(key) => { setPaymentMethod(key); setOpenPaymentModal(false); }}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout; 