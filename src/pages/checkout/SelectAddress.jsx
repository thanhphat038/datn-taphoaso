import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllAddress, createAddress, getProvinces, getDistricts, getWards } from '../../service/Address.service';

const SelectAddress = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
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
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      fetchAddresses();
      getProvinces().then(res => setCities(res.data));
    }
  }, [isAuthenticated, authLoading, navigate]);

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
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(newAddress.phone)) {
      setMessage('Số điện thoại không hợp lệ!');
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

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập trang này</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <span>{message}</span>
          <button className="ml-2 text-lg" onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thông tin nhận hàng</h1>
            <p className="text-gray-600">Chọn địa chỉ giao hàng của bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Địa chỉ giao hàng
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {addressList.map((item) => (
                    <div
                      key={item._id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selected === item._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelected(item._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FaUser className="text-gray-500" />
                            <span className="font-medium text-gray-800">{item.receiver}</span>
                            <span className="text-gray-400">|</span>
                            <FaPhone className="text-gray-500" />
                            <span className="text-gray-600">{item.phone}</span>
                          </div>
                          <div className="text-gray-600 text-sm">
                            {item.address_detail}, {item.ward}, {item.district}, {item.city}
                          </div>
                          {item.is_default && (
                            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          {selected === item._id ? (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <FaCheck className="text-white text-xs" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {addressList.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-gray-300" />
                      <p>Chưa có địa chỉ nào</p>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="mt-4 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus className="text-sm" />
                Thêm địa chỉ mới
              </button>

              {showAddForm && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm địa chỉ mới</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
                      <input 
                        type="text" 
                        value={newAddress.receiver} 
                        onChange={e => setNewAddress({ ...newAddress, receiver: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Nhập tên người nhận" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={newAddress.phone} 
                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Nhập số điện thoại" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                      <select 
                        value={newAddress.city} 
                        onChange={handleCityChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                      <select 
                        value={newAddress.district} 
                        onChange={handleDistrictChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        disabled={!districts.length}
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                      <select 
                        value={newAddress.ward} 
                        onChange={handleWardChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        disabled={!wards.length}
                      >
                        <option value="">Chọn phường/xã</option>
                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                      <input 
                        type="text" 
                        value={newAddress.address_detail} 
                        onChange={e => setNewAddress({ ...newAddress, address_detail: e.target.value })} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Nhập địa chỉ chi tiết" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={handleAddAddress} 
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Lưu địa chỉ
                    </button>
                    <button 
                      onClick={() => setShowAddForm(false)} 
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ đã chọn:</span>
                  <span className="font-medium">
                    {selected ? 'Đã chọn' : 'Chưa chọn'}
                  </span>
                </div>
                {selected && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      {addressList.find(a => a._id === selected)?.receiver}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {addressList.find(a => a._id === selected)?.address_detail}, {addressList.find(a => a._id === selected)?.ward}, {addressList.find(a => a._id === selected)?.district}, {addressList.find(a => a._id === selected)?.city}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors ${
                  selected
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Xác nhận địa chỉ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAddress;