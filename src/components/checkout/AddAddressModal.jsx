import React, { useState } from 'react';
import './AddAddressModal.css';

const addressSuggestions = [
  '12 Tô Ký, Phường Tân Chánh Hiệp, Quận 12, TP. Hồ Chí Minh',
  '45 Nguyễn Văn Lượng, Phường 17, Quận Gò Vấp, TP. Hồ Chí Minh',
];

const AddAddressModal = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && phone && address) {
      onAdd({ name, phone, address });
      setName('');
      setPhone('');
      setAddress('');
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setShowSuggest(!!e.target.value);
  };

  const handleSelectSuggest = (suggest) => {
    setAddress(suggest);
    setShowSuggest(false);
  };

  if (!open) return null;
  return (
    <div className="add-address-modal-overlay">
      <div className="add-address-modal-box">
        <div className="add-address-modal-header">
          <span className="add-address-modal-title">Thêm Địa Chỉ Mới</span>
          <button className="add-address-modal-close" onClick={onClose}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#F44336"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <form className="add-address-modal-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="add-address-modal-field">
            <label>Họ và tên người nhận</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập họ tên" required />
          </div>
          <div className="add-address-modal-field">
            <label>Số điện thoại</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nhập số điện thoại" required />
          </div>
          <div className="add-address-modal-field" style={{ position: 'relative' }}>
            <label>Địa chỉ (Số nhà, tên đường, Phường, Quận)</label>
            <input type="text" value={address} onChange={handleAddressChange} placeholder="Nhập địa chỉ" required autoComplete="off" />
            {showSuggest && (
              <div className="add-address-suggest-box">
                {addressSuggestions.filter(s => s.toLowerCase().includes(address.toLowerCase())).map((s, idx) => (
                  <div key={idx} className="add-address-suggest-item" onClick={() => handleSelectSuggest(s)}>{s}</div>
                ))}
              </div>
            )}
          </div>
          <button className="add-address-modal-submit" type="submit">Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal; 