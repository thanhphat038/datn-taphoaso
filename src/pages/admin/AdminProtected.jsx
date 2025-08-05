import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import AdminForbidden from './AdminForbidden.jsx';

const AdminProtected = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const userData = localStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const user = await response.json();
            if (user.data && user.data.role === 'admin') {
              setIsAdmin(true);
              localStorage.setItem('userData', JSON.stringify(user.data));
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06AEF4]"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang kiểm tra quyền truy cập...</h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminForbidden />;
  }

  return children;
};

export default AdminProtected; 