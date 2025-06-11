import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdShoppingCart, MdCategory, MdSettings, MdReceipt } from 'react-icons/md';

const HeaderAdmin = () => {
  const sidebarItems = [
    { icon: MdDashboard, text: 'Tổng quát', path: '/admin/dashboard' },
    { icon: MdPeople, text: 'Khách hàng', path: '/admin/user' },
    { icon: MdShoppingCart, text: 'Sản phẩm', path: '/admin/product' },
    { icon: MdCategory, text: 'Danh mục', path: '/admin/category' },
    { icon: MdSettings, text: 'Thuộc tính', path: '/admin/attributes' },
    { icon: MdReceipt, text: 'Đơn hàng', path: '/admin/orders' },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4 flex justify-center">
        <img src="/images/logo_ngang.png" alt="Logo" className="h-8 mb-8" />
      </div>
      <nav className="px-4">
        {sidebarItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`
              }
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.text}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default HeaderAdmin;
