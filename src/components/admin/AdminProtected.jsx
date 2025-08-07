import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminForbidden from './AdminForbidden';

const AdminProtected = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  // Show loading state
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

  // Check if user is authenticated and is admin
  if (!isAuthenticated || !isAdmin()) {
    return <AdminForbidden />;
  }

  return children;
};

export default AdminProtected; 