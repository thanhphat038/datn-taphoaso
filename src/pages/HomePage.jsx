import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Product from '../components/Product';
import 'swiper/css';

const API_BASE_URL = 'http://localhost:3000/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

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
    <main className='min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20'>

      <div className='max-w-7xl mx-auto px-4 py-8 space-y-12'>

        {/* Hero Banner Section - Giữ đơn giản như ban đầu */}
        <div className='flex gap-0 mb-5'>
          <div className='grow-2'>
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              className='rounded-lg w-full max-w-[860px] mx-auto'
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
            >
              <SwiperSlide>
                <img className='rounded-lg w-full h-[400px] object-cover' src="./images/banner_taphoaso.png" alt="Banner 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-lg w-full h-[400px] object-cover' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="Banner 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img className='rounded-lg w-full h-[400px] object-cover' src="https://amis.misa.vn/wp-content/uploads/2022/07/tim-hieu-tong-quan-chien-luoc-marketing-cua-chocopie.jpg" alt="Banner 3" />
              </SwiperSlide>
            </Swiper>
          </div>
          <div className='grow-1 grid gap-3'>
            <img className='rounded-lg h-[195px] w-full object-cover' src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg" alt="" />
            <img className='rounded-lg h-[195px] w-full object-cover' src="./images/banner_3.png" alt="" />
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
                  </svg>
                  <span className="text-xl font-bold">MÌ ĂN LIỀN</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {getProductsByCategory("684697023d545550b38460cd", 5)}
            </div>

            <div className='mt-8 flex justify-center'>
              <Link
                to="/product?category=684697023d545550b38460cd"
                className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                <span>Xem thêm</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-xl font-bold">NƯỚC UỐNG</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
              {getProductsByCategory("68693d5117edd67c23b67bc1", 5)}
            </div>

            <div className='mt-8 flex justify-center'>
              <Link 
                to="/product?category=68693d5117edd67c23b67bc1" 
                className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
              >
                <span>Xem thêm</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className='mb-5'>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            className='rounded-[30px] w-full max-w-[1250px] mx-auto'
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
          >
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="./images/banner_4.png" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="https://blog.strawberrycstore.com/wp-content/uploads/2019/06/Cocacola1.jpg" alt="Banner 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img className='rounded-[30px] w-full h-[400px] object-cover' src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-thiết-kế-bộ-nhận-diện-mới-logo-Pepsi-22.jpg" alt="Banner 4" />
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <div className='rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 bg-white'>
              <img 
                className='w-full h-[500px] object-cover' 
                src="/images/banner_nuocngot.png" 
                alt="Nước giải khát" 
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nước Giải Khát</h3>
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
            <div className="relative">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-xl font-bold">NƯỚC UỐNG</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {getProductsByCategory("68693d5117edd67c23b67bc1", 3)}
                </div>

                <div className='mt-8 flex justify-center'>
                  <Link 
                    to="/product?category=68693d5117edd67c23b67bc1" 
                    className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    <span>Xem thêm</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-16 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với dịch vụ tốt nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giao Hàng Nhanh</h3>
              <p className="text-gray-600">Giao hàng trong vòng 2-4 giờ</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chất Lượng Cao</h3>
              <p className="text-gray-600">Sản phẩm tươi ngon, đảm bảo vệ sinh</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá Cả Hợp Lý</h3>
              <p className="text-gray-600">Giá cả cạnh tranh, nhiều ưu đãi</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Bảo Mật Thông Tin</h3>
              <p className="text-gray-600">Thông tin cá nhân được bảo vệ an toàn</p>
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

