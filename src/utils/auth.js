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

// Lấy user từ localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
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

// Xóa tất cả token
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  Cookies.remove('auth_token');
};

// Tạo headers cho API calls
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 

export const clearAuthData = () => {
  Cookies.remove('auth_token');
  localStorage.clear();
  sessionStorage.clear();
};