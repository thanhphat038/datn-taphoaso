import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../service/user.service';
import { useAuth } from '../../context/AuthContext';

const Information = () => {
  const { user, updateUser, refreshUserData } = useAuth();
  const [userData, setUserData] = useState({ username: '', full_name: '', email: '', phone: '', gender: 'male', avatar: '' });
  const [originalUser, setOriginalUser] = useState({ username: '', full_name: '', email: '', phone: '', gender: 'male', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile();
        const userData = {
          username: data.username || '',
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || 'male',
          avatar: data.avatar || '',
        };
        setUserData(userData);
        setOriginalUser(userData); // Lưu dữ liệu gốc
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Update user state
      setUserData(prev => ({ ...prev, avatar: file }));
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Hủy chỉnh sửa - khôi phục dữ liệu gốc
      setUserData(originalUser);
      setAvatarPreview(null);
      setIsEditing(false);
      setError(null);
      setSuccess(null);
    } else {
      // Bắt đầu chỉnh sửa
      setIsEditing(true);
      setError(null);
      setSuccess(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!userData.username.trim()) {
      setError('Tên tài khoản không được để trống!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (userData.full_name && userData.full_name.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setError('Email không hợp lệ!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (userData.phone && !/^[0-9]{10,11}$/.test(userData.phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ!');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      
      // If avatar is a File object, handle file upload
      if (userData.avatar instanceof File) {
        const formData = new FormData();
        formData.append('avatar', userData.avatar);
        formData.append('username', userData.username);
        formData.append('full_name', userData.full_name);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);
        formData.append('gender', userData.gender);
        
        await updateProfile(formData);
      } else {
        // Regular update without file
        await updateProfile(userData);
      }
      
      // Refresh user data in AuthContext
      await refreshUserData();
      
      setSuccess('Cập nhật thông tin thành công!');
      setAvatarPreview(null); // Clear preview after successful save
      setOriginalUser(userData); // Cập nhật dữ liệu gốc
      setIsEditing(false); // Thoát chế độ chỉnh sửa
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Cập nhật thông tin thất bại!');
      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Fetch latest user data from server
      const data = await getProfile();
      const userData = {
        username: data.username || '',
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || 'male',
        avatar: data.avatar || '',
      };
      setUserData(userData);
      setOriginalUser(userData);
      setAvatarPreview(null);
      setIsEditing(false);
      
      // Refresh user data in AuthContext
      await refreshUserData();
      
      setSuccess('Đã tải lại thông tin mới nhất!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Không thể tải thông tin mới nhất!');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#06AEF4] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#06AEF4]">
          Thông tin cá nhân
        </h2>
        <p className="text-gray-600 mt-1 text-sm">Cập nhật thông tin tài khoản của bạn</p>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 overflow-hidden border-3 border-white shadow-lg relative">
            <img
              src={avatarPreview || userData.avatar || "/images/avata.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/avata.jpg";
              }}
            />
            {/* Decorative stars */}
            <div className="absolute inset-0 bg-yellow-50 opacity-20"></div>
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60"></div>
            <div className="absolute top-3 right-2 w-1 h-1 bg-yellow-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-yellow-300 rounded-full opacity-60"></div>
          </div>
          <div className="absolute -bottom-1 -right-1">
            <label className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-110 shadow-md border-2 border-white transform hover:rotate-12 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange}
                disabled={!isEditing}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSave}>
        {/* Username Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Tên tài khoản
          </label>
          <div className="relative">
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#06AEF4] focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 text-sm ${
                isEditing ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Nhập tên tài khoản"
            />
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${
              isEditing ? 'bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5' : 'bg-gray-50/50'
            }`}></div>
          </div>
        </div>

        {/* Full Name Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Họ và tên
          </label>
          <div className="relative">
            <input
              type="text"
              name="full_name"
              value={userData.full_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#06AEF4] focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 text-sm ${
                isEditing ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Nhập họ và tên"
            />
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${
              isEditing ? 'bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5' : 'bg-gray-50/50'
            }`}></div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Số điện thoại
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#06AEF4] focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 text-sm ${
                isEditing ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Nhập số điện thoại"
            />
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${
              isEditing ? 'bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5' : 'bg-gray-50/50'
            }`}></div>
          </div>
        </div>

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Gmail
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#06AEF4] focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 text-sm ${
                isEditing ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Nhập địa chỉ email"
            />
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none ${
              isEditing ? 'bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5' : 'bg-gray-50/50'
            }`}></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          {/* Edit/Cancel Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleEdit}
            className={`flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 transition-all font-semibold relative overflow-hidden text-sm ${
              loading 
                ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                : isEditing
                ? 'hover:border-red-300 hover:bg-red-50 hover:text-red-700'
                : 'hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isEditing ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hủy
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </>
              )}
            </span>
          </button>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading || !isEditing}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition-all relative overflow-hidden text-sm ${
              loading || !isEditing
                ? 'opacity-60 cursor-not-allowed bg-gray-400'
                : 'bg-[#06AEF4] hover:bg-[#70d9ff] hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </span>
          </button>
        </div>

        {/* Refresh Button - Only show when not editing */}
        {/* {!isEditing && (
          <div className="flex justify-center pt-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleRefresh}
              className={`px-4 py-2 rounded-md border border-gray-300 text-gray-600 transition-all text-xs font-medium ${
                loading 
                  ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                  : 'hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Đang tải...' : 'Tải lại thông tin'}
              </span>
            </button>
          </div>
        )} */}
      </form>
    </div>
  );
};

export default Information; 