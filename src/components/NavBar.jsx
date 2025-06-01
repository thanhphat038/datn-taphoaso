import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="checkout-navbar w-full bg-white shadow-sm h-16 flex items-center px-8 justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center font-bold text-xl tracking-tight">
          <span className="text-black">TẠP HOÁ</span>
          <span className="ml-1 px-1 bg-blue-500 text-white rounded">SỐ</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-base font-medium">
          <Link to="/" className="checkout-navbar-link">Trang chủ</Link>
          <Link to="/products" className="checkout-navbar-link">Sản phẩm</Link>
          <Link to="/about" className="checkout-navbar-link">Giới thiệu</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input type="text" placeholder="Tìm kiếm ..." className="checkout-navbar-search px-3 py-1.5 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <span className="absolute right-2 top-2 text-gray-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-2-2"/></svg>
          </span>
        </div>
        <button className="checkout-navbar-icon">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>
        <button className="checkout-navbar-icon">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
        </button>
      </div>
    </header>
    <nav className='w-[50%] flex gap-10'>
      <Link className='text-[20px]' to="/">Trang chủ</Link> 
      <Link className='text-[20px]' to="/product">Sản phẩm</Link>
      <Link className='text-[20px]' to="/about">Giới thiệu</Link>
      <Link className='text-[20px]' to="/blog">Blog</Link>
    </nav>
  );
};

export default Navbar;
