import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AlertProvider } from './components/AlertProvider';
import { ToastProvider } from './components/ToastContainer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Checkout from './pages/checkout/Checkout';
import SelectAddress from './pages/checkout/SelectAddress';
import PaymentSuccess from './pages/checkout/PaymentSuccess';
import PaymentProcessing from './pages/checkout/PaymentProcessing';
import PaymentWaiting from './pages/checkout/PaymentWaiting';
import VNPayReturn from './pages/checkout/VNPayReturn';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import Footer from './components/Footer';

import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

import OrderDetailPage from './pages/OrderDetailPage';

import ProductsPage from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AdminUser from './pages/admin/AdminUser';
import AdminProduct from './pages/admin/AdminProduct';
import AdminCategory from './pages/admin/AdminCategory';
import ProductsSearch from './pages/ProductsSearch';

import { CartProvider, CartContext } from './context/CartContext';

import CheckoutGuard from './components/CheckoutGuard';
import ProtectedRoute from './components/ProtectedRoute';
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
import AdminProtected from './components/admin/AdminProtected';

function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const noFooterRoutes = ['/checkout', '/select-address', '/checkout/payment/processing', '/checkout/payment/success', '/checkout/payment/waiting', '/checkout/payment/vnpay_return'];

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
              <Route path="/profile/*" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/order/:id" element={<OrderDetailPage />} />
              <Route path="/checkout" element={
                <CheckoutGuard>
                  <Checkout />
                </CheckoutGuard>
              } />
              <Route path="/select-address" element={
                <CheckoutGuard>
                  <SelectAddress />
                </CheckoutGuard>
              } />
              <Route path="/checkout/payment/success" element={<PaymentSuccess />} />
              <Route path="/checkout/payment/processing" element={<PaymentProcessing />} />
              <Route path="/checkout/payment/waiting" element={<PaymentWaiting />} />
              <Route path="/checkout/payment/vnpay_return" element={<VNPayReturn />} />
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
        <AdminProtected>
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
            <Route path="/admin/addblog/:id" element={<AddBlog />} />
            <Route path="/admin/blog/detail/:id" element={<AdminBlogDetail />} />
            <Route path="/admin/comment" element={<AdminComment />} />
            <Route path="/admin/review" element={<AdminReview />} />
            <Route path="/admin/detailproduct/:id" element={<DetailProduct />} />
          </Routes>
        </AdminProtected>
      )}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <CartProvider>
            <Layout />
          </CartProvider>
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
