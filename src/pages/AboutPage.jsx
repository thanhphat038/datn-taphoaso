import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Top Welcome Section with pink background */}
      <section className="bg-pink-50 rounded-2xl p-8 mb-16">
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

            {/* Bottom Images Grid */}
            <div className="grid grid-cols-3 gap-4">
              <img
                src="/images/about-2.png"
                alt="Food plate"
                className="w-full h-57 object-cover rounded-lg"
              />
              <img
                src="/images/about-3.png"
                alt="Vegetables"
                className="w-full h-57 object-cover rounded-lg"
              />
              <img
                src="/images/about-4.png"
                alt="Cooking"
                className="w-full h-57 object-cover rounded-lg"
              />
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
          ].map(({ icon, label }) => (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-center">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* "Hiệu suất của chúng tôi" Section */}
      <section className="bg-pink-50 rounded-2xl p-8 mb-16">
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
