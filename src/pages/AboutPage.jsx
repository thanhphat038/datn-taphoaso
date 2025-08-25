import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Timer finished, reset to 24 hours
          hours = 24;
          minutes = 0;
          seconds = 0;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  const handleExploreClick = () => {
    navigate('/');
  };

  const fadeInUp = "animate-fade-in-up";
  const slideInLeft = "animate-slide-in-left";
  const slideInRight = "animate-slide-in-right";

  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20'>
      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${fadeInUp}`}>
            Tạp Hóa Số
          </h1>
          <p className={`text-xl md:text-2xl mb-8 opacity-90 ${fadeInUp}`}>
            Cửa hàng tiện lợi cho mọi nhà
          </p>
          <div className={`flex flex-wrap justify-center gap-4 ${fadeInUp}`}>
            <button 
              onClick={handleExploreClick}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Khám phá ngay
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105">
              Liên hệ
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-16 font-sans'>
        {/* Welcome Section with enhanced styling */}
        <section className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20 shadow-xl border border-blue-100/50 ${isVisible ? slideInLeft : ''}`}>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Large Image with enhanced styling */}
            <div className="lg:w-1/2 relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/images/about-1.png"
                  alt="Woman cooking"
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                ✨ Chất lượng cao
              </div>
            </div>

            {/* Right Content with enhanced typography */}
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Được tin tưởng bởi hàng nghìn khách hàng
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                Chào mừng bạn đến với{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Tạp Hóa Số
                </span>
              </h2>
              
              <h3 className="text-xl md:text-2xl text-gray-600 font-medium">
                Cửa hàng tiện lợi cho mọi nhà!
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                <span className="text-blue-600 font-semibold">Tạp Hóa Số</span> là mô hình cửa hàng tạp hóa hiện đại, 
                nơi bạn có thể thoải mái mua sắm thực phẩm tươi sống, nhu yếu phẩm hàng ngày 
                và các sản phẩm tiêu dùng chất lượng cao với giá cả phải chăng. Chúng tôi kết hợp sự 
                tiện lợi của công nghệ số với sự thân thiện của cửa hàng truyền thống, giúp bạn tiết 
                kiệm thời gian, chi phí và luôn an tâm về chất lượng sản phẩm.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-500">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">500+</div>
                  <div className="text-sm text-gray-500">Sản phẩm</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-500">Hỗ trợ</div>
                </div>
              </div>

              {/* Enhanced Image Carousel */}
              <div className="relative overflow-hidden group rounded-xl">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {/* First group of 3 images */}
                  <div className="flex-none w-full flex gap-4">
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-2.jpg"
                        alt="Food plate"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-3.jpg"
                        alt="Vegetables"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-4.jpg"
                        alt="Cooking"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Second group of 3 images */}
                  <div className="flex-none w-full flex gap-4">
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-0.jpg"
                        alt="Food variety"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-7.jpg"
                        alt="Fresh produce"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-5.jpg"
                        alt="Healthy options"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Third group of 3 images */}
                  <div className="flex-none w-full flex gap-4">
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-11.jpg"
                        alt="Store front"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-12.jpg"
                        alt="Special offers"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                    <div className="w-1/3 relative group">
                      <img
                        src="/images/about-13.jpg"
                        alt="Promotions"
                        className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Navigation Buttons */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Enhanced Navigation Dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {[0, 1, 2].map((dot) => (
                    <button
                      key={dot}
                      onClick={() => setCurrentSlide(dot)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentSlide === dot ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${dot + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced "Về chúng tôi" Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Về chúng tôi
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị cốt lõi làm nên sự khác biệt của Tạp Hóa Số
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'sale', label: 'Giá tốt nhất và ưu đãi', description: 'Cam kết giá cạnh tranh nhất thị trường' },
              { icon: 'diversity', label: 'Sự đa dạng', description: 'Hơn 500+ sản phẩm đa dạng chủng loại' },
              { icon: 'delivery', label: 'Giao hàng miễn phí', description: 'Giao hàng nhanh chóng, miễn phí cho đơn từ 200k' },
              { icon: 'return', label: 'Hoàn trả hàng', description: 'Chính sách đổi trả linh hoạt trong 7 ngày' },
              { icon: 'satisfaction', label: 'Sự hài lòng', description: 'Đặt sự hài lòng khách hàng lên hàng đầu' },
              { icon: 'discount', label: 'Ưu đãi thả ga', description: 'Khuyến mãi liên tục, giảm giá quanh năm' },
            ].map(({ icon, label, description }, index) => {
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
                  className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-blue-600 w-16 h-16 p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
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
                  <div className="text-center">
                    <h4 className="font-bold text-xl mb-2 text-gray-800">{label}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Enhanced "Hiệu suất của chúng tôi" Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 mb-20 shadow-xl border border-blue-100/50">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Image with enhanced styling */}
            <div className="lg:w-1/3 relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/images/about-8.png"
                  alt="Woman thumbs up"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Hài lòng</div>
              </div>
            </div>

            {/* Center Content with enhanced styling */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Hiệu suất vượt trội
                </div>
                
                <h3 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
                  Hiệu suất<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    của chúng tôi
                  </span>
                </h3>
                
                <p className="text-lg text-gray-600 mb-4 font-medium">
                  Đối tác của bạn cho giải pháp thương mại điện tử
                </p>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  <span className="text-blue-600 font-semibold">Tạp Hóa Số</span> cam kết mang đến 
                  trải nghiệm mua sắm nhanh chóng và hiệu quả cho mọi khách hàng. 
                  Với hệ thống quản lý thông minh và quy trình vận hành tối ưu, 
                  chúng tôi đảm bảo xử lý đơn hàng nhanh, kiểm soát tồn kho 
                  chính xác và giao hàng đúng hẹn.
                </p>

                {/* Performance metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Đơn hàng/ngày</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image with enhanced styling */}
            <div className="lg:w-1/3 relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/images/about-6.png"
                  alt="Woman cooking"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-600">4.9★</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Bottom Banner */}
        <section className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center text-white select-none min-h-[400px] flex items-center justify-center group">
          <div className="absolute inset-0">
            <img
              src="/images/about-10.png"
              alt="Background"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-indigo-900/80"></div>
          </div>
          
          <div className="relative z-10 py-8 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xl md:text-2xl tracking-wider font-semibold drop-shadow-lg text-blue-100">
                SALE GIỮA THÁNG
              </h4>
              <p className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 drop-shadow-lg">
                DEAL NỬA GIÁ
              </p>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Khám phá những ưu đãi hấp dẫn nhất trong tháng với hàng trăm sản phẩm giảm giá sâu
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform">
                🚚 FREESHIP
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform">
                💰 GIẢM CẢ 500K
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform">
                ⚡ FLASHSALE
              </button>
            </div>
            
            {/* Countdown timer with real functionality */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-blue-100 mb-2">Ưu đãi kết thúc sau:</p>
              <div className="flex justify-center gap-4 text-2xl font-bold">
                <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                  <div className="text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-blue-100">Giờ</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                  <div className="text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-blue-100">Phút</div>
                </div>
                <div className="bg-white/20 rounded-lg p-2 min-w-[60px]">
                  <div className="text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-blue-100">Giây</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / (24 * 3600)) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-blue-100 mt-2 text-center">
                  {Math.round(((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / (24 * 3600)) * 100)}% thời gian còn lại
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;
