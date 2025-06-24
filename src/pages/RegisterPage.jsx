import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../service/UserService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!/[A-Z]/.test(password)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa";
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
      // Also validate confirm password if it has value
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(
          value,
          formData.confirmPassword
        );
        setConfirmPasswordError(confirmError);
      }
    } else if (name === "confirmPassword") {
      const confirmError = validateConfirmPassword(formData.password, value);
      setConfirmPasswordError(confirmError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    if (passwordError) {
      alert(passwordError);
      return;
    }
    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        password: formData.password,
      });
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    }
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
            {/* <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div> */}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Tên tài khoản
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-[#06AEF4] rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4]"
                placeholder="Nhập tên tài khoản của bạn"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4] ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#06AEF4]"
                }`}
                placeholder="Nhập mật khẩu"
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#06AEF4] focus:border-[#06AEF4] ${
                  confirmPasswordError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#06AEF4]"
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-red-600">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#06AEF4] hover:bg-[#06AEF4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4]"
              >
                Đăng ký
              </button>

              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-[#06AEF4] rounded-md shadow-sm text-sm font-medium text-[#06AEF4] bg-white hover:bg-[#06AEF4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#06AEF4]"
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
