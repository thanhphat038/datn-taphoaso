import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, getCurrentUser, setAuthToken, clearAuthToken } from '../utils/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user đã đăng nhập khi component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = getAuthToken();
      // Kiểm tra cả user và userData để đồng bộ
      const userData = getCurrentUser() || JSON.parse(localStorage.getItem('userData') || 'null');
      
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        // Đồng bộ dữ liệu
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        // Clear tất cả dữ liệu
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      // Clear dữ liệu lỗi
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Đồng bộ lưu vào cả 2 nơi
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userData', JSON.stringify(userData));
    // Lưu token nếu có
    if (userData.token) {
      setAuthToken(userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuthToken();
    // Clear tất cả dữ liệu user
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Đồng bộ lưu vào cả 2 nơi
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Kiểm tra quyền admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Lấy token hiện tại
  const getToken = () => {
    return getAuthToken();
  };

  // Refresh user data từ API
  const refreshUserData = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const userData = result.data;
        updateUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    isAdmin,
    getToken,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 