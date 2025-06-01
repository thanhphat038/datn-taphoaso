import React, { useState } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddAddressModal from '../../components/checkout/AddAddressModal';
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
    <div className="select-address-wrapper">
      <div className="select-address-container">
        {/* Header */}
        <div className="select-address-header">
          <button className="select-address-back" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div className="select-address-title">Thông tin nhận hàng</div>
          <div className="select-address-placeholder" />
        </div>

        {/* Scrollable content */}
        <div className="select-address-scrollable">
          <div className="select-address-section">
            <div className="select-address-label">Địa chỉ</div>
            <div className="select-address-list">
              {addressList.map((item) => (
                <div
                  key={item.id}
                  className={`select-address-item ${selected === item.id ? 'selected' : ''}`}
                  onClick={() => setSelected(item.id)}
                >
                  <div className="select-address-info">
                    <div className="select-address-name">{item.name} | {item.phone}</div>
                    <div className="select-address-detail">{item.address}</div>
                  </div>
                  <div className="select-address-radio">
                    <span
                      className={
                        selected === item.id
                          ? 'select-address-radio-checked'
                          : 'select-address-radio-unchecked'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="select-address-add" onClick={() => setOpenAddModal(true)}>
              <span className="select-address-add-icon">
                <FaPlus size={12} />
              </span>
              Thêm Địa Chỉ Mới
            </button>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="select-address-footer-sticky">
          <button
            className="select-address-confirm gradient-slide-effect"
            onClick={() => navigate('/checkout')}
          >
            <span>Xác nhận</span>
          </button>
        </div>
      </div>

      <AddAddressModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddAddress}
      />
    </div>
  );
};

export default SelectAddress;
