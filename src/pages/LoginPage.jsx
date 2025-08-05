import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../service/UserService';
import { forgotPassword } from '../service/UserService';
import { useAuth } from '../context/AuthContext';


const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [loginError, setLoginError] = useState('');
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' | 'error'

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(''); // Clear previous errors
    
    try {
        console.log('🚀 Attempting login...');
        const response = await loginUser({username: formData.username, password: formData.password});
        console.log('📥 Login response in component:', response);
        
        // Kiểm tra response một cách an toàn
        let user = null;
        
        // Thử các cấu trúc response khác nhau
        if (response && response.data && response.data.user) {
            user = response.data.user;
        } else if (response && response.data && response.data.data && response.data.data.user) {
            user = response.data.data.user;
        } else if (response && response.user) {
            user = response.user;
        }
        
        console.log('👤 User found:', user);
        
        if (user && user.username) {
            // Store user information in local storage NGAY LẬP TỨC
            localStorage.setItem('userData', JSON.stringify(user));
            console.log('✅ User data saved to localStorage:', user);
            
            setMessage('Đăng nhập thành công! Chào mừng ' + user.username);
            setMessageType('success');
            
            setTimeout(() => {
                setMessage("");

                // Store user information in local storage and update auth context
                localStorage.setItem('user', JSON.stringify(user));
                login(user);
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 2000);
        } else {
            console.warn('⚠️ No user found in response');
            setLoginError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    } catch (error) {
        console.error('❌ Login error in component:', error);
        setLoginError('Đăng nhập thất bại: ' + error.message);
    }
};

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setForgotMessage('');
        setForgotLoading(true);
        try {
            await forgotPassword(forgotEmail);
            setForgotMessage('Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.');
        } catch (error) {
            setForgotMessage('Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Toast Message */}
            {message && (
                <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    <span>{message}</span>
                    <button className="ml-2 text-lg" onClick={() => setMessage("")}>×</button>
                </div>
            )}
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
                <img
                    src="/images/logo_ngang.png"
                    alt="Login Banner"
                    className="max-w-md w-full h-auto object-contain"
                />
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold text-center mb-8">Đăng nhập</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Email hoặc Tên người dùng
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                                placeholder="Nhập email hoặc tên người dùng của bạn"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                                placeholder="Nhập mật khẩu"
                            />
                            {loginError && (
                                <p className="mt-1 text-sm text-red-600">{loginError}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            {/* <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                className="h-4 w-4 text-[#06AEF4] focus:ring-[#06AEF4] border-[#06AEF4] rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div> */}

                            <div className="text-sm">
                                <button
                                    type="button"
                                    className="font-medium text-[#06AEF4] hover:underline focus:outline-none"
                                    onClick={() => setShowForgotModal(true)}
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] hover:from-[#70d9ff] hover:to-[#06AEF4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Đăng nhập
                            </button>

                            <Link 
                                to="/register" 
                                className="w-full flex justify-center py-2 px-4 border border-[#06AEF4] rounded-md shadow-sm text-sm font-medium text-[#06AEF4] bg-white hover:bg-[#06AEF4] hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4] transition-colors duration-200"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                            onClick={() => { setShowForgotModal(false); setForgotEmail(''); setForgotMessage(''); }}
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-center">Quên mật khẩu</h3>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập email đăng ký</label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={e => setForgotEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            {forgotMessage && (
                                <div className={`text-sm ${forgotMessage.startsWith('Đã gửi') ? 'text-green-600' : 'text-red-600'}`}>{forgotMessage}</div>
                            )}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-[#06AEF4] text-white rounded-md font-medium hover:bg-[#0590d8] transition-colors"
                                disabled={forgotLoading}
                            >
                                {forgotLoading ? 'Đang gửi...' : 'Gửi email đặt lại mật khẩu'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
