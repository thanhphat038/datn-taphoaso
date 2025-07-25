import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Checkout from './pages/checkout/Checkout';
import SelectAddress from './pages/checkout/SelectAddress';
import PaymentSuccess from './pages/checkout/PaymentSuccess';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import Footer from './components/Footer';

import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

import OrderDetailPage from './pages/OrderDetailPage';

import ProductsPage from './pages/products';
import ProductDetail from './pages/ProductDetail';
import AdminUser from './pages/admin/AdminUser';
import AdminProduct from './pages/admin/AdminProduct';
import AdminCategory from './pages/admin/AdminCategory';
import ProductsSearch from './pages/ProductsSearch';

import { CartProvider } from './context/CartContext';
import AddProductPage from './pages/admin/AddProductPage';
import AdminPage from './pages/admin/AdminPage';
import VoucherPage from './pages/admin/VoucherPage';
import AddVoucherPage from './pages/admin/AddVoucherPage';
import OrderPage from './pages/admin/OrderPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AddBlog from './pages/admin/AddBlog';
import AdminBlogDetail from './pages/admin/AdminBlogDetail';
import AdminComment from './pages/admin/AdminComment';
import AdminReview from './pages/admin/AdminReview';
import DetailProduct from './pages/admin/DetailProduct';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const noFooterRoutes = ['/checkout', '/select-address'];

  const showFooter = !isAdminRoute && !noFooterRoutes.includes(location.pathname);

  return (
    <div className="App w-full">
      {!isAdminRoute && (
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product" element={<ProductsPage />} />
              <Route path="/search/:value" element={<ProductsSearch />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile/*" element={<ProfilePage />} />
              <Route path="/order/:id" element={<OrderDetailPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/select-address" element={<SelectAddress />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
          </div>
          {showFooter && <Footer />}
        </div>
      )}
      
      {isAdminRoute && (
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/user" element={<AdminUser />} />
          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/admin/addproduct" element={<AddProductPage />} />
          <Route path="/admin/addproduct/:id" element={<AddProductPage />} />
          <Route path="/admin/category" element={<AdminCategory />} />
          <Route path="/admin/voucher" element={<VoucherPage />} />
          <Route path="/admin/addvoucher" element={<AddVoucherPage />} />
          <Route path="/admin/addvoucher/:id" element={<AddVoucherPage />} />
          <Route path="/admin/order" element={<OrderPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/addblog" element={<AddBlog />} />
          <Route path="/admin/blog/detail/:id" element={<AdminBlogDetail />} />
          <Route path="/admin/comment" element={<AdminComment />} />
          <Route path="/admin/review" element={<AdminReview />} />
          <Route path="/admin/detailproduct/:id" element={<DetailProduct />} />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout />
      </CartProvider>
    </Router>
  );
}

export default App;
