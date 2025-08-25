import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Product from '../components/Product';
import 'swiper/css';

import { getApiUrl } from '../config/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import RecentlyViewed from '../components/RecentlyViewed.jsx';

const API_BASE_URL = getApiUrl('');

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách sản phẩm: ' + error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  // Hàm lấy danh sách các category_id đang có trong dữ liệu sản phẩm
  const getAllCategoryIds = () => {
    // Lấy ra mảng các id danh mục duy nhất từ products
    return Array.from(new Set(products.map(p => p.category_id)));
  };

  // Hàm lọc sản phẩm theo id danh mục
  const getProductsByCategory = (categoryId, limit = 5) => {
    if (loading) {
      // Hiển thị skeleton loading
      return Array.from({ length: limit }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
          <div className="bg-gray-200 h-4 rounded mb-1"></div>
          <div className="bg-gray-200 h-4 rounded w-2/3"></div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-600">Không thể tải sản phẩm</p>
        </div>
      );
    }

    // Lọc sản phẩm theo id danh mục (so sánh chuỗi)
    const filteredProducts = products.filter(product => product.category_id === categoryId);

    if (filteredProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Không có sản phẩm nào trong danh mục này</p>
        </div>
      );
    }

    // Hàm hiển thị notification
    const showNotification = (message, type = 'success') => {
      setNotification({ show: true, message, type });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, 3000);
    };

    return filteredProducts.slice(0, limit).map((product, index) => (
      <Product 
        key={product._id || index} 
        data={product} 
        onAddToCartSuccess={showNotification}
      />
    ));
  };

  // Log ra các category_id đang có để dev dễ lấy đúng id
  useEffect(() => {
    if (products.length > 0) {
      const ids = getAllCategoryIds();
      console.log('Các category_id đang có:', ids);
    }
  }, [products]);

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8 space-y-16'>

        {/* Hero Banner Section */}
        <div className='flex gap-4 mb-8'>
          <div className='flex-1'>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              className='rounded-xl w-full max-w-[860px] mx-auto'
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
            >
              <SwiperSlide>
                <img className='rounded-xl w-full h-[400px] object-cover' src="./images/banner_taphoaso.png" alt="Banner 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-xl w-full h-[400px] object-cover' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="Banner 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-xl w-full h-[400px] object-cover' src="https://amis.misa.vn/wp-content/uploads/2022/07/tim-hieu-tong-quan-chien-luoc-marketing-cua-chocopie.jpg" alt="Banner 3" />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className='flex-1 grid gap-4'>
            <img className='rounded-xl h-[195px] w-full object-cover' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="" />
            <img className='rounded-xl h-[195px] w-full object-cover' src="./images/banner_3.png" alt="" />
          </div>
        </div>

        {/* Mì Ăn Liền Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Mì Ăn Liền</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            {getProductsByCategory("6898c4e1e39ae6724ca30a11", 5)}
          </div>

          <div className='mt-8 flex justify-center'>
            <Link
              to="/product?category=6898c4e1e39ae6724ca30a11"
              className='inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors'
            >
              <span>Xem thêm</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Nước Uống Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-800">Nước ngọt</h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
            {getProductsByCategory("6898c4e1e39ae6724ca30a0a", 5)}
          </div>

          <div className='mt-8 flex justify-center'>
            <Link 
              to="/product?category=6898c4e1e39ae6724ca30a0a" 
              className='inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors'
            >
              <span>Xem thêm</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Promotional Banner */}
        <div className='mb-8'>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            className='rounded-2xl w-full max-w-[1250px] mx-auto'
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
          >
            <SwiperSlide>
              <img className='rounded-2xl w-full h-[400px] object-cover' src="./images/banner_4.png" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-2xl w-full h-[400px] object-cover' src="https://blog.strawberrycstore.com/wp-content/uploads/2019/06/Cocacola1.jpg" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-2xl w-full h-[400px] object-cover' src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-thiết-kế-bộ-nhận-diện-mới-logo-Pepsi-22.jpg" alt="Banner 4" />
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Recently Viewed Section */}
        <RecentlyViewed limit={10} />

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div className='rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:shadow-md transition-shadow duration-300'>
              <img 
                className='w-full h-[500px] object-cover' 
                src="/images/banner_nuocngot.png" 
                alt="Nước giải khát" 
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Nước Giải Khát</h3>
                <p className="text-gray-600 mb-4">Khám phá các loại nước giải khát tươi mát</p>
                <Link 
                  to="/product?category=68693d5117edd67c23b67bc1" 
                  className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                >
                  <span>Khám phá ngay</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2'>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Kem</h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {getProductsByCategory("6898c4e1e39ae6724ca30a12", 3)}
              </div>

              <div className='mt-8 flex justify-center'>
                <Link 
                  to="/product?category=6898c4e1e39ae6724ca30a12" 
                  className='inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors'
                >
                  <span>Xem thêm</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch vụ tốt nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Giao Hàng Nhanh</h3>
              <p className="text-gray-600 text-sm">Giao hàng trong vòng 2-4 giờ</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Chất Lượng Cao</h3>
              <p className="text-gray-600 text-sm">Sản phẩm tươi ngon, đảm bảo vệ sinh</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Giá Cả Hợp Lý</h3>
              <p className="text-gray-600 text-sm">Giá cả cạnh tranh, nhiều ưu đãi</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🛡️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bảo Mật Thông Tin</h3>
              <p className="text-gray-600 text-sm">Thông tin cá nhân được bảo vệ an toàn</p>
            </div>
          </div>
        </section>

      </div>

      {/* Custom Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
          notification.type === 'success' ? 'border-green-500' : 'border-red-500'
        } transform transition-all duration-300 ease-in-out`}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg key="success-icon" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg key="error-icon" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className={`text-sm font-medium ${
                  notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {notification.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className={`inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150`}
                  onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                >
                  <svg key="close-icon" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </main>
  );
};

export default HomePage;