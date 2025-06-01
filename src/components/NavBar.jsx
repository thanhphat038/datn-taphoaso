import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='w-[50%] flex gap-10'>
      <Link className='text-[20px]' to="/">Trang chủ</Link> 
      <Link className='text-[20px]' to="/product">Sản phẩm</Link>
      <Link className='text-[20px]' to="/about">Giới thiệu</Link>
      <Link className='text-[20px]' to="/blog">Blog</Link>
    </nav>
  );
};

export default Navbar;