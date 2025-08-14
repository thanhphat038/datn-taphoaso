import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            showNotification('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success');
        } catch (error) {
            showNotification('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    return (
        <main className='min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header Section */}
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Liên Hệ Với Chúng Tôi</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn hoặc liên hệ trực tiếp!
                    </p>
                </section>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    {/* Contact Information */}
                    <div className='space-y-8'>
                        <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>

                            <div className='space-y-6'>
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Địa Chỉ</h3>
                                        <p className="text-gray-600">QTSC Building 1, Đ. Quang Trung, Tân Hưng Thuận, Hóc Môn, Hồ Chí Minh, Việt Nam</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Điện Thoại</h3>
                                        <p className="text-gray-600">0859 499 579</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                        <p className="text-gray-600">info@taphoso.com</p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0'>
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Giờ Làm Việc</h3>
                                        <p className="text-gray-600">Thứ 2 - Chủ nhật: 7:00 - 22:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vị Trí Của Chúng Tôi</h2>
                            <div className='rounded-lg overflow-hidden'>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4351774067254!2d106.62526120239721!3d10.854468086223038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8O0bmcgVmnDqm4gUGjhuqduIE3hu4FtIFF1YW5nIFRydW5n!5e0!3m2!1svi!2s!4v1755187214027!5m2!1svi!2s" 
                                    width="100%" 
                                    height="400" 
                                    style={{border:0}} 
                                    allowFullScreen={true} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Vị trí Tạp Hóa Số"
                                    className="w-full"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className='bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi Tin Nhắn</h2>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Chủ đề *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Chọn chủ đề</option>
                                        <option value="general">Thông tin chung</option>
                                        <option value="order">Đặt hàng</option>
                                        <option value="support">Hỗ trợ khách hàng</option>
                                        <option value="feedback">Góp ý</option>
                                        <option value="other">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung tin nhắn *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Nhập nội dung tin nhắn..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang gửi...</span>
                                    </div>
                                ) : (
                                    'Gửi Tin Nhắn'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="mt-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Câu Hỏi Thường Gặp</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Tìm hiểu thêm về dịch vụ của chúng tôi
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Làm thế nào để đặt hàng?</h3>
                            <p className="text-gray-600">Bạn có thể đặt hàng trực tuyến thông qua website hoặc ứng dụng di động của chúng tôi. Chúng tôi sẽ giao hàng trong vòng 2-4 giờ.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Chính sách đổi trả như thế nào?</h3>
                            <p className="text-gray-600">Chúng tôi chấp nhận đổi trả trong vòng 24 giờ nếu sản phẩm có vấn đề về chất lượng hoặc không đúng như mô tả.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Phí giao hàng là bao nhiêu?</h3>
                            <p className="text-gray-600">Phí giao hàng cơ bản là 15.000đ cho đơn hàng dưới 200.000đ. Miễn phí giao hàng cho đơn hàng từ 200.000đ trở lên.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Có thể thanh toán bằng cách nào?</h3>
                            <p className="text-gray-600">Chúng tôi chấp nhận thanh toán tiền mặt khi nhận hàng, chuyển khoản ngân hàng, hoặc thanh toán qua VNPay.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Custom Notification */}
            {notification.show && (
                <div className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${notification.type === 'success' ? 'border-green-500' : 'border-red-500'
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
                                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'
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

export default ContactPage;
