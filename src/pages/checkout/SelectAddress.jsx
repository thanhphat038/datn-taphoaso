import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SelectAddress.css';
import { getAllAddress, createAddress, getProvinces, getDistricts, getWards } from '../../service/Address.service';

const SelectAddress = () => {
  const [addressList, setAddressList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [newAddress, setNewAddress] = useState({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  useEffect(() => {
    fetchAddresses();
    getProvinces().then(res => setCities(res.data));
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await getAllAddress();
      const addresses = res.data.data || [];
      setAddressList(addresses);
      // Ưu tiên địa chỉ mặc định, nếu không có thì chọn địa chỉ đầu tiên
      const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
      setSelected(defaultAddr?._id || null);
    } catch (err) {
      setAddressList([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý select động cho form thêm
  useEffect(() => {
    if (newAddress.city) {
      getDistricts(newAddress.city).then(res => setDistricts(res.data.districts));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [newAddress.city]);
  useEffect(() => {
    if (newAddress.district) {
      getWards(newAddress.district).then(res => setWards(res.data.wards));
    } else {
      setWards([]);
    }
  }, [newAddress.district]);

  const handleAddAddress = async () => {
    if (!newAddress.receiver || !newAddress.phone || !newAddress.city || !newAddress.district || !newAddress.ward || !newAddress.address_detail) {
      setMessage('Vui lòng nhập đầy đủ thông tin!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    const cityObj = cities.find(c => c.code == newAddress.city);
    const districtObj = districts.find(d => d.code == newAddress.district);
    const wardObj = wards.find(w => w.code == newAddress.ward);
    const payload = {
      ...newAddress,
      city: cityObj ? cityObj.name : '',
      district: districtObj ? districtObj.name : '',
      ward: wardObj ? wardObj.name : ''
    };
    if (!payload.city || !payload.district || !payload.ward) {
      setMessage('Vui lòng chọn đầy đủ vị trí!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      const res = await createAddress(payload);
      await fetchAddresses();
      setShowAddForm(false);
      setNewAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
      setDistricts([]);
      setWards([]);
      setSelected(res.data.data._id);
      setMessage('Thêm địa chỉ thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('Thêm địa chỉ thất bại!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleCityChange = async (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, city: code, district: '', ward: '' });
  };
  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, district: code, ward: '' });
  };
  const handleWardChange = (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, ward: code });
  };

  const handleConfirm = () => {
    const selectedAddress = addressList.find(a => a._id === selected);
    navigate('/checkout', { state: { selectedAddress } });
  };

  return (
    <div className="select-address-wrapper">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <span>{message}</span>
          <button className="ml-2 text-lg" onClick={() => setMessage("")}>×</button>
        </div>
      )}
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
                  key={item._id}
                  className={`select-address-item ${selected === item._id ? 'selected' : ''}`}
                  onClick={() => setSelected(item._id)}
                >
                  <div className="select-address-info">
                    <div className="select-address-name">{item.receiver} | {item.phone}</div>
                    <div className="select-address-detail">{item.address_detail}, {item.ward}, {item.district}, {item.city}</div>
                  </div>
                  <div className="select-address-radio">
                    <span
                      className={
                        selected === item._id
                          ? 'select-address-radio-checked'
                          : 'select-address-radio-unchecked'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="select-address-add" onClick={() => setShowAddForm(!showAddForm)}>
              <span className="select-address-add-icon">
                <FaPlus size={12} />
              </span>
              Thêm Địa Chỉ Mới
            </button>

            {showAddForm && (
              <div className="select-address-add-form mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                <div className="mb-2">
<label className="block text-sm font-medium mb-1">Tên người nhận</label>
                  <input type="text" value={newAddress.receiver} onChange={e => setNewAddress({ ...newAddress, receiver: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập tên người nhận" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input type="tel" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập số điện thoại" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                  <select value={newAddress.city} onChange={handleCityChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Chọn tỉnh/thành phố</option>
                    {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                  <select value={newAddress.district} onChange={handleDistrictChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={!districts.length}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                  <select value={newAddress.ward} onChange={handleWardChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={!wards.length}>
                    <option value="">Chọn phường/xã</option>
                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Địa chỉ chi tiết</label>
                  <input type="text" value={newAddress.address_detail} onChange={e => setNewAddress({ ...newAddress, address_detail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nhập địa chỉ chi tiết" />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleAddAddress} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
<button onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">Hủy</button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="select-address-footer-sticky">
          <button
            className="select-address-confirm gradient-slide-effect"
            onClick={handleConfirm}
            disabled={!selected}
          >
            <span>Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;