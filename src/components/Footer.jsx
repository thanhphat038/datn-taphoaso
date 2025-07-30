import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Truck, 
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                className="h-12 w-auto" 
                src="/images/logo_vuong.png" 
                alt="Tạp Hóa Số Logo" 
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tạp Hóa Số - Nơi cung cấp các sản phẩm tươi ngon, chất lượng cao với dịch vụ giao hàng nhanh chóng và tiện lợi.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/product" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Blog & Tin tức
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Giỏ hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Đường ABC, Quận XYZ<br />
                  TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a 
                  href="tel:0859499579" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  0859499579
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:taphoaso@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  taphoaso@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter & Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Đăng ký nhận tin</h3>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
              >
                Đăng ký
              </button>
            </form>

            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Chính sách khách hàng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Chính sách giao hàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Phương thức thanh toán:</span>
              <div className="flex space-x-2">
                <img 
                  src="/images/image 16.png" 
                  alt="Payment Method 1" 
                  className="h-8 w-auto"
                />
                <img 
                  src="/images/image 20.png" 
                  alt="Payment Method 2" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 Tạp Hóa Số. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
};

export default Footer;