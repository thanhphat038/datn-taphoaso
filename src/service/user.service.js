import axios from "axios";
import { getAuthToken, setAuthToken, clearAuthData, syncUserData } from "../utils/auth.js";
import { getApiUrl, getAuthHeaders } from '../config/api.js';

const AUTH_API_URL = getApiUrl('/auth');
const BASE_URL = getApiUrl('');

export async function registerUser({ username, email, password }) {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, { username, email, password }, {
      withCredentials: true // Đảm bảo gửi và nhận cookies
    });
    const { token } = response.data.data;
    
    if (token) {
      setAuthToken(token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

export async function loginUser({ username, password }) {
  try {
    console.log('🔍 Login attempt for:', username);
    
    const response = await axios.post(`${AUTH_API_URL}/login`, { username, password }, {
      withCredentials: true // Đảm bảo gửi và nhận cookies
    });
    console.log('📥 Login response:', response.data);
    
    // Kiểm tra cấu trúc response và lấy token an toàn
    let token = null;
    let user = null;
    
    // Thử các cấu trúc response khác nhau
    if (response.data && response.data.data && response.data.data.token) {
      token = response.data.data.token;
      user = response.data.data.user || response.data.user;
    } else if (response.data && response.data.token) {
      token = response.data.token;
      user = response.data.user;
    } else if (response.data && response.data.data && response.data.data.user) {
      user = response.data.data.user;
      // Có thể token ở nơi khác
      token = response.data.token || response.data.data.token;
    }
    
    console.log('🔑 Token found:', !!token);
    console.log('👤 User found:', !!user);
    
    if (token) {
      setAuthToken(token);
      console.log('✅ Token saved to all sources');
    } else {
      console.warn('⚠️ No token found in response');
    }
    
    // Đồng bộ user data nếu có
    if (user) {
      syncUserData(user);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || error.message || "Đăng nhập thất bại");
  }
}

// Logout function
export function logoutUser() {
  // Clear tất cả dữ liệu authentication
  clearAuthData();
  // Dispatch event để các component khác biết user đã logout
  window.dispatchEvent(new CustomEvent('user-logout'));
  // Force reload trang để reset toàn bộ state và cache
  window.location.href = '/login';
}

// Profile management
export async function getProfile() {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.get(`${AUTH_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy thông tin profile thất bại");
  }
}

export async function updateProfile(userData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    // Check if userData is FormData (for file upload)
    const isFormData = userData instanceof FormData;
    
    const headers = { 
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    };
    
    const response = await axios.patch(`${AUTH_API_URL}/profile`, userData, { headers });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật profile thất bại");
  }
}

// Change password
export async function changePassword(currentPassword, newPassword) {
  try {
    console.log('🔑 [changePassword] Starting password change...');
    const token = getAuthToken();
    console.log('🔑 [changePassword] Token found:', !!token);
    
    if (!token) throw new Error("No auth token found");
    
    console.log('📡 [changePassword] Making API request to:', `${AUTH_API_URL}/change-password`);
    console.log('📡 [changePassword] Request data:', { currentPassword: '***', newPassword: '***' });
    
    const response = await axios.put(`${AUTH_API_URL}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ [changePassword] API response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [changePassword] Error occurred:', error);
    console.error('❌ [changePassword] Error response:', error.response?.data);
    console.error('❌ [changePassword] Error status:', error.response?.status);
    throw new Error(error.response?.data?.message || "Đổi mật khẩu thất bại");
  }
}

// Reset password request
export async function requestPasswordReset({ email }) {
  try {
    console.log('[requestPasswordReset] Requesting password reset for email:', email);
    const response = await axios.post(`${AUTH_API_URL}/forgot-password`, { email });
    console.log('[requestPasswordReset] Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('[requestPasswordReset] Error:', error);
    console.error('[requestPasswordReset] Error response:', error.response?.data);
    
    // Xử lý các loại lỗi cụ thể
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy tài khoản với email này');
    } else if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Email không hợp lệ';
      throw new Error(message);
    } else if (error.response?.status === 500) {
      throw new Error('Lỗi server, vui lòng thử lại sau');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Không thể kết nối đến server, vui lòng kiểm tra kết nối mạng');
    } else {
      const message = error.response?.data?.message || error.message || 'Gửi yêu cầu reset mật khẩu thất bại';
      throw new Error(message);
    }
  }
}

// Reset password with token
export async function resetPassword({ token, newPassword }) {
  try {
    console.log(token)
    console.log(newPassword)
    const response = await axios.post(`${AUTH_API_URL}/reset-password`, {
      token,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    console.error('[resetPassword] Error:', error);
    console.error('[resetPassword] Error response:', error.response?.data);
    console.error('[resetPassword] Error status:', error.response?.status);
    console.error('[resetPassword] Error message:', error.message);
    
    // Handle specific error types
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.message || 'Invalid data';
      
      // Handle specific error messages from backend
      if (errorMessage.includes('Invalid reset token')) {
        throw new Error('Invalid reset token');
      } else if (errorMessage.includes('expired')) {
        throw new Error('Reset token has expired');
      } else if (errorMessage.includes('Token is not valid')) {
        throw new Error('Token is not valid for this user');
      } else {
        throw new Error(errorMessage);
      }
    } else if (error.response?.status === 401) {
      throw new Error('Invalid or expired token');
    } else if (error.response?.status === 500) {
      throw new Error('Server error, please try again later');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server, please check your network connection');
    } else {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      throw new Error(message);
    }
  }
}

// Clear reset token (để test)
export async function clearResetToken({ email }) {
  try {
    console.log('[clearResetToken] Clearing reset token for email:', email);
    const response = await axios.post(`${AUTH_API_URL}/clear-reset-token`, { email });
    console.log('[clearResetToken] Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('[clearResetToken] Error:', error);
    throw new Error(error.response?.data?.message || "Xóa token reset thất bại");
  }
}

// Verify email
export async function verifyEmail({ token }) {
  try {
    const response = await axios.post(`${AUTH_API_URL}/verify-email`, { token });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Xác thực email thất bại");
  }
}

// Resend verification email
export async function resendVerificationEmail({ email }) {
  try {
    const response = await axios.post(`${AUTH_API_URL}/resend-verification`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gửi lại email xác thực thất bại");
  }
}

// Get user by ID (admin only)
export async function getUserById(userId) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy thông tin user thất bại");
  }
}

// Update user by ID (admin only)
export async function updateUserById(userId, userData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.patch(`${BASE_URL}/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật user thất bại");
  }
}

// Delete user by ID (admin only)
export async function deleteUserById(userId) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Xóa user thất bại");
  }
}

// Get all users (admin only)
export async function getAllUsers(params = {}) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy danh sách users thất bại");
  }
}

// Address management
export async function getAddresses() {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.get(`${BASE_URL}/addresses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy danh sách địa chỉ thất bại");
  }
}

export async function createAddress(addressData) {
  try {
    const token = getAuthToken();
if (!token) throw new Error("No auth token found");
    
    const response = await axios.post(`${BASE_URL}/addresses`, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Thêm địa chỉ thất bại");
  }
}

export async function updateAddress(id, addressData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.put(`${BASE_URL}/addresses/${id}`, addressData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật địa chỉ thất bại");
  }
}

export async function deleteAddress(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    
    await axios.delete(`${BASE_URL}/addresses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Xóa địa chỉ thất bại");
  }
}



export async function deleteUser(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    await axios.delete(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Xóa người dùng thất bại");
  }
}

export async function toggleUserStatus(id, status) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    const response = await axios.put(`${BASE_URL}/users/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật trạng thái người dùng thất bại");
  }
}

export async function fetchUsers(token) {
  const response = await fetch(`${BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const result = await response.json();
  return result.data || [];
}





export async function getMyOrders(page = 1, limit = 10) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    const response = await axios.get(`${BASE_URL}/orders/my?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy danh sách đơn hàng thất bại");
  }
}

export async function createReview(data) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    const response = await axios.post(`${BASE_URL}/reviews`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Tạo đánh giá thất bại");
  }
}