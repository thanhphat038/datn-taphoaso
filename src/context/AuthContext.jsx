
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
// <<<<<<< fe-payment-vnpay
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
      const userData = getCurrentUser();

      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    // Lưu token nếu có
    if (userData.token) {
      setAuthToken(userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuthToken();
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
// =======
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Kiểm tra authentication status
//   const checkAuthStatus = () => {
//     const token = Cookies.get('auth_token');
//     const userData = localStorage.getItem('user');
    
//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setIsAuthenticated(true);
//         setUser(parsedUser);
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         logout();
//       }
//     } else {
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//     setLoading(false);
//   };

//   // Login function
//   const login = (userData, token) => {
//     Cookies.set('auth_token', token, { expires: 7 });
//     localStorage.setItem('user', JSON.stringify(userData));
//     setIsAuthenticated(true);
//     setUser(userData);
    
//     // Dispatch login event
//     window.dispatchEvent(new CustomEvent('user-login', { detail: userData }));
//   };

//   // Logout function
//   const logout = () => {
//     // Clear all data
//     Cookies.remove('auth_token');
//     localStorage.clear();
//     sessionStorage.clear();
    
//     // Reset state
//     setIsAuthenticated(false);
//     setUser(null);
    
//     // Dispatch logout event
//     window.dispatchEvent(new CustomEvent('user-logout'));
    
//     // Force reload to reset all components
//     window.location.href = '/login';
//   };

//   // Check auth status on mount and when token changes
//   useEffect(() => {
//     checkAuthStatus();
    
//     // Listen for storage changes (when user logs in/out in another tab)
//     const handleStorageChange = (e) => {
//       if (e.key === 'auth_token' || e.key === 'user') {
//         checkAuthStatus();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
    
//     // Listen for custom events
//     const handleUserLogin = () => checkAuthStatus();
//     const handleUserLogout = () => {
//       setIsAuthenticated(false);
//       setUser(null);
//     };

//     window.addEventListener('user-login', handleUserLogin);
//     window.addEventListener('user-logout', handleUserLogout);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('user-login', handleUserLogin);
//       window.removeEventListener('user-logout', handleUserLogout);
//     };
//   }, []);

//   const value = {
//     isAuthenticated,
//     user,
//     loading,
//     login,
//     logout,
// >>>>>>> dev
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 