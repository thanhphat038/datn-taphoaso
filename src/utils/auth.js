import Cookies from 'js-cookie';

// Kiểm tra user có đăng nhập hay không
export const isAuthenticated = () => {
  const token = Cookies.get('auth_token');
  return !!token;
};

// Lấy token hiện tại
export const getAuthToken = () => {
  return Cookies.get('auth_token');
};

// Kiểm tra và redirect nếu chưa đăng nhập
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Clear tất cả dữ liệu authentication
export const clearAuthData = () => {
  Cookies.remove('auth_token');
  localStorage.clear();
  sessionStorage.clear();
}; 