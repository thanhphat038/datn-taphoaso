import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Kiểm tra từ localStorage trước
        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAdmin(user.role === 'admin');
          setLoading(false);
          return;
        }

        // Nếu không có trong localStorage, kiểm tra từ API
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          const userData = result.data;
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
          
          // Lưu vào localStorage
          localStorage.setItem('userData', JSON.stringify(userData));
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const logout = () => {
    Cookies.remove('auth_token');
    localStorage.removeItem('userData');
    setIsAdmin(false);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUserData = async () => {
    try {
      const token = Cookies.get('auth_token');
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
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return {
    isAdmin,
    loading,
    user,
    logout,
    refreshUserData
  };
}; 