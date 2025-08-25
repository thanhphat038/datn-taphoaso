import React, { useState, useEffect } from 'react';
import { changePassword } from '../../service/user.service';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
      feedback.push('Đủ 8 ký tự');
    } else {
      feedback.push('Cần ít nhất 8 ký tự');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push('Có chữ thường');
    } else {
      feedback.push('Cần chữ thường');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push('Có chữ hoa');
    } else {
      feedback.push('Cần chữ hoa');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push('Có số');
    } else {
      feedback.push('Cần số');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push('Có ký tự đặc biệt');
    } else {
      feedback.push('Cần ký tự đặc biệt');
    }

    return { score, feedback };
  };

  // Update password strength when new password changes
  useEffect(() => {
    if (passwords.newPassword) {
      const strength = checkPasswordStrength(passwords.newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [passwords.newPassword]);

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getStrengthColor = (score) => {
    if (score <= 2) return 'text-red-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStrengthText = (score) => {
    if (score <= 2) return 'Yếu';
    if (score <= 3) return 'Trung bình';
    if (score <= 4) return 'Khá';
    return 'Mạnh';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Form submitted');
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log('📝 Form data:', {
      currentPassword: passwords.currentPassword ? '***' : 'empty',
      newPassword: passwords.newPassword ? '***' : 'empty',
      confirmPassword: passwords.confirmPassword ? '***' : 'empty',
      strength: passwordStrength.score
    });
    
    try {
      // Enhanced validation
      console.log('🔍 Starting validation...');
      
      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
        console.log('❌ Validation failed: Empty fields');
        setError('Vui lòng nhập đầy đủ các trường!');
        setLoading(false);
        return;
      }

      // Kiểm tra độ dài mật khẩu hiện tại
      if (passwords.currentPassword.length < 6) {
        console.log('❌ Validation failed: Current password too short');
        setError('Mật khẩu hiện tại phải có ít nhất 6 ký tự!');
        setLoading(false);
        return;
      }

      // Kiểm tra độ dài mật khẩu mới (thống nhất với password strength checker)
      if (passwords.newPassword.length < 8) {
        console.log('❌ Validation failed: New password too short');
        setError('Mật khẩu mới phải có ít nhất 8 ký tự!');
        setLoading(false);
        return;
      }

      if (passwordStrength.score < 3) {
        console.log('❌ Validation failed: Password strength too weak');
        setError('Mật khẩu mới không đủ mạnh. Vui lòng cải thiện độ mạnh mật khẩu!');
        setLoading(false);
        return;
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        console.log('❌ Validation failed: Passwords do not match');
        setError('Mật khẩu xác nhận không khớp!');
        setLoading(false);
        return;
      }

      if (passwords.currentPassword === passwords.newPassword) {
        console.log('❌ Validation failed: New password same as current');
        setError('Mật khẩu mới phải khác mật khẩu hiện tại!');
        setLoading(false);
        return;
      }
      
      console.log('✅ All validations passed, calling API...');
      
      console.log('📡 Calling changePassword API...');
      const result = await changePassword(passwords.currentPassword, passwords.newPassword);
      console.log('✅ API response:', result);
      
      console.log('✅ Setting success state...');
      setSuccess('Đổi mật khẩu thành công!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ currentPassword: false, newPassword: false, confirmPassword: false });
      setPasswordStrength({ score: 0, feedback: [] });
      console.log('✅ Success state set');
      
    } catch (error) {
      console.error('❌ Change password error:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // Cải thiện xử lý lỗi
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
      console.log('❌ Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#06AEF4] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#06AEF4]">
          Đổi mật khẩu
        </h2>
        <p className="text-gray-600 mt-1 text-sm">Bảo mật tài khoản của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showPasswords.currentPassword ? "text" : "password"}
              className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white text-sm ${
                passwords.currentPassword && passwords.currentPassword.length < 6 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-[#06AEF4]'
              }`}
              placeholder="Nhập mật khẩu hiện tại"
              value={passwords.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('currentPassword')}
            >
              {showPasswords.currentPassword ? <FaEyeSlash className="h-4 w-4 text-gray-500" /> : <FaEye className="h-4 w-4 text-gray-500" />}
            </span>
            <div className="absolute inset-0 rounded-lg bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {/* Validation feedback for current password */}
          {passwords.currentPassword && passwords.currentPassword.length < 6 && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <FaTimes className="w-3 h-3" />
              <span>Mật khẩu hiện tại phải có ít nhất 6 ký tự</span>
            </div>
          )}
        </div>

        {/* New Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.newPassword ? "text" : "password"}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#06AEF4] focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white text-sm"
              placeholder="Nhập mật khẩu mới"
              value={passwords.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('newPassword')}
            >
              {showPasswords.newPassword ? <FaEyeSlash className="h-4 w-4 text-gray-500" /> : <FaEye className="h-4 w-4 text-gray-500" />}
            </span>
            <div className="absolute inset-0 rounded-lg bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {/* Password Strength Indicator */}
          {passwords.newPassword && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Độ mạnh mật khẩu:</span>
                <span className={`text-xs font-semibold ${getStrengthColor(passwordStrength.score)}`}>
                  {getStrengthText(passwordStrength.score)}
                </span>
              </div>
              
              {/* Strength Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? 'bg-red-500' :
                    passwordStrength.score <= 3 ? 'bg-yellow-500' :
                    passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                ></div>
              </div>
              
              {/* Requirements List */}
              <div className="space-y-1">
                {passwordStrength.feedback.map((item, index) => {
                  const isMet = item.startsWith('Có') || item.startsWith('Đủ');
                  return (
                    <div key={index} className="flex items-center gap-1.5 text-xs">
                      {isMet ? (
                        <FaCheck className="text-green-500 w-2.5 h-2.5" />
                      ) : (
                        <FaTimes className="text-red-500 w-2.5 h-2.5" />
                      )}
                      <span className={isMet ? 'text-green-600' : 'text-red-600'}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirmPassword ? "text" : "password"}
              className={`w-full px-3 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4]/20 transition-all duration-300 bg-white text-sm ${
                passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword
                  ? 'border-red-300 focus:border-red-500' 
                  : passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword
                  ? 'border-green-300 focus:border-green-500'
                  : 'border-gray-200 focus:border-[#06AEF4]'
              }`}
              placeholder="Nhập lại mật khẩu mới"
              value={passwords.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              {showPasswords.confirmPassword ? <FaEyeSlash className="h-4 w-4 text-gray-500" /> : <FaEye className="h-4 w-4 text-gray-500" />}
            </span>
            <div className="absolute inset-0 rounded-lg bg-[#06AEF4]/0 group-hover:bg-[#06AEF4]/5 transition-all duration-300 pointer-events-none"></div>
          </div>
          {/* Validation feedback for confirm password */}
          {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <FaTimes className="w-3 h-3" />
              <span>Mật khẩu xác nhận không khớp</span>
            </div>
          )}
          {passwords.confirmPassword && passwords.newPassword === passwords.confirmPassword && passwords.newPassword && (
            <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <FaCheck className="w-3 h-3" />
              <span>Mật khẩu xác nhận khớp</span>
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-700 text-sm font-medium">{success}</p>
                <p className="text-green-600 text-xs mt-1">
                  Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại để đảm bảo an toàn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1 text-xs">Lưu ý bảo mật:</p>
              <ul className="text-xs space-y-0.5 list-disc list-inside">
                <li>Không chia sẻ mật khẩu với người khác</li>
                <li>Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>Không sử dụng thông tin cá nhân trong mật khẩu</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-[#06AEF4] text-white rounded-lg font-semibold hover:bg-[#70d9ff] transform hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          disabled={loading || passwordStrength.score < 3}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang xử lý...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {passwordStrength.score < 3 ? 'Cải thiện mật khẩu trước' : 'Đổi mật khẩu'}
            </div>
          )}
        </button>

        {/* Password Strength Warning */}
        {passwords.newPassword && passwordStrength.score < 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-700 text-xs">
                Mật khẩu cần đạt độ mạnh tối thiểu để tiếp tục
              </span>
            </div>
          </div>
        )}
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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