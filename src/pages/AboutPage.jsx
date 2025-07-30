import React, { useState, useEffect } from 'react';
import {
  BadgePercent,
  Layers3,
  Truck,
  RotateCcw,
  Smile,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const aboutFeatures = [
  { icon: <BadgePercent className="w-10 h-10 text-blue-500" />, label: 'Giá tốt nhất & ưu đãi' },
  { icon: <Layers3 className="w-10 h-10 text-blue-500" />, label: 'Sản phẩm đa dạng' },
  { icon: <Truck className="w-10 h-10 text-blue-500" />, label: 'Giao hàng miễn phí' },
  { icon: <RotateCcw className="w-10 h-10 text-blue-500" />, label: 'Hoàn trả dễ dàng' },
  { icon: <Smile className="w-10 h-10 text-blue-500" />, label: 'Khách hàng hài lòng' },
  { icon: <Tag className="w-10 h-10 text-blue-500" />, label: 'Ưu đãi thả ga' },
];

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Top Welcome Section */}
      <section className="bg-sky-50 rounded-2xl p-8 mb-16 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Large Image */}
          <div className="md:w-1/2">
            <img
              src="/images/about-1.png"
              alt="Woman cooking"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-lg shadow-md"
            />
          </div>
          {/* Right Content */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">
              Chào mừng bạn đến với{' '}
              <span className="text-blue-500">Tạp Hóa Số</span>
            </h2>
            <h3 className="text-xl mb-4 font-semibold text-gray-700">Cửa hàng tiện lợi cho mọi nhà!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              <span className="text-blue-500 font-semibold">Tạp Hóa Số</span> là mô hình cửa hàng tạp hóa hiện đại, nơi bạn có thể thoải mái mua sắm thực phẩm tươi sống, nhu yếu phẩm hàng ngày và các sản phẩm tiêu dùng chất lượng cao với giá cả phải chăng. Chúng tôi kết hợp sự tiện lợi của công nghệ số với sự thân thiện của cửa hàng truyền thống, giúp bạn tiết kiệm thời gian, chi phí và luôn an tâm về chất lượng sản phẩm. Dù bạn ở đâu, Tạp Hóa Số luôn sẵn sàng phục vụ – nhanh chóng, tiện lợi và đáng tin cậy.
            </p>
            {/* Bottom Images Carousel */}
            <div className="relative overflow-hidden group">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* First group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img src="/images/about-2.jpg" alt="Food plate" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-3.jpg" alt="Vegetables" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-4.jpg" alt="Cooking" className="w-1/3 h-44 object-cover rounded-lg" />
                </div>
                {/* Second group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img src="/images/about-0.jpg" alt="Food variety" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-7.jpg" alt="Fresh produce" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-5.jpg" alt="Healthy options" className="w-1/3 h-44 object-cover rounded-lg" />
                </div>
                {/* Third group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img src="/images/about-11.jpg" alt="Store front" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-12.jpg" alt="Special offers" className="w-1/3 h-44 object-cover rounded-lg" />
                  <img src="/images/about-13.jpg" alt="Promotions" className="w-1/3 h-44 object-cover rounded-lg" />
                </div>
              </div>
              {/* Previous Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {/* Next Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Navigation Dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentSlide(dot)}
                    className={`w-2 h-2 rounded-full transition-colors ${currentSlide === dot ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${dot + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "Về chúng tôi" Section */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">Về chúng tôi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutFeatures.map(({ icon, label }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div>{icon}</div>
              <span className="font-semibold text-center text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* "Hiệu suất của chúng tôi" Section */}
      <section className="bg-sky-50 rounded-2xl p-8 mb-16 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Image */}
          <div className="md:w-1/3">
            <img
              src="/images/about-8.png"
              alt="Woman thumbs up"
              className="w-full aspect-[3/4] object-cover rounded-2xl shadow-md"
            />
          </div>
          {/* Center Content */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-2xl font-semibold mb-4">
                Hiệu suất<br />của chúng tôi
              </h3>
              <p className="text-lg mb-4">
                Đối tác của bạn cho giải pháp thương mại điện tử
              </p>
              <p className="text-gray-600 leading-relaxed">
                <span className="text-blue-500">Tạp Hóa Số</span> cam kết mang đến trải nghiệm mua sắm nhanh chóng và hiệu quả cho mọi khách hàng. Với hệ thống quản lý thông minh và quy trình vận hành tối ưu, chúng tôi đảm bảo xử lý đơn hàng nhanh, kiểm soát tồn kho chính xác và giao hàng đúng hẹn. Trung bình mỗi ngày, Tạp Hóa Số phục vụ hàng trăm đơn hàng với độ hài lòng cao từ khách hàng, góp phần xây dựng một mô hình bán lẻ hiện đại, linh hoạt và đáng tin cậy trong khu vực.
              </p>
            </div>
          </div>
          {/* Right Image */}
          <div className="md:w-1/3">
            <img
              src="/images/about-6.png"
              alt="Woman cooking"
              className="w-full aspect-[3/4] object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="relative rounded-xl overflow-hidden p-8 text-center text-white select-none min-h-[300px] flex items-center justify-center shadow-md">
        <div className="absolute inset-0">
          <img
            src="/images/about-10.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80"></div>
        </div>
        <div className="relative z-10 py-8">
          <h4 className="text-xl tracking-wider mb-3 font-semibold drop-shadow-lg">SALE GIỮA THÁNG</h4>
          <p className="text-5xl font-extrabold text-orange-400 mb-8 drop-shadow-lg">DEAL NỬA GIÁ</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all hover:scale-105">
              FREESHIP
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all hover:scale-105">
              GIẢM CẢ 500K
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transition-all hover:scale-105">
              FLASHSALE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
