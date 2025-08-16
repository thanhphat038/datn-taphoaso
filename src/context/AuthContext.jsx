import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, getCurrentUser, setAuthToken, clearAuthToken } from '../utils/auth';
import { 
  setSecureTokens, 
  getAccessToken, 
  getSecureUserData, 
  clearSecureTokens, 
  isAuthenticated as isSecureAuthenticated,
  isAuthenticatedAsync as isSecureAuthenticatedAsync,
  isTokenValid,
  setupTokenRefresh,
  checkAuthRateLimit,
  clearAuthRateLimit,
  refreshAccessToken
} from '../utils/secureAuth';
import Cookies from 'js-cookie';
import { getApiUrl } from '../config/api.js';

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
    let isMounted = true;
    const tryAutoLogin = async () => {
      setLoading(true);
      const secureToken = sessionStorage.getItem('access_token');
      if (!secureToken) {
        // Không có access token, thử refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Sau khi refresh thành công, lấy lại user data từ API thay vì sessionStorage
          const userData = await refreshUserData();
          if (isMounted && userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            clearSecureTokens();
          }
        } else if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          clearSecureTokens();
        }
        if (isMounted) setLoading(false);
        return;
      }
      // Nếu có access token, kiểm tra như cũ
      checkAuthStatus();
      if (isMounted) setLoading(false);
    };
    tryAutoLogin();
    return () => { isMounted = false; };
  }, []);

  const checkAuthStatus = () => {
    try {
      // Use secure authentication first
      const isSecureAuth = isSecureAuthenticated();
      const secureUserData = getSecureUserData();
      
      if (isSecureAuth && secureUserData) {
        setUser(secureUserData);
        setIsAuthenticated(true);
        return;
      }
      
      // Nếu không có secure, coi như chưa đăng nhập
      setUser(null);
      setIsAuthenticated(false);
      clearSecureTokens();
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
      clearSecureTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    // Rate limiting check
    const identifier = userData.username || userData.email || 'unknown';
    if (!checkAuthRateLimit(identifier)) {
      throw new Error('Too many login attempts. Please try again later.');
    }
    // Chỉ lưu access token và userData
    if (userData.token) {
      setSecureTokens(userData.token, null, userData);
    }
    setUser(userData);
    setIsAuthenticated(true);
    clearAuthRateLimit(identifier);
    setupTokenRefresh();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearSecureTokens();
    // Gọi API /logout để backend xóa refresh token ở cookie
    fetch('http://localhost:3000/api/auth/logout', { method: 'POST', credentials: 'include' });
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Update secure storage
    setSecureTokens(null, null, userData);
  };

  // Kiểm tra quyền admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Lấy token hiện tại
  const getToken = () => {
    try {
      const secureToken = sessionStorage.getItem('access_token');
      if (secureToken && isTokenValid(secureToken)) {
        return secureToken;
      }
      return getAuthToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return getAuthToken();
    }
  };

  // Refresh user data từ API
  const refreshUserData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(getApiUrl('/auth/profile'), {
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
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          return refreshUserData(); // Retry with new token
        }
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