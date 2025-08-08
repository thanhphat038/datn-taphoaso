import Cookies from 'js-cookie';

// Lấy token từ cookie
export const getAuthToken = () => {
  return Cookies.get('auth_token') || '';
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Lấy user từ sessionStorage
export const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from sessionStorage:', error);
    return null;
  }
};

// Lưu token vào cookie
export const setAuthToken = (token) => {
  if (token) {
    Cookies.set('auth_token', token, { expires: 7 });
  }
};

// Xóa user data khỏi sessionStorage
export const clearAuthToken = () => {
  Cookies.remove('auth_token');
  sessionStorage.removeItem('user_data');
};

// Tạo headers cho API calls
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Clear tất cả dữ liệu auth
export const clearAuthData = () => {
  Cookies.remove('auth_token');
  localStorage.clear();
  sessionStorage.clear();
};

// Đồng bộ user data giữa các nguồn
export const syncUserData = (userData) => {
  if (userData) {
    sessionStorage.setItem('user_data', JSON.stringify(userData));
  }
};