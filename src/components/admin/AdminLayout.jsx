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
  FaTimes,
  FaCubes,
  FaImages
} from 'react-icons/fa';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, loading, user, logout } = useAdminAuth();

  const menuItems = [
    { path: '/admin', icon: FaHome, label: 'Tổng quan' },
    { path: '/admin/product', icon: FaBox, label: 'Sản phẩm' },
    // { path: '/admin/brand', icon: FaListAlt, label: 'Thương hiệu' },
    { path: '/admin/variant', icon: FaCubes, label: 'Biến thể' },
    { path: '/admin/category', icon: FaListAlt, label: 'Danh mục' },
    { path: '/admin/blogcategory', icon: FaListAlt, label: 'Danh mục Blog' },
    { path: '/admin/banner', icon: FaImages, label: 'Banner' },
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

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => 
      item.path === location.pathname || 
      (item.path !== '/admin' && location.pathname.startsWith(item.path))
    );
    return currentItem?.label || '';
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
        w-72 bg-white shadow-lg flex flex-col h-screen fixed left-0 top-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-18 flex items-center justify-center border-b border-gray-200 relative">
          <NavLink to="/" className="hover:opacity-80 transition-opacity">
            <img src="/images/logo_ngang.png" alt="Logo" className="h-9" />
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute right-4 p-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-5 space-y-1.5 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-5 py-3.5 rounded-lg transition-colors text-sm
                  ${isActive 
                    ? 'bg-[#06AEF4] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="px-5 pb-6 border-t border-gray-200 pt-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm shadow transition-all duration-150"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-72 flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-18 bg-white shadow-sm flex items-center justify-between px-6 lg:px-12 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                {getCurrentPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 hidden lg:block">
                Quản lý hệ thống
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FaChartBar className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user?.username || 'Admin'}
                </div>
                <div className="text-xs text-gray-500">
                  Quản trị viên
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#06AEF4] text-white flex items-center justify-center font-bold text-lg shadow-md">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-12 overflow-auto">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
