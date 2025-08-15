import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [tokenRefreshCleanup, setTokenRefreshCleanup] = useState(null);

  // Handle token expired events
  const handleTokenExpired = useCallback((event) => {
    console.log('[AuthContext] Token expired event received:', event.detail);
    
    // Clear user state
    setUser(null);
    setIsAuthenticated(false);
    
    // Show notification to user
    if (event.detail?.message) {
      // You can integrate with your toast/notification system here
      console.log('[AuthContext] Token expired message:', event.detail.message);
    }
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  // Handle auth errors
  const handleAuthError = useCallback((error) => {
    console.error('[AuthContext] Auth error:', error);
    
    if (error.message?.includes('Token expired') || 
        error.message?.includes('Authentication failed') ||
        error.message?.includes('Authentication required')) {
      
      // Clear tokens and redirect
      clearSecureTokens();
      setUser(null);
      setIsAuthenticated(false);
      
      // Show user-friendly message
      const message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      console.log('[AuthContext] Auth error message:', message);
      
      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const tryAutoLogin = async () => {
      setLoading(true);
      
      try {
        const secureToken = sessionStorage.getItem('access_token');
        if (!secureToken) {
          // Không có access token, thử refresh
          const newToken = await refreshAccessToken();
          if (newToken) {
            // Sau khi refresh thành công, lấy lại user data từ API
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
      } catch (error) {
        console.error('[AuthContext] Auto login error:', error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          clearSecureTokens();
          setLoading(false);
        }
      }
    };

    tryAutoLogin();
    
    return () => { 
      isMounted = false; 
    };
  }, []);

  // Setup event listeners for token expired
  useEffect(() => {
    // Listen for token expired events
    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    // Listen for unhandled auth errors
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('Authentication')) {
        handleAuthError(event.reason);
      }
    });

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
      window.removeEventListener('unhandledrejection', handleAuthError);
    };
  }, [handleTokenExpired, handleAuthError]);

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
    try {
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
      
      // Setup token refresh and store cleanup function
      const cleanup = setupTokenRefresh();
      setTokenRefreshCleanup(cleanup);
      
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Clear user state
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear tokens
      clearSecureTokens();
      
      // Cleanup token refresh
      if (tokenRefreshCleanup) {
        tokenRefreshCleanup();
        setTokenRefreshCleanup(null);
      }
      
      // Gọi API /logout để backend xóa refresh token ở cookie
      fetch('http://localhost:3000/api/auth/logout', { 
        method: 'POST', 
        credentials: 'include' 
      }).catch(error => {
        console.error('[AuthContext] Logout API error:', error);
      });
      
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    }
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
  const getToken = async () => {
    try {
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Refresh user data từ API
  const refreshUserData = async () => {
    try {
      const token = await getToken();
      if (!token) return null;

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
      
      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  // Force refresh token (for manual refresh)
  const forceRefreshToken = async () => {
    try {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Update user data with new token
        const userData = await refreshUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('[AuthContext] Force refresh error:', error);
      return false;
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
    refreshUserData,
    forceRefreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 