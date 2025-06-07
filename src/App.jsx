import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
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
import ProductsSearch from './pages/ProductsSearch';

import { CartProvider } from './context/CartContext';

function App() {
  return (

    <CartProvider>
      <Router>
        <div className="App w-full">
          <Header></Header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/order/:id" element={<OrderDetailPage />} />
          
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/select-address" element={<SelectAddress />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/blog" element={<BlogPage/>} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
          </Routes>
          <Footer></Footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
