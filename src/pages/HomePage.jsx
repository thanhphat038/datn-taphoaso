import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Product from '../components/Product';
import ProductSkeleton from '../components/ProductSkeleton';

const API_BASE_URL = 'http://localhost:3000/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data || data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
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
        <ProductSkeleton key={index} />
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
    // Log ra để kiểm tra
    // console.log('categoryId:', categoryId);
    // console.log('filteredProducts:', filteredProducts);

    if (filteredProducts.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">Không có sản phẩm nào trong danh mục này</p>
        </div>
      );
    }
    return filteredProducts.slice(0, limit).map((product, index) => (
      <Product key={product._id || index} data={product} />
    ));
  };

  // Log ra các category_id đang có để dev dễ lấy đúng id
  useEffect(() => {
    if (products.length > 0) {
      console.log('Available category IDs:', getAllCategoryIds());
    }
  }, [products]);

  // Category sections with professional styling
  const categorySections = [
    {
      id: "684697023d545550b38460cd",
      title: "Thịt, Cá, Trứng, Hải Sản",
      icon: "🐟",
      description: "Thực phẩm tươi ngon, đảm bảo chất lượng",
      bgGradient: "from-green-50 to-emerald-50",
      titleColor: "text-green-700",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      id: "68693d5117edd67c23b67bc1",
      title: "Nước Uống",
      icon: "🥤",
      description: "Nước giải khát đa dạng, tươi mát",
      bgGradient: "from-blue-50 to-cyan-50",
      titleColor: "text-blue-700",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      id: "684697023d545550b38460cd", // Using same ID for demo
      title: "Mì Ăn Liền",
      icon: "🍜",
      description: "Mì ăn liền tiện lợi, đa dạng hương vị",
      bgGradient: "from-orange-50 to-amber-50",
      titleColor: "text-orange-700",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Banner */}
            <div className="lg:col-span-2">
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                <SwiperSlide>
                  <div className="relative">
                    <img
                      className="w-full h-64 lg:h-80 object-cover"
                      src="./images/banner_taphoaso.png"
                      alt="Banner 1"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2">Tạp Hóa Online</h2>
                      <p className="text-lg">Thực phẩm tươi ngon, giao hàng nhanh chóng</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative">
                    <img
                      className="w-full h-64 lg:h-80 object-cover"
                      src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg"
                      alt="Banner 2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2">Ưu Đãi Đặc Biệt</h2>
                      <p className="text-lg">Giảm giá lên đến 50% cho khách hàng mới</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative">
                    <img
                      className="w-full h-64 lg:h-80 object-cover"
                      src="https://amis.misa.vn/wp-content/uploads/2022/07/tim-hieu-tong-quan-chien-luoc-marketing-cua-chocopie.jpg"
                      alt="Banner 3"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2">Chất Lượng Cao</h2>
                      <p className="text-lg">Cam kết chất lượng, an toàn vệ sinh thực phẩm</p>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            
            {/* Side Banners */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  className="w-full h-32 lg:h-36 object-cover"
                  src="https://www.mihaohao.vn/wp-content/uploads/2024/04/2803HH-Sum24-KV-Horizontal-copy.jpg"
                  alt="Promo 1"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  className="w-full h-32 lg:h-36 object-cover"
                  src="./images/banner_3.png"
                  alt="Promo 2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categorySections.map((section, index) => (
          <section key={index} className={`mb-12 bg-gradient-to-r ${section.bgGradient} rounded-3xl p-8 shadow-lg`}>
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-4xl">{section.icon}</span>
                <h2 className={`text-3xl font-bold ${section.titleColor}`}>
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {section.description}
              </p>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-fr">
              {getProductsByCategory(section.id, 5)}
            </div>
            
            {/* View More Button */}
            <div className="text-center mt-8">
              <Link
                to={`/product?category=${section.id}`}
                className={`inline-flex items-center gap-2 px-8 py-4 ${section.buttonColor} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                Xem thêm
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        ))}

        {/* Promotional Banner Section */}
        <section className="mb-12">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <SwiperSlide>
              <div className="relative">
                <img
                  className="w-full h-48 lg:h-64 object-cover"
                  src="./images/banner_4.png"
                  alt="Promo Banner 1"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Khuyến Mãi Đặc Biệt</h3>
                  <p className="text-lg">Giảm giá lên đến 30% cho tất cả sản phẩm</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative">
                <img
                  className="w-full h-48 lg:h-64 object-cover"
                  src="https://blog.strawberrycstore.com/wp-content/uploads/2019/06/Cocacola1.jpg"
                  alt="Promo Banner 2"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Nước Giải Khát</h3>
                  <p className="text-lg">Đa dạng các loại nước uống tươi mát</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative">
                <img
                  className="w-full h-48 lg:h-64 object-cover"
                  src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-thiết-kế-bộ-nhận-diện-mới-logo-Pepsi-22.jpg"
                  alt="Promo Banner 3"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">Thương Hiệu Nổi Tiếng</h3>
                  <p className="text-lg">Các sản phẩm từ các thương hiệu uy tín</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Mixed Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Large Promo Image */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                className="w-full h-80 lg:h-96 object-cover"
                src="./images/banner_nuocngot.png"
                alt="Special Offer"
              />
            </div>
          </div>
          
          {/* Products Section */}
          <div className="lg:col-span-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-4xl">🥤</span>
                <h2 className="text-3xl font-bold text-blue-700">
                  Nước Uống Đa Dạng
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Khám phá các loại nước uống tươi mát, đa dạng hương vị
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {getProductsByCategory("68693d5117edd67c23b67bc1", 3)}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/product?category=68693d5117edd67c23b67bc1"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Xem thêm
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

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
    </div>
  );
};

export default HomePage;
