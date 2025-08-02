import React from 'react';
import { FaShieldAlt, FaExclamationTriangle, FaHome, FaSignInAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminForbidden = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Truy cập bị từ chối</h2>
          
          <div className="flex items-center justify-center mb-6">
            <FaShieldAlt className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-600">Khu vực quản trị được bảo vệ</span>
          </div>
          
          <p className="text-gray-600 mb-8">
            Bạn không có quyền truy cập vào trang quản trị. Chỉ admin mới có thể truy cập khu vực này.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full bg-[#06AEF4] text-white py-3 px-4 rounded-lg hover:bg-[#0590d8] transition-colors flex items-center justify-center gap-2"
            >
              <FaHome className="w-4 h-4" />
              Về trang chủ
            </Link>
            
            <Link
              to="/login"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaSignInAlt className="w-4 h-4" />
              Đăng nhập lại
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Nếu bạn là admin, vui lòng đăng nhập lại với tài khoản có quyền admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForbidden; 