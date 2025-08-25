import React, { useState, useMemo, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import { dataProduct } from '../../service/Product.service';
import { getAllAddress } from '../../service/Address.service';
import { getAllCategories } from '../../service/Admin.Service';
import Cookies from "js-cookie";
import { Search, ShoppingCart, User, Menu, LogOut, MapPin, ChevronRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { logoutUser } from '../../service/user.service';

const Header = () => {
    const token = Cookies.get("auth_token");
    const { cartItems } = useContext(CartContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);
    const addressDropdownRef = useRef(null);

    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState("Chọn địa chỉ giao hàng");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const categoriesDropdownRef = useRef(null);

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const item = await dataProduct();
                
                // Xử lý response format khác nhau
                let productsData;
                if (item.data.data && Array.isArray(item.data.data)) {
                    // Format: { status: 200, data: Array, message: "Success" }
                    productsData = item.data.data;
                } else if (item.data.products) {
                    // Format: { products: Array, total: number, totalPages: number }
                    productsData = item.data.products;
                } else {
                    // Fallback
                    productsData = item.data || [];
                }
                
                setProducts(productsData);
            } catch (error) {
                console.error('❌ Lỗi khi tải products:', error);
                setProducts([]);
            }
        };
        fetchProduct();
    }, []);

    // Fetch địa chỉ khi user đã đăng nhập
    React.useEffect(() => {
        const fetchAddresses = async () => {
            if (token) {
                try {
                    const res = await getAllAddress();
                    const addressData = res.data.data || [];
                    setAddresses(addressData);
                    
                    // Tìm địa chỉ mặc định hoặc lấy địa chỉ đầu tiên
                    const defaultAddress = addressData.find(addr => addr.is_default) || addressData[0];
                    if (defaultAddress) {
                        const fullAddress = `${defaultAddress.address_detail}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.city}`;
                        setDeliveryAddress(fullAddress);
                        setSelectedAddressId(defaultAddress._id);
                    }
                } catch (error) {
                    console.error('❌ Lỗi khi tải địa chỉ:', error);
                }
            }
        };
        fetchAddresses();
    }, [token]);

    // Fetch danh mục sản phẩm
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategories();
                const categoryData = res.data.data || [];
                // Chỉ lấy các danh mục có status active
                const activeCategories = categoryData.filter(cat => cat.status === 'active');
                setCategories(activeCategories);
            } catch (error) {
                console.error('❌ Lỗi khi tải danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    // Close menus when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
                         if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target)) {
                 setIsAddressDropdownOpen(false);
             }
             if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target)) {
                 setShowAllCategories(false);
             }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const totalQuantity = cartItems.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);

    const filteredProducts = useMemo(() => {
        if (!query.trim() || !Array.isArray(products)) {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        const words = searchTerm.split(' ').filter(word => word.length > 0);
        
        return products.filter(product => {
            const productName = product.name?.toLowerCase() || '';
            const productDesc = product.description?.toLowerCase() || '';
            const productCategory = product.category_name?.toLowerCase() || '';
            
            // Tìm kiếm chính xác từ khóa
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                return true;
            }
            
            // Tìm kiếm theo từng từ riêng lẻ
            if (words.length > 1) {
                return words.every(word => 
                    productName.includes(word) || 
                    productDesc.includes(word) || 
                    productCategory.includes(word)
                );
            }
            
            return false;
        }).sort((a, b) => {
            // Sắp xếp theo độ ưu tiên: tên chính xác > tên bắt đầu > tên chứa
            const aName = a.name?.toLowerCase() || '';
            const bName = b.name?.toLowerCase() || '';
            
            const aStartsWith = aName.startsWith(searchTerm);
            const bStartsWith = bName.startsWith(searchTerm);
            
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            return aName.localeCompare(bName);
        });
    }, [query, products]);

    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search/${encodeURIComponent(query.trim())}`);
            setQuery("");
            setIsSearchFocused(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
                handleSearch();
        }
    };

    const handleLogout = () => {
        logoutUser();
    };

    const handleAddressClick = () => {
        if (token) {
            if (addresses.length > 0) {
                setIsAddressDropdownOpen(!isAddressDropdownOpen);
            } else {
                // Nếu chưa có địa chỉ nào, chuyển đến trang thêm địa chỉ
                navigate('/profile/address');
            }
        } else {
            // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
            navigate('/login');
        }
    };

    const handleSelectAddress = (address) => {
        const fullAddress = `${address.address_detail}, ${address.ward}, ${address.district}, ${address.city}`;
        setDeliveryAddress(fullAddress);
        setSelectedAddressId(address._id);
        setIsAddressDropdownOpen(false);
    };

    const handleManageAddresses = () => {
        setIsAddressDropdownOpen(false);
        navigate('/profile/address');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            {/* Top Band - Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-3">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <img 
                                className="h-8 w-auto hover:opacity-80 transition-opacity" 
                                src="/images/logo_ngang.png" 
                                alt="Logo" 
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Trang chủ
                        </Link>
                        <Link 
                            to="/product" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Sản phẩm
                        </Link>
                        <Link 
                            to="/about" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Giới thiệu
                        </Link>
                        <Link 
                            to="/blog" 
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Blog
                </Link>
                    </nav>

                                        {/* Search Bar */}
                    <div className="hidden md:block flex-1 max-w-md mx-8" ref={searchRef}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                                type="text"
                                className="block w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                            {isSearchFocused && query.trim() && (
                                <div className="absolute z-10 w-full mt-2 bg-white shadow-xl rounded-lg border border-gray-200 max-h-60 overflow-auto">
                                    {filteredProducts.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            Không tìm thấy sản phẩm
                                        </div>
                                    ) : (
                                        <div>
                                            {filteredProducts.slice(0, 6).map((product) => (
                                                    <Link 
                                                        key={product._id || product.id} 
                                                        to={`/product/${product._id || product.id}`}
                                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                                        onClick={() => {
                                                            setQuery("");
                                                        setIsSearchFocused(false);
                                                        }}
                                                    >
                                                    <div className="flex items-center space-x-3">
                                                            <img 
                                                            src={product.images?.[0] || product.image || "/images/image_product.png"} 
                                                                alt={product.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                            />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {product.price?.toLocaleString('vi-VN')}đ
                                                            </p>
                                                        </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            {filteredProducts.length > 6 && (
                                                <div className="border-t border-gray-100 p-3">
                                                    <Link 
                                                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium block py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                        to={`/search/${encodeURIComponent(query.trim())}`}
                                                        onClick={() => setQuery("")}
                                                    >
                                                        Xem tất cả {filteredProducts.length} kết quả
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            </div>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart - Only show when logged in */}
                    {token && (
                            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {totalQuantity > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalQuantity}
                                    </span>
                                )}
                        </Link>
                    )}

                        {/* User Menu */}
                     {token ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute top-full -right-2 mt-1 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 transform transition-all duration-200 ease-out">
                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                                                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <span>Thông tin cá nhân</span>
                                            </Link>

                                            <Link
                                                to="/profile/orders"
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200 group"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <span>Đơn hàng của tôi</span>
                                            </Link>

                                            <Link
                                                to="/profile/favorites"
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                                                    <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                                </div>
                                                <span>Sản phẩm yêu thích</span>
                                            </Link>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-100 mx-3"></div>

                                        {/* Logout Button */}
                                        <div className="pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                                            >
                                                <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                                                    <LogOut className="h-3 w-3 text-red-600" />
                                                </div>
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                Đăng nhập
                        </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                            </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/product"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sản phẩm
                            </Link>
                            <Link
                                to="/about"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                to="/blog"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                        </Link>
                        </div>
                    </div>
                )}

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/product"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sản phẩm
                            </Link>
                            <Link
                                to="/about"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                to="/blog"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                    )}
                </div>

            {/* Bottom Band - Categories and Address */}
            <div className="border-t border-gray-100 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-2">
                        {/* Categories */}
                        <div className="hidden md:flex items-center space-x-6 text-sm">
                            {categories.slice(0, 5).map((category) => (
                                <Link 
                                    key={category._id}
                                    to={`/product?category=${category._id}`} 
                                    className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
                                >
                                    {category.name}
                                </Link>
                            ))}
                            {categories.length > 5 && (
                                <div className="relative" ref={categoriesDropdownRef}>
                                    <button
                                        onClick={() => setShowAllCategories(!showAllCategories)}
                                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <span className="text-xs">Xem thêm</span>
                                        <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${showAllCategories ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    {/* Categories Dropdown */}
                                    {showAllCategories && (
                                        <div className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 max-h-60 overflow-auto z-30 min-w-48">
                                            <div className="p-2">
                                                {categories.slice(5).map((category) => (
                                                    <Link 
                                                        key={category._id}
                                                        to={`/product?category=${category._id}`} 
                                                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                                                        onClick={() => setShowAllCategories(false)}
                                                    >
                                                        {category.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Delivery Address */}
                        <div className="hidden md:block" ref={addressDropdownRef}>
                            <div className="relative">
                                <div 
                                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 cursor-pointer transition-colors group"
                                    onClick={handleAddressClick}
                                >
                                    <div className="flex items-center px-2 py-1 rounded-md transition-colors group-hover:bg-white group-hover:shadow-sm">
                                        <MapPin className="h-4 w-4 mr-1 text-gray-500 group-hover:text-blue-500" />
                                        <span className="font-medium text-gray-700 group-hover:text-blue-600">Giao đến:</span>
                                        <span className="ml-1 text-gray-600 group-hover:text-blue-600 max-w-xs truncate underline">
                                            {token ? deliveryAddress : "Đăng nhập để chọn địa chỉ"}
                                        </span>
                                        {token && addresses.length > 0 && (
                                            <svg className="h-4 w-4 ml-1 text-gray-400 group-hover:text-blue-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Address Dropdown */}
                                {isAddressDropdownOpen && token && addresses.length > 0 && (
                                    <div className="absolute z-20 w-80 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 max-h-60 overflow-auto right-0">
                                        <div className="p-3">
                                            <div className="text-sm font-medium text-gray-700 mb-2">Chọn địa chỉ giao hàng:</div>
                                            {addresses.map((address) => (
                                                <div
                                                    key={address._id}
                                                    className={`flex items-start p-2 rounded-md cursor-pointer transition-colors ${
                                                        selectedAddressId === address._id 
                                                            ? 'bg-blue-50 border border-blue-200' 
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => handleSelectAddress(address)}
                                                >
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className={`w-3 h-3 rounded-full border-2 ${
                                                            selectedAddressId === address._id 
                                                                ? 'border-blue-500 bg-blue-500' 
                                                                : 'border-gray-300'
                                                        }`}></div>
                                                    </div>
                                                    <div className="ml-3 flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {address.receiver} - {address.phone}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {address.address_detail}, {address.ward}, {address.district}, {address.city}
                                                        </div>
                                                        {address.is_default && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                                Mặc định
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleManageAddresses}
                                                    className="w-full text-left px-2 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center"
                                                >
                                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Quản lý địa chỉ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;