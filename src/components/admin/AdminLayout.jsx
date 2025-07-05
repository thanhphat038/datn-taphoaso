import React from 'react';
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
  FaChartBar
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200">
          <img src="/images/logo_ngang.png" alt="Logo" className="h-10" />
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-10">
          <h1 className="text-2xl font-bold text-gray-800">
            {menuItems.find(item => 
              item.path === location.pathname || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.label || ''}
          </h1>
          <div className="flex items-center gap-5">
            <button className="text-gray-600 hover:text-gray-800">
              <FaChartBar className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#06AEF4] text-white flex items-center justify-center font-bold text-lg">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10 overflow-auto">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
