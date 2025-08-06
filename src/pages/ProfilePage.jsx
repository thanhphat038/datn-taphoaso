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
import { logoutUser } from '../service/UserService';

const ProfilePage = () => {
  // const { isAuthenticated, user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = () => {
    logoutUser();
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
        const token = Cookies.get("auth_token");
        
        if (!token) {
          setProfile(null);
          return;
        }
        
        const res = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Nếu response là { data: { ...user } }
        setProfile(res.data.data || res.data);
      } catch (err) {
        console.error('Lỗi lấy profile:', err);
        setProfile(null);
      }
    }
    fetchProfile();
  }, []);

  // Listen for logout event
  useEffect(() => {
    const handleUserLogout = () => {
      setProfile(null);
    };

    window.addEventListener('user-logout', handleUserLogout);
    
    return () => {
      window.removeEventListener('user-logout', handleUserLogout);
    };
  }, []);

  // Enhanced authentication check and redirect
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = Cookies.get("auth_token");
      const userData = localStorage.getItem('userData') || localStorage.getItem('user');
      
      console.log('🔍 ProfilePage Debug:');
      console.log('🔍 Token:', token ? 'exists' : 'missing');
      console.log('🔍 UserData:', userData ? 'exists' : 'missing');
      
      if (!token || !userData) {
        console.log('🚫 No authentication found, redirecting to login...');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return false;
      }
      
      try {
        const user = JSON.parse(userData);
        // Kiểm tra các trường có thể có của user
        const hasValidUser = user && (
          user.username || 
          user.email || 
          user.id || 
          user._id ||
          user.full_name ||
          user.name
        );
        
        if (!hasValidUser) {
          console.log('🚫 Invalid user data, redirecting to login...');
          console.log('🔍 User object keys:', Object.keys(user || {}));
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate('/login');
          return false;
        }
        
        console.log('✅ ProfilePage: User authenticated successfully');
        console.log('🔍 User info:', {
          id: user.id || user._id,
          username: user.username,
          email: user.email,
          name: user.full_name || user.name
        });
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } catch (error) {
        console.log('🚫 Error parsing user data, redirecting to login...');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/login');
        return false;
      }
    };
    
    // Check immediately
    if (!checkAuthAndRedirect()) return;
    
    // Set up interval to check periodically
    const authCheckInterval = setInterval(checkAuthAndRedirect, 5000);
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [navigate]);



  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra xác thực...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
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
      </div>
    );
  }

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
