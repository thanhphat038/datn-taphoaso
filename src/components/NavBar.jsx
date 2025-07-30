import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='w-[50%] flex gap-10'>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors' to="/">Trang chủ</Link> 
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors' to="/product">Sản phẩm</Link>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors' to="/about">Giới thiệu</Link>
      <Link className='text-[20px] font-semibold text-gray-800 hover:text-[#06AEF4] transition-colors' to="/blog">Blog</Link>
    </nav>
  );
};

export default Navbar;