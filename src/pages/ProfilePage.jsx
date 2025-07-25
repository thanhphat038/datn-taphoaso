import React, { useState } from 'react';
import { useNavigate, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import Information from './profile/Information';
import Address from './profile/Address';
import Order from './profile/Order';
import ProductFavorite from './profile/ProductFavorite';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(null);

  const handleLogout = () => {
    Cookies.remove("auth_token");
    window.location.href = "/login";
  };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Xác định tab hiện tại dựa vào pathname
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop();

  React.useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  // Thêm state cho xác nhận mật khẩu mới
  // const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showChangePassword, setShowChangePassword] = useState(false);

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
              <span className="font-medium">{profile ? profile.username : 'Tên'}</span>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => {
                  navigate('/profile/information');
                  setActiveTab('profile');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
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
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'address' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
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
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
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
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Sản phẩm yêu thích
              </button>
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:from-blue-500 hover:to-blue-700"
                onClick={() => setShowChangePassword(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9a3 3 0 116 0v1h1a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2h1V9zm3-3a1 1 0 00-1 1v1h2V7a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Đổi mật khẩu
              </button>
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
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-30">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowChangePassword(false)}
                aria-label="Đóng"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-6">Đổi mật khẩu</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập mật khẩu mới"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập lại mật khẩu mới"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button
                    className="flex-1 px-6 py-3 rounded-lg bg-[#06AEF4] text-white hover:bg-blue-500 transition-colors font-medium"
                    onClick={async () => {
                      // setChangePasswordLoading(true); // This state was removed
                      // setChangePasswordError(null); // This state was removed
                      // setChangePasswordSuccess(null); // This state was removed
                      // Validate trước khi gọi API
                      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
                        // setChangePasswordError('Vui lòng nhập đầy đủ các trường!'); // This state was removed
                        // setChangePasswordLoading(false); // This state was removed
                        return;
                      }
                      if (passwords.newPassword.length < 6) {
                        // setChangePasswordError('Mật khẩu mới phải có ít nhất 6 ký tự!'); // This state was removed
                        // setChangePasswordLoading(false); // This state was removed
                        return;
                      }
                      if (passwords.newPassword !== passwords.confirmPassword) {
                        // setChangePasswordError('Mật khẩu xác nhận không khớp!'); // This state was removed
                        // setChangePasswordLoading(false); // This state was removed
                        return;
                      }
                      try {
                        // await changePassword(passwords.currentPassword, passwords.newPassword); // This function was removed
                        // setChangePasswordSuccess('Đổi mật khẩu thành công'); // This state was removed
                        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      } catch (error) {
                        // setChangePasswordError(error.message); // This state was removed
                      } finally {
                        // setChangePasswordLoading(false); // This state was removed
                      }
                    }}
                    // disabled={changePasswordLoading} // This state was removed
                  >
                    {/* {changePasswordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'} */}
                    Đổi mật khẩu
                  </button>
                </div>
                {/* {changePasswordError && ( // This state was removed
                  <p className="text-red-500 mt-2 text-center">{changePasswordError}</p>
                )} */}
                {/* {changePasswordSuccess && ( // This state was removed
                  <p className="text-green-500 mt-2 text-center">{changePasswordSuccess}</p>
                )} */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;           
