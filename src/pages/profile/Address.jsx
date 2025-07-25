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
      setError('Không thể tải địa chỉ');
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
    } catch (err) {
      alert('Xóa địa chỉ thất bại!');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.receiver || !newAddress.phone || !newAddress.city || !newAddress.district || !newAddress.ward || !newAddress.address_detail) {
      alert('Vui lòng nhập đầy đủ thông tin!');
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
      alert('Vui lòng chọn đầy đủ vị trí!');
      return;
    }
    try {
      const res = await createAddress(payload);
      setAddresses([...addresses, res.data.data]);
      setShowAddForm(false);
      setNewAddress({ receiver: '', phone: '', city: '', district: '', ward: '', address_detail: '', is_default: false });
      setDistricts([]);
      setWards([]);
    } catch (err) {
      alert('Thêm địa chỉ thất bại!');
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
      alert('Vui lòng nhập đầy đủ thông tin!');
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
    } catch (err) {
      alert('Cập nhật địa chỉ thất bại!');
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-4">
        {addresses.map((address, idx) => (
          <div key={address._id || address.id || idx} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-medium">{address.receiver}</span>
                  <span className="text-gray-600">{address.phone}</span>
                </div>
                <p className="text-gray-600">
                  {address.address_detail}, {address.ward}, {address.district}, {address.city}
                </p>
              </div>
              <div className="flex gap-2">
                {editId == address._id ? (
                  <>
                    <button onClick={handleSaveEdit} className="border-1 px-3 py-1 rounded-md cursor-pointer text-green-500 hover:bg-green-500 hover:text-white">Lưu</button>
                    <button onClick={handleCancelEdit} className="border-1 px-3 py-1 rounded-md cursor-pointer text-gray-500 hover:bg-gray-500 hover:text-white">Hủy</button>
                  </>
                ) : (
                  <>
                      <button
                        onClick={() => handleStartEdit(address)}
                        className="px-4 py-2 rounded-md text-white font-medium transition-colors bg-[#06AEF4] hover:bg-[#70d9ff]"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="px-4 py-2 rounded-md text-white font-medium transition-colors bg-red-500 hover:bg-red-400"
                      >
                        Xóa
                      </button>

                  </>
                )}
              </div>
            </div>
            {/* Form sửa địa chỉ */}
            {editId == address._id && (
              <div className="mt-4 border-t pt-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
                    <input type="text" value={editAddress.receiver} onChange={e => setEditAddress({ ...editAddress, receiver: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập tên người nhận" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input type="tel" value={editAddress.phone} onChange={e => setEditAddress({ ...editAddress, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập số điện thoại" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <select value={editAddress.city} onChange={handleEditCityChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                        <option value="">Chọn tỉnh/thành phố</option>
                        {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <select value={editAddress.district} onChange={handleEditDistrictChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" disabled={!editDistricts.length}>
                        <option value="">Chọn quận/huyện</option>
                        {editDistricts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <select value={editAddress.ward} onChange={handleEditWardChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" disabled={!editWards.length}>
                        <option value="">Chọn phường/xã</option>
                        {editWards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                    <input type="text" value={editAddress.address_detail} onChange={e => setEditAddress({ ...editAddress, address_detail: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập địa chỉ chi tiết" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setShowAddForm(true)} className="mt-4 flex items-center gap-2 text-blue-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Thêm địa chỉ mới
      </button>
      {showAddForm && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Thêm địa chỉ mới</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
              <input type="text" value={newAddress.receiver} onChange={e => setNewAddress({ ...newAddress, receiver: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập tên người nhận" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="tel" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập số điện thoại" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <select value={newAddress.city} onChange={handleCityChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <option value="">Chọn tỉnh/thành phố</option>
                  {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <select value={newAddress.district} onChange={handleDistrictChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" disabled={!districts.length}>
                  <option value="">Chọn quận/huyện</option>
                  {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <select value={newAddress.ward} onChange={handleWardChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" disabled={!wards.length}>
                  <option value="">Chọn phường/xã</option>
                  {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
              <input type="text" value={newAddress.address_detail} onChange={e => setNewAddress({ ...newAddress, address_detail: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nhập địa chỉ chi tiết" />
            </div>
            <div className="flex gap-4">
              <button onClick={handleAddAddress} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">Lưu</button>
              <button onClick={() => setShowAddForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Address; 