import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBox, 
  FaUsers, 
  FaListAlt, 
  FaShoppingCart, 
  FaTicketAlt,
  FaComments,
  FaStar,
  FaBlog,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, loading, user, logout } = useAdminAuth();

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Tổng quan' },
    { path: '/admin/product', icon: FaBox, label: 'Sản phẩm' },
    { path: '/admin/category', icon: FaListAlt, label: 'Danh mục' },
    { path: '/admin/user', icon: FaUsers, label: 'Khách hàng' },
    { path: '/admin/order', icon: FaShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/voucher', icon: FaTicketAlt, label: 'Voucher' },
    { path: '/admin/comment', icon: FaComments, label: 'Bình luận' },
    { path: '/admin/review', icon: FaStar, label: 'Đánh giá' },
    { path: '/admin/blog', icon: FaBlog, label: 'Blog' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-80 bg-white shadow-lg flex flex-col h-screen fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 relative">
          <img src="/images/logo_ngang.png" alt="Logo" className="h-10" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        {/* Navigation */}
        <nav className="p-6 space-y-2 flex-1 ">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-5 rounded-xl transition-colors text-base
                ${isActive 
                  ? 'bg-[#06AEF4] text-white' 
                  : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        {/* Logout Button */}
        <div className="px-6 pb-8 border-t border-gray-200 pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold shadow transition-all duration-150"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="lg:ml-80 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-4 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              {menuItems.find(item => 
                item.path === location.pathname || 
                (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.label || ''}
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-gray-600 hover:text-gray-800">
              <FaChartBar className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#06AEF4] text-white flex items-center justify-center font-bold text-lg">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-10 overflow-auto">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
