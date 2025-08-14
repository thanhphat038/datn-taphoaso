import React from 'react';

const ChinhSachKH = () => {
  return (
    <main className='min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30'>
      <div className='max-w-7xl mx-auto px-4 py-12 font-sans'>
        {/* Top Welcome Section */}
        <section className="relative bg-gradient-to-r from-blue-600/10 via-blue-500/5 to-indigo-600/10 rounded-3xl p-10 mb-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Large Image */}
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src="https://luanvan99.com/files/assets/dich_vu_khach_hang_la_gi_luanvan99.jpg"
                  alt="Customer service"
                  className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Chính sách khách hàng
                </h2>
                <h3 className="text-2xl font-semibold text-blue-600">Cam kết phục vụ tốt nhất!</h3>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                Tại <span className="font-semibold text-blue-600">Tạp Hóa Số</span>, chúng tôi luôn đặt lợi ích và trải nghiệm 
                của khách hàng lên hàng đầu. Chính sách khách hàng của chúng tôi được xây dựng dựa trên 
                nguyên tắc minh bạch, công bằng và tôn trọng quyền lợi của mọi khách hàng.
              </p>

              {/* Policy Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-blue-600 text-3xl mb-3">✓</div>
                  <span className="text-sm font-semibold text-gray-800">Chất lượng đảm bảo</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-blue-600 text-3xl mb-3">✓</div>
                  <span className="text-sm font-semibold text-gray-800">Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Policy Content */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Nội dung chính sách
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: 'quality', 
                title: 'Chất lượng sản phẩm',
                description: 'Cam kết 100% sản phẩm chính hãng, có nguồn gốc rõ ràng và đảm bảo vệ sinh an toàn thực phẩm.',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                icon: 'return', 
                title: 'Chính sách đổi trả',
                description: 'Hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn.',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: 'delivery', 
                title: 'Giao hàng nhanh chóng',
                description: 'Cam kết giao hàng trong vòng 2-4 giờ trong khu vực nội thành, tối đa 24h cho các khu vực khác.',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: 'support', 
                title: 'Hỗ trợ khách hàng',
                description: 'Đội ngũ CSKH 24/7 sẵn sàng hỗ trợ mọi vấn đề và giải đáp thắc mắc của khách hàng.',
                color: 'from-orange-500 to-red-500'
              },
              { 
                icon: 'security', 
                title: 'Bảo mật thông tin',
                description: 'Cam kết bảo mật tuyệt đối thông tin cá nhân và thanh toán của khách hàng.',
                color: 'from-indigo-500 to-blue-500'
              },
              { 
                icon: 'compensation', 
                title: 'Bồi thường thiệt hại',
                description: 'Chịu trách nhiệm bồi thường thiệt hại nếu có lỗi từ phía chúng tôi gây ra.',
                color: 'from-teal-500 to-green-500'
              },
            ].map(({ icon, title, description, color }, index) => {
              const getIcon = (iconType) => {
                switch (iconType) {
                  case 'quality':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                  case 'return':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    );
                  case 'delivery':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    );
                  case 'support':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    );
                  case 'security':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    );
                  case 'compensation':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    );
                  default:
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                }
              };

              return (
                <div
                  key={icon}
                  className="group bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon container with gradient background */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {getIcon(icon)}
                    </svg>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h4 className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{title}</h4>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>
                  
                  {/* Hover effect line */}
                  <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${color} group-hover:w-full transition-all duration-500`}></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Information */}
        <section className="relative bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl p-12 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Liên hệ hỗ trợ
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📞</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Hotline</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">1900-xxxx</p>
                <p className="text-sm text-gray-500">24/7 hỗ trợ</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">✉️</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Email</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">support@taphoso.com</p>
                <p className="text-sm text-gray-500">Phản hồi trong 24h</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💬</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Chat trực tuyến</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">Live chat</p>
                <p className="text-sm text-gray-500">Hỗ trợ tức thì</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default ChinhSachKH;
