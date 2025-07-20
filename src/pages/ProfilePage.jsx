import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  deleteAddress,
} from "../service/UserService";
import AddressSelector from "../components/AddressSelector.jsx";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(null);

  const handleLogout = () => {
    // Xoá token khỏi cookie
    Cookies.remove("auth_token");
    // Tuỳ bạn: có thể redirect về trang login
    window.location.href = "/login";
  };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [gender, setGender] = useState("male");

  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone: "",
    address_detail: "",
    city: "",
    district: "",
    ward: "",
  });
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState(null);

  const [orders, setOrders] = useState([
    {
      id: "#123",
      date: "Mua lúc 06/06, 2024",
      address:
        "29-31 Vườn Lài, Phường An Phú Đông, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
      status: "Giao hàng thành công",
      products: [
        {
          id: 1,
          name: "Rau củ quả tươi",
          image: "/images/about-12.jpg",
          quantity: 2,
          price: 100000,
        },
        {
          id: 2,
          name: "Sữa tươi",
          image: "/images/about-11.jpg",
          quantity: 1,
          price: 50000,
        },
      ],
      total: 100000,
      originalTotal: 100000,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (activeTab === "profile") {
      setLoadingProfile(true);
      getProfile()
        .then((data) => {
          setProfile(data);
          if (data.gender) setGender(data.gender);
          // You can set other profile fields here as needed
          setLoadingProfile(false);
          setProfileError(null);
        })
        .catch((error) => {
          setProfileError(error.message);
          setLoadingProfile(false);
        });
    } else if (activeTab === "address") {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    setAddressError(null);
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (error) {
      setAddressError(error.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      setAddressError(error.message);
    }
  };

  const handleAddAddress = async () => {
    if (
      newAddress.name &&
      newAddress.phone &&
      newAddress.address &&
      newAddress.city &&
      newAddress.district &&
      newAddress.ward
    ) {
      try {
        const addressPayload = {
          // receiver: newAddress.name,
          // phone: newAddress.phone,
          // address_detail: newAddress.address,
          // city: newAddress.city,
          // district: newAddress.district,
          // ward: newAddress.ward,
          // is_default: true,
          phone: newAddress.phone,
          city: newAddress.city,
          district: newAddress.district,
          ward: newAddress.ward,
          address_detail: newAddress.address,
          receiver: newAddress.name,
          is_default: true,
        };
        console.log(addressPayload);

        // const created = await createAddress(addressPayload);
        // setAddresses([...addresses, created]);
        // setShowAddForm(false);
        // setNewAddress({
        //   name: "",
        //   phone: "",
        //   address: "",
        //   city: "",
        //   district: "",
        //   ward: "",
        // });
        // setAddressError(null);
      } catch (error) {
        // setAddressError(error.message);
      }
    }
  };

  const handleReorder = (orderId) => {
    console.log("Reorder:", orderId);
  };

  const handleQuantityChange = (orderId, productId, newQuantity) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              products: order.products.map((product) =>
                product.id === productId
                  ? { ...product, quantity: Math.max(1, newQuantity) }
                  : product
              ),
            }
          : order
      )
    );
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Profile Icon */}
            <div className="flex items-center gap-3 p-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-pink-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium">
                {profile ? profile.username : "Tên"}
              </span>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === "address"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Địa chỉ
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === "orders"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                Đơn hàng
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === "favorites"
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                Sản phẩm yêu thích
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-grow">
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-yellow-100 overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src="/images/avata.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <label className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all hover:scale-110 shadow-lg border-2 border-white">
                      <input type="file" className="hidden" accept="image/*" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="flex gap-6 mb-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={profile?.gender === "male"}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Anh</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={profile?.gender === "female"}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Chị</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={profile?.gender === "other"}
                      onChange={(e) =>
                        setProfile({ ...profile, gender: e.target.value })
                      }
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Khác</span>
                  </label>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-6 max-w-lg mx-auto">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập tên tài khoản"
                    value={profile?.username || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                  />
                </div>
                {/* <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mật khẩu
                  </label>
                <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập mật khẩu"
                    value={profile?.password || ''}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  />
                </div> */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập số điện thoại"
                    value={profile?.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Gmail
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập địa chỉ email"
                    value={profile?.email || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button className="flex-1 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium">
                    Cập nhật
                  </button>
                  <button
                    className="flex-1 px-6 py-3 rounded-lg bg-[#06AEF4] text-white hover:bg-blue-500 transition-colors font-medium"
                    onClick={async () => {
                      setUpdateLoading(true);
                      setUpdateError(null);
                      setUpdateSuccess(null);
                      try {
                        await updateProfile(profile);
                        setUpdateSuccess("Cập nhật thông tin thành công");
                      } catch (error) {
                        setUpdateError(error.message);
                      } finally {
                        setUpdateLoading(false);
                      }
                    }}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </div>
              {updateError && (
                <p className="text-red-500 mt-2 text-center">{updateError}</p>
              )}
              {updateSuccess && (
                <p className="text-green-500 mt-2 text-center">
                  {updateSuccess}
                </p>
              )}
            </div>
          )}

          {/* Add Change Password tab button */}
          <button
            onClick={() => setActiveTab("changePassword")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === "changePassword"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9a3 3 0 116 0v1h1a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2h1V9zm3-3a1 1 0 00-1 1v1h2V7a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Đổi mật khẩu
          </button>

          {activeTab === "changePassword" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-lg mx-auto">
              <h2 className="text-xl font-semibold mb-6">Đổi mật khẩu</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Nhập mật khẩu mới"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button
                    className="flex-1 px-6 py-3 rounded-lg bg-[#06AEF4] text-white hover:bg-blue-500 transition-colors font-medium"
                    onClick={async () => {
                      setChangePasswordLoading(true);
                      setChangePasswordError(null);
                      setChangePasswordSuccess(null);
                      try {
                        await changePassword(
                          passwords.currentPassword,
                          passwords.newPassword
                        );
                        setChangePasswordSuccess("Đổi mật khẩu thành công");
                        setPasswords({ currentPassword: "", newPassword: "" });
                      } catch (error) {
                        setChangePasswordError(error.message);
                      } finally {
                        setChangePasswordLoading(false);
                      }
                    }}
                    disabled={changePasswordLoading}
                  >
                    {changePasswordLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
                {changePasswordError && (
                  <p className="text-red-500 mt-2 text-center">
                    {changePasswordError}
                  </p>
                )}
                {changePasswordSuccess && (
                  <p className="text-green-500 mt-2 text-center">
                    {changePasswordSuccess}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "address" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Địa chỉ nhận hàng</h2>

              {/* Address List */}
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-medium">{address.name}</span>
                          <span className="text-gray-600">{address.phone}</span>
                        </div>
                        <p className="text-gray-600">{address.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-500 hover:text-blue-600">
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Address Button */}
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Thêm địa chỉ mới
              </button>

              {/* Add New Address Form */}
              {showAddForm && (
                <div className="mt-4 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Thêm địa chỉ mới</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên người nhận
                      </label>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, name: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Nhập tên người nhận"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tỉnh/Thành phố, Quận/Huyện, Phường/Xã
                      </label>
                      <AddressSelector
                        onChange={(data) =>
                          setNewAddress({ ...newAddress, ...data })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ chi tiết
                      </label>
                      <input
                        type="text"
                        value={newAddress.address}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Nhập địa chỉ chi tiết"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddAddress}
                        className="px-6 py-2 bg-blue-200 text-white rounded-lg hover:bg-blue-300 transition-colors"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-medium text-lg">
                            Đơn hàng {order.id}
                          </span>
                          <span className="text-gray-600">{order.date}</span>
                          <span
                            onClick={() =>
                              navigate(`/order/${order.id.replace("#", "")}`)
                            }
                            className="text-blue-500 text-sm cursor-pointer hover:underline"
                          >
                            Xem chi tiết
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          {order.address}
                        </p>
                        <p className="text-green-600 font-medium">
                          {order.status}
                        </p>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="space-y-3 mb-4">
                      {order.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-grow min-w-0">
                            <h4 className="font-medium text-gray-800 mb-1 truncate">
                              {product.name}
                            </h4>
                            <p className="text-red-500 font-medium">
                              {product.price.toLocaleString()}đ
                            </p>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="w-8 text-center font-medium">
                              {product.quantity}
                            </span>
                          </div>

                          <div className="text-right flex-shrink-0 w-24">
                            <div className="font-semibold text-gray-800">
                              {(
                                product.price * product.quantity
                              ).toLocaleString()}
                              đ
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600 mb-1">Tổng tiền</p>
                          <p className="font-semibold text-gray-800">
                            {order.total.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 mb-1">Đã thanh toán</p>
                          <p className="font-semibold text-green-600">
                            {order.originalTotal.toLocaleString()}đ
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 mb-1">Tiền cần đổi trả</p>
                          <p className="font-semibold text-red-600">0đ</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-3">
                      <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">
                        Liên hệ hỗ trợ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Example favorite product cards */}
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src="/images/image_product.png"
                      alt="Sản phẩm 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    Sản phẩm yêu thích 1
                  </h3>
                  <p className="text-red-500 font-semibold mb-3">100,000đ</p>
                  <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Xóa
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src="/images/image_product.png"
                      alt="Sản phẩm 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    Sản phẩm yêu thích 2
                  </h3>
                  <p className="text-red-500 font-semibold mb-3">150,000đ</p>
                  <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Xóa
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src="/images/image_product.png"
                      alt="Sản phẩm 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    Sản phẩm yêu thích 3
                  </h3>
                  <p className="text-red-500 font-semibold mb-3">200,000đ</p>
                  <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Xóa
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src="/images/image_product.png"
                      alt="Sản phẩm 4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    Sản phẩm yêu thích 4
                  </h3>
                  <p className="text-red-500 font-semibold mb-3">250,000đ</p>
                  <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Xóa
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    <img
                      src="/images/image_product.png"
                      alt="Sản phẩm 5"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-1 truncate">
                    Sản phẩm yêu thích 5
                  </h3>
                  <p className="text-red-500 font-semibold mb-3">300,000đ</p>
                  <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
