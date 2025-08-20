import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../service/user.service';
import Cookies from "js-cookie";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset password link or expired.');
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password confirmation does not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    if (!token) {
      setError('Invalid reset password link or expired.');
      return;
    }
    setLoading(true);
    try {
      console.log('[ResetPasswordPage] Submitting reset password request...');
      console.log('[ResetPasswordPage] Token:', token ? `${token.substring(0, 20)}...` : 'undefined');
      
      await resetPassword({ token, newPassword: formData.newPassword });
      
      console.log('[ResetPasswordPage] Password reset successful');
      setSuccess('Password reset successful! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('[ResetPasswordPage] Reset password error:', err);
      console.error('[ResetPasswordPage] Error message:', err.message);
      
      // Handle specific error types
      if (err.message.includes('Invalid reset token') || err.message.includes('Token is not valid')) {
        setError('Invalid reset token. Please request a new link.');
      } else if (err.message.includes('expired') || err.message.includes('Token has expired')) {
        setError('Reset token has expired. Please request a new link.');
      } else if (err.message.includes('Invalid data')) {
        setError('Invalid data. Please check your input.');
      } else if (err.message.includes('Server error')) {
        setError('Server error, please try again later.');
      } else if (err.message.includes('Request failed with status code 400')) {
        setError('Invalid reset token or expired. Please request a new link.');
      } else {
        setError(err.message || 'An error occurred while resetting password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Liên kết không hợp lệ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-[#06AEF4] text-white rounded-md font-medium hover:bg-[#0590d8] transition-colors"
            >
              Quay về trang đăng nhập
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 border border-[#06AEF4] text-[#06AEF4] rounded-md font-medium hover:bg-[#06AEF4] hover:text-white transition-colors"
            >
              Yêu cầu link mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
              placeholder="Nhập lại mật khẩu mới"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">Lỗi đặt lại mật khẩu</span>
              </div>
              <p className="mb-3">{error}</p>
              {error.includes('hết hạn') && (
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#06AEF4] hover:underline font-medium"
                >
                  Yêu cầu link mới
                </button>
              )}
            </div>
          )}
          {success && <div className="text-green-600 text-sm text-center p-3 bg-green-50 border border-green-200 rounded-md">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#06AEF4] text-white rounded-md font-medium hover:bg-[#0590d8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đặt lại mật khẩu...
              </div>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 