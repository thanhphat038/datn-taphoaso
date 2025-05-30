import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement registration logic
        console.log('Register attempt with:', formData);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
                <img
                    src="/images/logo_ngang.png"
                    alt="Register Banner"
                    className="max-w-md w-full h-auto object-contain"
                />
            </div>

            {/* Right side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
                <div className="max-w-md w-full">
                    <h2 className="text-3xl font-bold text-center mb-8">Đăng ký</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-cyan-400 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400"
                                placeholder="Nhập họ và tên của bạn"
                            />
                        </div>

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
                                className="mt-1 block w-full px-3 py-2 border border-cyan-400 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400"
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
                                className="mt-1 block w-full px-3 py-2 border border-cyan-400 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-cyan-400 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400"
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                            >
                                Đăng ký
                            </button>

                            <Link 
                                to="/login" 
                                className="w-full flex justify-center py-2 px-4 border border-cyan-400 rounded-md shadow-sm text-sm font-medium text-cyan-400 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                            >
                                Đã có tài khoản? Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
