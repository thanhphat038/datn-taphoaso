import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../service/UserService';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await loginUser(formData);
        if (response && response.user && response.user.name) {
            alert('Đăng nhập thành công! Chào mừng ' + response.user.name);
            window.location.href = '/';
        } else {
            alert('Đăng nhập thất bại: Dữ liệu người dùng không hợp lệ');
        }
    } catch (error) {
        alert('Đăng nhập thất bại: ' + error.message);
    }
};

    return (
        <div className="min-h-screen flex">
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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                                placeholder="Nhập email của bạn"
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
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                className="h-4 w-4 text-[#06AEF4] focus:ring-[#06AEF4] border-[#06AEF4] rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#06AEF4] hover:text-[#06AEF4]">
                                    Quên mật khẩu?
                                </a>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#06AEF4] hover:bg-[#06AEF4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4]"
                            >
                                Đăng nhập
                            </button>

                            <Link 
                                to="/register" 
                                className="w-full flex justify-center py-2 px-4 border border-[#06AEF4] rounded-md shadow-sm text-sm font-medium text-[#06AEF4] bg-white hover:bg-[#06AEF4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4]"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
