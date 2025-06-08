import React, { useState, useEffect } from 'react';

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
      {/* Top Welcome Section with pink background */}
      <section className="bg-sky-50 rounded-2xl p-8 mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Large Image */}
          <div className="md:w-1/2">
            <img
              src="/images/about-1.png"
              alt="Woman cooking"
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-medium mb-2">
              Chào mừng bạn đến với{' '}
              <span className="text-blue-500">Tạp Hóa Số</span>
            </h2>
            <h3 className="text-xl mb-4">Cửa hàng tiện lợi cho mọi nhà!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              <span className="text-blue-500">Tạp Hóa Số</span> là mô hình cửa hàng tạp hóa hiện đại, 
              nơi bạn có thể thoải mái để dàng mua sắm thực phẩm tươi sống, nhu yếu phẩm hàng ngày 
              và các sản phẩm tiêu dùng chất lượng cao với giá cả phải chăng. Chúng tôi kết hợp sự 
              tiện lợi của công nghệ số với sự thân thiện của cửa hàng truyền thống, giúp bạn tiết 
              kiệm thời gian, chi phí và luôn an tâm về chất lượng sản phẩm. Đủ bạn ở đâu, Tạp Hóa Số 
              luôn sẵn sàng phục vụ – nhanh chóng, tiện lợi và đáng tin cậy.
            </p>

            {/* Bottom Images Carousel */}
            <div className="relative overflow-hidden group">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {/* First group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img
                    src="/images/about-2.jpg"
                    alt="Food plate"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-3.jpg"
                    alt="Vegetables"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-4.jpg"
                    alt="Cooking"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                </div>
                
                {/* Second group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img
                    src="/images/about-0.jpg"
                    alt="Food variety"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-7.jpg"
                    alt="Fresh produce"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-5.jpg"
                    alt="Healthy options"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                </div>
                
                {/* Third group of 3 images */}
                <div className="flex-none w-full flex gap-4">
                  <img
                    src="/images/about-11.jpg"
                    alt="Store front"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-12.jpg"
                    alt="Special offers"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                  <img
                    src="/images/about-13.jpg"
                    alt="Promotions"
                    className="w-1/3 h-57 object-cover rounded-lg"
                  />
                </div>
              </div>
              
              {/* Previous Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentSlide(dot)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === dot ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
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
          {[
            { icon: 'sale', label: 'Giá tốt nhất và ưu đãi' },
            { icon: 'diversity', label: 'Sự đa dạng' },
            { icon: 'delivery', label: 'Giao hàng miễn phí' },
            { icon: 'return', label: 'Hoàn trả hàng' },
            { icon: 'satisfaction', label: 'Sự hài lòng' },
            { icon: 'discount', label: 'Ưu đãi thả ga' },
          ].map(({ icon, label }) => {
            const getIcon = (iconType) => {
              switch (iconType) {
                case 'sale':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z"
                    />
                  );
                case 'diversity':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  );
                case 'delivery':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  );
                case 'return':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  );
                case 'satisfaction':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  );
                case 'discount':
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                    />
                  );
                default:
                  return (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  );
              }
            };

            return (
              <div
                key={icon}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center gap-4 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 w-12 h-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {getIcon(icon)}
                  </svg>
                </div>
                <span className="font-semibold text-center">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Hiệu suất của chúng tôi" Section */}
      <section className="bg-sky-50 rounded-2xl p-8 mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Image */}
          <div className="md:w-1/3">
            <img
              src="/images/about-8.png"
              alt="Woman thumbs up"
              className="w-full aspect-[3/4] object-cover rounded-2xl"
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
                <span className="text-blue-500">Tạp Hóa Số</span> cam kết mang đến 
                trải nghiệm mua sắm nhanh chóng và hiệu quả cho mọi khách hàng. 
                Với hệ thống quản lý thông minh và quy trình vận hành tối ưu, 
                chúng tôi đảm bảo xử lý đơn hàng nhanh, kiểm soát tồn kho 
                chính xác và giao hàng đúng hẹn. Trung bình mỗi ngày, Tạp Hóa Số 
                phục vụ hàng trăm đơn hàng với độ hài lòng cao từ khách hàng, 
                góp phần xây dựng một mô hình bán lẻ hiện đại, linh hoạt và đáng 
                tin cậy trong khu vực.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/3">
            <img
              src="/images/about-6.png"
              alt="Woman cooking"
              className="w-full aspect-[3/4] object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="relative rounded-xl overflow-hidden p-8 text-center text-white select-none min-h-[300px] flex items-center justify-center">
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
