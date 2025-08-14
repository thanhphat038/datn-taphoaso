import React from 'react';

const ChinhSachGH = () => {
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
                  src="https://media.istockphoto.com/id/1418141147/ja/%E3%83%99%E3%82%AF%E3%82%BF%E3%83%BC/%E3%82%B3%E3%83%B3%E3%83%93%E3%83%8B%E3%81%A7%E8%8D%B7%E7%89%A9%E3%82%92%E5%8F%97%E3%81%91%E5%8F%96%E3%82%8B%E7%94%B7%E6%80%A7.jpg?s=612x612&w=0&k=20&c=gLj8L6rnYXz1-kQWiGf3umaf3X57QUUpztwDo2N7qyQ="
                  alt="Delivery service"
                  className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Chính sách giao hàng
                </h2>
                <h3 className="text-2xl font-semibold text-blue-600">Giao hàng nhanh chóng, an toàn!</h3>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                <span className="font-semibold text-blue-600">Tạp Hóa Số</span> cam kết mang đến dịch vụ giao hàng 
                chất lượng cao với thời gian giao hàng nhanh chóng và đảm bảo an toàn cho mọi sản phẩm. 
                Chúng tôi sử dụng đội ngũ giao hàng chuyên nghiệp, được đào tạo bài bản để đảm bảo 
                mọi đơn hàng được giao đến tay khách hàng một cách hoàn hảo nhất.
              </p>

              {/* Shipping Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🚚</div>
                  <span className="text-sm font-semibold text-gray-800">Giao hàng 2-4h</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">🆓</div>
                  <span className="text-sm font-semibold text-gray-800">Miễn phí giao hàng</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Shipping Content */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Thông tin giao hàng
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: 'time', 
                title: 'Thời gian giao hàng',
                description: 'Giao hàng trong vòng 2-4 giờ cho khu vực nội thành, tối đa 24h cho các khu vực khác.',
                color: 'from-green-500 to-emerald-500'
              },
              { 
                icon: 'area', 
                title: 'Khu vực giao hàng',
                description: 'Giao hàng toàn thành phố Hồ Chí Minh và các tỉnh lân cận trong bán kính 50km.',
                color: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: 'fee', 
                title: 'Phí giao hàng',
                description: 'Miễn phí giao hàng cho đơn hàng từ 200.000đ, phí 15.000đ cho đơn hàng dưới 200.000đ.',
                color: 'from-purple-500 to-pink-500'
              },
              { 
                icon: 'tracking', 
                title: 'Theo dõi đơn hàng',
                description: 'Khách hàng có thể theo dõi trạng thái đơn hàng real-time qua SMS và ứng dụng.',
                color: 'from-orange-500 to-red-500'
              },
              { 
                icon: 'delivery', 
                title: 'Điều kiện giao hàng',
                description: 'Giao hàng từ 7h sáng đến 22h tối, không giao hàng vào Chủ nhật và ngày lễ.',
                color: 'from-indigo-500 to-blue-500'
              },
              { 
                icon: 'contact', 
                title: 'Liên hệ giao hàng',
                description: 'Nhân viên giao hàng sẽ liên hệ trước 15 phút để xác nhận thời gian giao hàng.',
                color: 'from-teal-500 to-green-500'
              },
            ].map(({ icon, title, description, color }, index) => {
              const getIcon = (iconType) => {
                switch (iconType) {
                  case 'time':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                  case 'area':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    );
                  case 'fee':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    );
                  case 'tracking':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    );
                  case 'delivery':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    );
                  case 'contact':
                    return (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

        {/* Shipping Process */}
        <section className="relative bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl p-12 mb-20 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Quy trình giao hàng
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: 'Đặt hàng', description: 'Khách hàng đặt hàng qua website hoặc ứng dụng', color: 'from-blue-500 to-cyan-500' },
                { step: '2', title: 'Xác nhận', description: 'Nhân viên xác nhận đơn hàng trong vòng 15 phút', color: 'from-green-500 to-emerald-500' },
                { step: '3', title: 'Chuẩn bị', description: 'Đóng gói và chuẩn bị giao hàng', color: 'from-orange-500 to-red-500' },
                { step: '4', title: 'Giao hàng', description: 'Nhân viên giao hàng đến địa chỉ khách hàng', color: 'from-purple-500 to-pink-500' },
              ].map(({ step, title, description, color }, index) => (
                <div key={step} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${color} text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {step}
                  </div>
                  <h4 className="font-bold text-xl mb-3 text-gray-800">{title}</h4>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shipping Zones */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Khu vực giao hàng
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Khu vực nội thành</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Quận 1, 3, 5, 7, 10, 11
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Quận Bình Thạnh, Phú Nhuận
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Quận Tân Bình, Tân Phú
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Thời gian giao: 2-4 giờ
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Phí giao hàng: Miễn phí
                </li>
              </ul>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Khu vực ngoại thành</h4>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Quận 2, 6, 8, 9, 12
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Quận Bình Tân, Củ Chi
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Huyện Hóc Môn, Bình Chánh
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Thời gian giao: 4-24 giờ
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Phí giao hàng: 15.000đ
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="relative bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl p-12 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
              Liên hệ giao hàng
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🚚</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Đội giao hàng</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">Hotline: 1900-xxxx</p>
                <p className="text-sm text-gray-500">Hỗ trợ 24/7</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📱</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Theo dõi đơn hàng</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">SMS: 1900-xxxx</p>
                <p className="text-sm text-gray-500">Cập nhật real-time</p>
              </div>
              
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⏰</div>
                <h4 className="font-bold text-xl mb-3 text-gray-800">Giờ giao hàng</h4>
                <p className="text-lg font-semibold text-blue-600 mb-2">7:00 - 22:00</p>
                <p className="text-sm text-gray-500">Thứ 2 - Thứ 7</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ChinhSachGH;
