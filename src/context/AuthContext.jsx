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
    // Kiểm tra user đã đăng nhập khi component mount
    checkAuthStatus();
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
      
      // Fallback to legacy authentication
      const token = getAuthToken();
      const userData = getCurrentUser() || JSON.parse(localStorage.getItem('userData') || 'null');
      
      if (token && userData) {
        // Migrate to secure storage
        setSecureTokens(token, null, userData);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearSecureTokens();
      }
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
    
    // Use secure token storage
    if (userData.token) {
      setSecureTokens(userData.token, userData.refreshToken, userData);
    }
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Clear rate limit on successful login
    clearAuthRateLimit(identifier);
    
    // Setup token refresh
    setupTokenRefresh();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearSecureTokens();
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