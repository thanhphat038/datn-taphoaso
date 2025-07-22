import React from 'react';
import { useNavigate, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import Information from './profile/Information';
import Address from './profile/Address';
import Order from './profile/Order';
import ProductFavorite from './profile/ProductFavorite';

const ProfilePage = () => {
   const handleLogout = () => {
    Cookies.remove("auth_token");
    window.location.href = "/login";
  };
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab hiện tại dựa vào pathname
  const currentTab = location.pathname.split('/').pop();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Profile Icon */}
            <div className="flex items-center gap-3 p-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Tên</span>
            </div>
            {/* Navigation Menu */}
            <nav className="space-y-1">
              <NavLink
                to="/profile/information"
                className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Thông tin cá nhân
              </NavLink>
              <NavLink
                to="/profile/address"
                className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Địa chỉ
              </NavLink>
              <NavLink
                to="/profile/orders"
                className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                Đơn hàng
              </NavLink>
              <NavLink
                to="/profile/favorites"
                className={({ isActive }) => `w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Sản phẩm yêu thích
              </NavLink>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Đăng xuất
              </button>
            </nav>
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
          </Routes>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
