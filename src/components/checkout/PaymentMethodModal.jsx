import React from 'react';
import { FaWallet } from 'react-icons/fa';
import './PaymentMethodModal.css';

const paymentMethods = [
  {
    key: 'cod',
    label: 'Tiền mặt khi nhận hàng',
    icon: <FaWallet size={24} style={{ marginRight: 12 }} />,
  },
  {
    key: 'vnpay',
    label: 'Thanh toán qua VNPAY',
    icon: <img src="/img/vnpay.png" alt="VNPAY" className="pm-modal-vnpay-img" />,
  },
];

const PaymentMethodModal = ({ open, onClose, selected, onSelect }) => {
  if (!open) return null;
  return (
    <div className="pm-modal-overlay">
      <div className="pm-modal-box">
        <div className="pm-modal-header">
          <span className="pm-modal-title">Đổi hình thức thanh toán</span>
          <button className="pm-modal-close" onClick={onClose}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F44336"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="pm-modal-list">
          {paymentMethods.map((m) => (
            <label
              key={m.key}
              className={`pm-modal-item${selected === m.key ? ' selected' : ''}`}
              htmlFor={`pm-radio-${m.key}`}
            >
              <input
                type="radio"
                id={`pm-radio-${m.key}`}
                name="payment-method"
                checked={selected === m.key}
                onChange={() => onSelect(m.key)}
                className="pm-modal-radio-native"
              />
              {m.icon}
              <span className="pm-modal-label">{m.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal; 