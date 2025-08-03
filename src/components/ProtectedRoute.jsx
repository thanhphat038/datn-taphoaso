import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('auth_token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        console.log('🚫 ProtectedRoute: No authentication found');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate(redirectTo);
        return false;
      }
      
      try {
        const user = JSON.parse(userData);
        if (!user.username) {
          console.log('🚫 ProtectedRoute: Invalid user data');
          setIsAuthenticated(false);
          setIsLoading(false);
          navigate(redirectTo);
          return false;
        }
        
        console.log('✅ ProtectedRoute: User authenticated:', user.username);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } catch (error) {
        console.log('🚫 ProtectedRoute: Error parsing user data');
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate(redirectTo);
        return false;
      }
    };
    
    // Check immediately
    if (!checkAuth()) return;
    
    // Set up interval to check periodically
    const authCheckInterval = setInterval(checkAuth, 5000);
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [navigate, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để truy cập trang này</p>
          <button
            onClick={() => navigate(redirectTo)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute; 