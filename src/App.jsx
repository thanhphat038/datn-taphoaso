import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Router>
      <div className="App w-full">
        <Header></Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        
        </Routes>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
