import React, { useState } from 'react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [gender, setGender] = useState('male');

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
              <button
                onClick={() => setActiveTab('profile')}
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
                onClick={() => setActiveTab('address')}
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
                onClick={() => setActiveTab('orders')}
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
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Sản phẩm yêu thích
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-grow">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white ring-2 ring-gray-100">
                  <img
                    src="/images/avata.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0">
                  <label className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all hover:scale-110 shadow-lg border-2 border-white">
                    <input type="file" className="hidden" accept="image/*" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Anh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Chị</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === 'other'}
                    onChange={(e) => setGender(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Khác</span>
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Nhập tên tài khoản"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gmail
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  Cập nhật
                </button>
                <button className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
