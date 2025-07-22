import React, { useState } from 'react';
const Information = () => {
  const [gender, setGender] = useState('male');
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-yellow-100 overflow-hidden border-4 border-white shadow-lg">
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
        {/* Gender Selection */}
        <div className="flex gap-6 mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={(e) => setGender(e.target.value)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Anh</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={(e) => setGender(e.target.value)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Chị</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="other"
              checked={gender === 'other'}
              onChange={(e) => setGender(e.target.value)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Khác</span>
          </label>
        </div>
      </div>
      {/* Profile Form */}
      <div className="space-y-6 max-w-lg mx-auto">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tên tài khoản
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Nhập tên tài khoản"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Gmail
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Nhập địa chỉ email"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button className="flex-1 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
            Cập nhật
          </button>
          <button className="flex-1 px-6 py-3 rounded-lg bg-[#06AEF4] text-white hover:bg-blue-500 transition-colors font-medium">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};
export default Information; 