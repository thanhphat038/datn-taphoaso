import Cookies from 'js-cookie';

// Lấy token từ tất cả các nguồn có thể
export const getAuthToken = () => {
  return localStorage.getItem('token') || 
         Cookies.get('auth_token') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('accessToken') || 
         '';
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Lấy user từ localStorage - kiểm tra cả user và userData
export const getCurrentUser = () => {
  try {
    // Thử lấy từ user trước, nếu không có thì lấy từ userData
    const userStr = localStorage.getItem('user') || localStorage.getItem('userData');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

// Lưu token vào tất cả các nguồn
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('accessToken', token);
    Cookies.set('auth_token', token, { expires: 7 });
  }
};

// Xóa tất cả token và user data
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userData');
  Cookies.remove('auth_token');
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
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userData', JSON.stringify(userData));
  }
};