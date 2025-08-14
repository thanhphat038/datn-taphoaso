import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TokenExpiredNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [message, setMessage] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleTokenExpired = (event) => {
      console.log('[TokenExpiredNotification] Token expired event received');
      setMessage(event.detail?.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setShowNotification(true);
    };

    const handleAuthError = (event) => {
      if (event.reason?.message?.includes('Authentication') || 
          event.reason?.message?.includes('Token expired')) {
        setMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setShowNotification(true);
      }
    };

    // Listen for token expired events
    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    // Listen for unhandled auth errors
    window.addEventListener('unhandledrejection', handleAuthError);

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
      window.removeEventListener('unhandledrejection', handleAuthError);
    };
  }, []);

  const handleLogin = () => {
    setShowNotification(false);
    logout();
    navigate('/login');
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">
              Phiên đăng nhập hết hạn
            </h3>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Đóng
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiredNotification;
