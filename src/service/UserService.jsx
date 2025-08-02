import axios from "axios";
import Cookies from "js-cookie";
import { clearAuthData } from "../utils/auth";
const API_URL = "http://localhost:3000/api/auth";
const BASE_URL = "http://localhost:3000/api";

export async function registerUser({ username, email, password }) {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    const { token } = response.data.data;
    
    if (token) {
      Cookies.set("auth_token", token, { expires: 7 });
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

export async function loginUser({ username, password }) {
  try {
    console.log('🔍 Login attempt for:', username);
    
    const response = await axios.post(`${API_URL}/login`, { username, password });
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
      Cookies.set("auth_token", token, { expires: 7 });
      console.log('✅ Token saved to cookies');
    } else {
      console.warn('⚠️ No token found in response');
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
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Lấy thông tin profile thất bại");
  }
}

export async function updateProfile(userData) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    
    // Check if userData is FormData (for file upload)
    const isFormData = userData instanceof FormData;
    
    const headers = { 
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    };
    
    const response = await axios.patch(`${API_URL}/profile`, userData, { headers });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật profile thất bại");
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    
    const response = await axios.put(`${API_URL}/change-password`, 
      { currentPassword, newPassword }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đổi mật khẩu thất bại");
  }
}

// Address management
export async function getAddresses() {
  try {
    const token = Cookies.get("auth_token");
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
    const token = Cookies.get("auth_token");
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
    const token = Cookies.get("auth_token");
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
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    
    await axios.delete(`${BASE_URL}/addresses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Xóa địa chỉ thất bại");
  }
}

export async function updateUser(id, userData) {
  try {
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    const response = await axios.put(`${BASE_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật người dùng thất bại");
  }
}

export async function deleteUser(id) {
  try {
    const token = Cookies.get("auth_token");
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
    const token = Cookies.get("auth_token");
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

export async function forgotPassword(email) {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu');
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
  }
}

export async function getMyOrders(page = 1, limit = 10) {
  try {
    const token = Cookies.get("auth_token");
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
    const token = Cookies.get("auth_token");
    if (!token) throw new Error("No auth token found");
    const response = await axios.post(`${BASE_URL}/reviews`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Tạo đánh giá thất bại");
  }
}