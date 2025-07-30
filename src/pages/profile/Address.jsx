import React, { useState, useEffect } from 'react';
import {
  getAllAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  getProvinces,
  getDistricts,
  getWards
} from '../../service/Address.service';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editAddress, setEditAddress] = useState({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
  const [phoneError, setPhoneError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'

  // Dữ liệu vị trí
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [editDistricts, setEditDistricts] = useState([]);
  const [editWards, setEditWards] = useState([]);

  useEffect(() => {
    fetchAddresses();
    getProvinces().then(res => setCities(res.data));
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllAddress();
      setAddresses(res.data.data);
    } catch (err) {
      setMessage('Không thể tải địa chỉ');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn tỉnh/thành cho form thêm
  const handleCityChange = async (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, city: code, district: '', ward: '' });
    setDistricts([]);
    setWards([]);
    if (code) {
      const res = await getDistricts(code);
      setDistricts(res.data.districts);
    }
  };
  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, district: code, ward: '' });
    setWards([]);
    if (code) {
      const res = await getWards(code);
      setWards(res.data.wards);
    }
  };
  const handleWardChange = (e) => {
    const code = e.target.value;
    setNewAddress({ ...newAddress, ward: code });
  };

  // Khi chọn tỉnh/thành cho form sửa
  const handleEditCityChange = async (e) => {
    const code = e.target.value;
    setEditAddress({ ...editAddress, city: code, district: '', ward: '' });
    setEditDistricts([]);
    setEditWards([]);
    if (code) {
      const res = await getDistricts(code);
      setEditDistricts(res.data.districts);
    }
  };
  const handleEditDistrictChange = async (e) => {
    const code = e.target.value;
    setEditAddress({ ...editAddress, district: code, ward: '' });
    setEditWards([]);
    if (code) {
      const res = await getWards(code);
      setEditWards(res.data.wards);
    }
  };
  const handleEditWardChange = (e) => {
    const code = e.target.value;
    setEditAddress({ ...editAddress, ward: code });
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(address => address._id !== id));
      setMessage('Xóa địa chỉ thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Xóa địa chỉ thất bại!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddAddress = async () => {
    setPhoneError('');
    if (!newAddress.receiver || !newAddress.phone || !newAddress.city || !newAddress.district || !newAddress.ward || !newAddress.address_detail) {
      setMessage('Vui lòng nhập đầy đủ thông tin!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    // Validate số điện thoại
    if (!/^\d{10}$/.test(newAddress.phone)) {
      setPhoneError('Số điện thoại phải đủ 10 số!');
      return;
    }
    // Lấy lại name từ code (dùng state hiện tại)
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
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const res = await createAddress(payload);
      setAddresses([...addresses, res.data.data]);
      setShowAddForm(false);
      setNewAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
      setDistricts([]);
      setWards([]);
      setMessage('Thêm địa chỉ thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Thêm địa chỉ thất bại!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Bắt đầu sửa địa chỉ
  const handleStartEdit = async (address) => {
    setEditId(address._id);
    // Tìm code từ name để set vào state
    const cityObj = cities.find(c => c.name == address.city);
    let editDistrictsArr = [];
    let editWardsArr = [];
    let districtCode = '';
    let wardCode = '';
    if (cityObj) {
      const res = await getDistricts(cityObj.code);
      editDistrictsArr = res.data.districts;
      const districtObj = editDistrictsArr.find(d => d.name == address.district);
      if (districtObj) {
        districtCode = districtObj.code;
        const res2 = await getWards(districtObj.code);
        editWardsArr = res2.data.wards;
        const wardObj = editWardsArr.find(w => w.name == address.ward);
        if (wardObj) wardCode = wardObj.code;
      }
    }
    setEditDistricts(editDistrictsArr);
    setEditWards(editWardsArr);
    setEditAddress({
      receiver: address.receiver,
      phone: address.phone,
      city: cityObj ? cityObj.code : '',
      district: districtCode,
      ward: wardCode,
      address_detail: address.address_detail,
      is_default: address.is_default || false
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
    setEditDistricts([]);
    setEditWards([]);
  };

  // Lưu sửa địa chỉ
  const handleSaveEdit = async () => {
    if (!editAddress.receiver || !editAddress.phone || !editAddress.city || !editAddress.district || !editAddress.ward || !editAddress.address_detail) {
      setMessage('Vui lòng nhập đầy đủ thông tin!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    try {
      const cityObj = cities.find(c => c.code == editAddress.city);
      const districtObj = editDistricts.find(d => d.code == editAddress.district);
      const wardObj = editWards.find(w => w.code == editAddress.ward);
      const payload = {
        ...editAddress,
        city: cityObj?.name || '',
        district: districtObj?.name || '',
        ward: wardObj?.name || ''
      };
      const res = await updateAddress(editId, payload);
      setAddresses(addresses.map(addr => addr._id == editId ? res.data.data : addr));
      handleCancelEdit();
      setMessage('Cập nhật địa chỉ thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Cập nhật địa chỉ thất bại!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Đồng bộ districts/wards khi mở lại form thêm (ví dụ khi đã chọn city/district trước đó)
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

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#06AEF4] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#06AEF4]">
          Địa chỉ nhận hàng
        </h2>
        <p className="text-gray-600 mt-2">Quản lý địa chỉ giao hàng của bạn</p>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl shadow-lg font-medium flex items-center justify-between ${
          messageType === 'error' 
            ? 'bg-red-50 border-l-4 border-red-500 text-red-700' 
            : 'bg-green-50 border-l-4 border-green-500 text-green-700'
        }`}>
          <div className="flex items-center gap-2">
            {messageType === 'error' ? (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{message}</span>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors" 
            onClick={() => setMessage('')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-[#06AEF4] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Đang tải...</span>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4 mb-6">
        {addresses.map((address, idx) => (
          <div key={address._id || address.id || idx} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                                 <div className="flex items-center gap-4 mb-3">
                   <div className="w-10 h-10 bg-[#06AEF4] rounded-full flex items-center justify-center">
                     <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                   </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{address.receiver}</h3>
                    <p className="text-blue-600 font-medium">{address.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-sm leading-relaxed">
                    {address.address_detail}, {address.ward}, {address.district}, {address.city}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {editId == address._id ? (
                  <>
                                         <button 
                       onClick={handleSaveEdit} 
                       className="px-4 py-2 rounded-lg bg-[#06AEF4] text-white font-medium hover:bg-[#70d9ff] transition-all shadow-md hover:shadow-lg"
                     >
                       Lưu
                     </button>
                    <button 
                      onClick={handleCancelEdit} 
                      className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                                         <button
                       onClick={() => handleStartEdit(address)}
                       className="px-4 py-2 rounded-lg bg-[#06AEF4] text-white font-medium hover:bg-[#70d9ff] transition-all shadow-md hover:shadow-lg"
                     >
                       Sửa
                     </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {editId == address._id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa địa chỉ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Tên người nhận
                    </label>
                    <input 
                      type="text" 
                      value={editAddress.receiver} 
                      onChange={e => setEditAddress({ ...editAddress, receiver: e.target.value })} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                      placeholder="Nhập tên người nhận" 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Số điện thoại
                    </label>
                    <input 
                      type="tel" 
                      value={editAddress.phone} 
                      onChange={e => setEditAddress({ ...editAddress, phone: e.target.value })} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                      placeholder="Nhập số điện thoại" 
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Tỉnh/Thành phố
                    </label>
                    <select 
                      value={editAddress.city} 
                      onChange={handleEditCityChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Quận/Huyện
                    </label>
                    <select 
                      value={editAddress.district} 
                      onChange={handleEditDistrictChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                      disabled={!editDistricts.length}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {editDistricts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Phường/Xã
                    </label>
                    <select 
                      value={editAddress.ward} 
                      onChange={handleEditWardChange} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                      disabled={!editWards.length}
                    >
                      <option value="">Chọn phường/xã</option>
                      {editWards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="group md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      Địa chỉ chi tiết
                    </label>
                    <input 
                      type="text" 
                      value={editAddress.address_detail} 
                      onChange={e => setEditAddress({ ...editAddress, address_detail: e.target.value })} 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                      placeholder="Nhập địa chỉ chi tiết" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

             {/* Add New Address Button */}
       <button 
         onClick={() => setShowAddForm(true)} 
         className="w-full py-4 px-6 bg-[#06AEF4] text-white rounded-xl font-semibold hover:bg-[#70d9ff] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
       >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Thêm địa chỉ mới
      </button>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border-2 border-dashed border-blue-300">
                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
             <div className="w-8 h-8 bg-[#06AEF4] rounded-full flex items-center justify-center">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
             </div>
             Thêm địa chỉ mới
           </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Tên người nhận
              </label>
              <input 
                type="text" 
                value={newAddress.receiver} 
                onChange={e => setNewAddress({ ...newAddress, receiver: e.target.value })} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                placeholder="Nhập tên người nhận" 
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Số điện thoại
              </label>
              <input 
                type="tel" 
                value={newAddress.phone} 
                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                placeholder="Nhập số điện thoại" 
              />
              {phoneError && <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {phoneError}
              </div>}
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Tỉnh/Thành phố
              </label>
              <select 
                value={newAddress.city} 
                onChange={handleCityChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Quận/Huyện
              </label>
              <select 
                value={newAddress.district} 
                onChange={handleDistrictChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                disabled={!districts.length}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Phường/Xã
              </label>
              <select 
                value={newAddress.ward} 
                onChange={handleWardChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                disabled={!wards.length}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>
            <div className="group md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Địa chỉ chi tiết
              </label>
              <input 
                type="text" 
                value={newAddress.address_detail} 
                onChange={e => setNewAddress({ ...newAddress, address_detail: e.target.value })} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white" 
                placeholder="Nhập địa chỉ chi tiết" 
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6">
                         <button 
               onClick={handleAddAddress} 
               className="flex-1 px-6 py-3 bg-[#06AEF4] text-white rounded-xl font-semibold hover:bg-[#70d9ff] transition-all shadow-md hover:shadow-lg"
             >
               Lưu địa chỉ
             </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address; 