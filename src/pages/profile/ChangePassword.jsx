import React, { useState, useRef, useEffect } from 'react';
import { changePassword } from '../../service/UserService';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Clear any pending state updates
      setLoading(false);
      setError('');
      setSuccess('');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMountedRef.current) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('Vui lòng nhập đầy đủ các trường!');
      setLoading(false);
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      setLoading(false);
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setLoading(false);
      return;
    }
    
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      if (isMountedRef.current) {
        setSuccess('Đổi mật khẩu thành công!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError(error.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#06AEF4] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#06AEF4]">
          Đổi mật khẩu
        </h2>
        <p className="text-gray-600 mt-2">Bảo mật tài khoản của bạn</p>
      </div>

      <form key="change-password-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              key="current-password"
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#06AEF4] focus:ring-4 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white"
              placeholder="Nhập mật khẩu hiện tại"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
             <div className="absolute inset-0 rounded-xl bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* New Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              key="new-password"
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#06AEF4] focus:ring-4 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white"
              placeholder="Nhập mật khẩu mới"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
             <div className="absolute inset-0 rounded-xl bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              key="confirm-password"
              type="password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#06AEF4] focus:ring-4 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white"
              placeholder="Nhập lại mật khẩu mới"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            />
             <div className="absolute inset-0 rounded-xl bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div key="error-message" className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div key="success-message" className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
                 <button
           type="submit"
           className="w-full py-3 px-6 bg-[#06AEF4] text-white rounded-xl font-semibold hover:bg-[#70d9ff] transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
           disabled={loading}
         >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang xử lý...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Đổi mật khẩu
            </div>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Quên mật khẩu?</span>
        </div>
                 <a 
           href="/login" 
           className="text-[#06AEF4] hover:text-[#70d9ff] font-medium hover:underline transition-colors"
         >
           Lấy lại mật khẩu tại trang đăng nhập
         </a>
      </div>
    </div>
  );
};

export default ChangePassword; 