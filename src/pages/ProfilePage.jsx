import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { useAuth } from '../context/AuthContext';
import Information from './profile/Information';
import Address from './profile/Address';
import Order from './profile/Order';
import ProductFavorite from './profile/ProductFavorite';
import ChangePassword from './profile/ChangePassword';
import axios from 'axios';

const ProfilePage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  console.log('profile:', profile); // Đặt ở đây

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Xác định tab hiện tại dựa vào pathname
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function fetchProfile() {
      try {
        // Sử dụng user từ AuthContext nếu có
        if (user) {
          setProfile(user);
          return;
        }

        // Fallback: gọi API để lấy profile
        const token = localStorage.getItem('token') || Cookies.get("auth_token") || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('🔍 Debug - No token found');
          navigate('/login');
          return;
        }
        
        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('🔍 Debug - Profile response:', res.data);
        setProfile(res.data.data || res.data);
      } catch (err) {
        console.error('Lỗi lấy profile:', err);
        // Nếu API fail, logout user
        logout();
        navigate('/login');
      }
    }
    fetchProfile();
  }, [isAuthenticated, user, navigate, logout]);



  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            {/* Profile Icon */}
            <div className="flex items-center gap-3 p-3 mb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile && profile.avatar ? (
                  <img src={profile.avatar} alt="avatar" className="w-10 h-10 object-cover rounded-full" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium text-gray-800">{profile ? (profile.full_name || profile.username || 'Tên người dùng') : 'Tên người dùng'}</span>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1 mb-6">
              <button
                onClick={() => {
                  navigate('/profile/information');
                  setActiveTab('profile');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Thông tin cá nhân
              </button>
              
              <button
                onClick={() => {
                  navigate('/profile/address');
                  setActiveTab('address');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === 'address' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Địa chỉ
              </button>
              
              <button
                onClick={() => {
                  navigate('/profile/orders');
                  setActiveTab('orders');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === 'orders' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                Đơn hàng
              </button>
              
              <button
                onClick={() => {
                  navigate('/profile/favorites');
                  setActiveTab('favorites');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === 'favorites' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Sản phẩm yêu thích
              </button>
              
              <button
                onClick={() => {
                  navigate('/profile/change-password');
                  setActiveTab('change-password');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeTab === 'change-password' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Đổi mật khẩu
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-md text-sm text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-grow">
          <Routes>
            <Route path="*" element={<Information />} />
            <Route path="information" element={<Information />} />
            <Route path="address" element={<Address />} />
            <Route path="orders" element={<Order />} />
            <Route path="favorites" element={<ProductFavorite />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Routes>
                </div>
      </div>
    </div>
  );
};

export default ProfilePage;           
