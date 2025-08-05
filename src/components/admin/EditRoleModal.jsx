import React, { useState, useEffect } from 'react';
import { FaUserShield, FaUser, FaCrown } from 'react-icons/fa';

const EditRoleModal = ({ isOpen, onClose, user, onSave, loading }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'user');

  // Update selectedRole when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role || 'user');
    }
  }, [user]);

  const roleOptions = [
    {
      value: 'user',
      label: 'Người dùng',
      description: 'Quyền truy cập cơ bản',
      icon: FaUser,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      value: 'admin',
      label: 'Quản trị viên',
      description: 'Quyền quản trị toàn bộ hệ thống',
      icon: FaCrown,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const handleSave = () => {
    onSave(selectedRole);
  };

  const handleClose = () => {
    setSelectedRole(user?.role || 'user');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center">
              <FaUserShield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa vai trò</h3>
              <p className="text-sm text-gray-500">Thay đổi quyền hạn người dùng</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.username || 'Không có tên'}</div>
              <div className="text-sm text-gray-500">ID: {user?._id}</div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn vai trò mới
            </label>
            {roleOptions.map((role) => (
              <div
                key={role.value}
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRole === role.value
                    ? 'border-[#06AEF4] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole(role.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedRole === role.value ? 'bg-[#06AEF4] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <role.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{role.label}</div>
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </div>
                  {selectedRole === role.value && (
                    <div className="w-5 h-5 bg-[#06AEF4] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          {selectedRole === 'admin' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-yellow-800 font-medium">
                  Cảnh báo: Quyền admin có thể truy cập toàn bộ hệ thống
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={loading || selectedRole === user?.role}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              loading || selectedRole === user?.role
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#06AEF4] text-white hover:bg-[#0590d8]'
            }`}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal; 