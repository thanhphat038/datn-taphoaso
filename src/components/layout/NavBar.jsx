import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='w-[50%] flex gap-10'>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors whitespace-nowrap' to="/">Trang chủ</Link> 
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors whitespace-nowrap' to="/product">Sản phẩm</Link>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors whitespace-nowrap' to="/about">Giới thiệu</Link>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors whitespace-nowrap' to="/blog">Blog</Link>
    </nav>
  );
};

export default Navbar;