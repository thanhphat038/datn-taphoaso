import React, { useState } from 'react';
import { FaPlus, FaRegCircle, FaDotCircle, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddAddressModal from '../components/checkout/AddAddressModal';
import './SelectAddress.css';

const initialAddressList = [
  {
    id: 1,
    name: 'Khắc Trí',
    phone: '0909749XXX',
    address: 'XXX Nguyễn Văn Thủ, Phường Đa kao, Quận 1, TP. Hồ Chí Minh',
  },
  {
    id: 2,
    name: 'Nguyễn Trí',
    phone: '0909998XXX',
    address: '12 Tô Ký, Phường Tân Chánh Hiệp, Quận 12, TP. Hồ Chí Minh',
  },
];

const SelectAddress = () => {
  const [addressList, setAddressList] = useState(initialAddressList);
  const [selected, setSelected] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const navigate = useNavigate();

  const handleAddAddress = (addr) => {
    const newId = addressList.length ? Math.max(...addressList.map(a => a.id)) + 1 : 1;
    setAddressList([...addressList, { ...addr, id: newId }]);
    setSelected(newId);
    setOpenAddModal(false);
  };

  return (
    <div className="select-address-bg min-h-screen flex flex-col items-center">
      <div className="select-address-container w-full max-w-lg mx-auto">
        <div className="select-address-header flex items-center justify-between px-2 pt-4 pb-2">
          <button className="select-address-back text-2xl" onClick={() => navigate(-1)}><FaArrowLeft /></button>
          <span className="select-address-title">Thông tin nhận hàng</span>
          <span style={{ width: 32 }}></span>
        </div>
        <div className="select-address-section">
          <div className="select-address-label">Địa chỉ</div>
          <div className="select-address-list">
            {addressList.map((item) => (
              <div
                key={item.id}
                className={`select-address-item${selected === item.id ? ' selected' : ''}`}
                onClick={() => setSelected(item.id)}
              >
                <div className="flex-1">
                  <div className="font-semibold select-address-name">{item.name} | {item.phone}</div>
                  <div className="select-address-detail">{item.address}</div>
                </div>
                <span className="select-address-radio">
                  {selected === item.id ? (
                    <FaDotCircle className="select-address-radio-icon checked" />
                  ) : (
                    <FaRegCircle className="select-address-radio-icon" />
                  )}
                </span>
              </div>
            ))}
          </div>
          <button className="select-address-add" onClick={() => setOpenAddModal(true)}>
            <span className="select-address-add-icon"><FaPlus /></span> Thêm Địa Chỉ Mới
          </button>
        </div>
      </div>
      <div className="select-address-footer-sticky">
        <button className="select-address-confirm" onClick={() => navigate('/checkout')}>Xác nhận</button>
      </div>
      <AddAddressModal open={openAddModal} onClose={() => setOpenAddModal(false)} onAdd={handleAddAddress} />
    </div>
  );
};

export default SelectAddress; 