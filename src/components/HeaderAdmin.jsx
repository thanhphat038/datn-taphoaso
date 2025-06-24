import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdShoppingCart, MdCategory, MdSettings, MdReceipt, MdCardGiftcard, MdDescription } from 'react-icons/md';
import { FaComments, FaStar } from 'react-icons/fa';

const HeaderAdmin = () => {
  const sidebarItems = [
    { icon: MdDashboard, text: 'Tổng quát', path: '/admin' },
    { icon: MdPeople, text: 'Khách hàng', path: '/admin/user' },
    { icon: MdShoppingCart, text: 'Sản phẩm', path: '/admin/product' },
    { icon: MdCategory, text: 'Danh mục', path: '/admin/category' },
    { icon: MdCardGiftcard, text: 'Voucher', path: '/admin/voucher' },
    { icon: MdReceipt, text: 'Đơn hàng', path: '/admin/order' },
    { icon: MdDescription, text: 'Blog', path: '/admin/blog' },
    { icon: FaComments, text: 'Bình luận', path: '/admin/comment' },
    { icon: FaStar, text: 'Đánh giá', path: '/admin/review' },
  ];

  return (
    <div className="flex flex-col w-64 bg-white shadow-md h-screen">
      <div className="p-4 flex justify-center">
        <img src="/images/logo_ngang.png" alt="Logo" className="h-8 mb-8" />
      </div>
      <nav className="flex flex-col px-4">
        {sidebarItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === '/admin'}
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
