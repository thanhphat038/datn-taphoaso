import React, { useState, useMemo, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { dataProduct } from '../service/Product.service';
import Cookies from "js-cookie";
import { Search, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Header = () => {
    const token = Cookies.get("auth_token");
    const { cartItems } = useContext(CartContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);

    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);

    React.useEffect(() => {
        const fetchProduct = async () => {
            const item = await dataProduct();
            setProducts(item.data);
        };
        fetchProduct();
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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const totalQuantity = cartItems.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);

    const filteredProducts = useMemo(() => (
        query.trim() ? products.filter(product => product.name?.toLowerCase().includes(query.toLowerCase())).slice(0, 5) : []
    ), [query, products]);

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
        Cookies.remove("auth_token");
        window.location.reload();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
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
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                            {isSearchFocused && query.trim() && (
                                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {filteredProducts.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            Không tìm thấy sản phẩm
                                        </div>
                                    ) : (
                                        <div>
                                            {filteredProducts.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={`/product/${product.id}`}
                                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                                    onClick={() => {
                                                        setQuery("");
                                                        setIsSearchFocused(false);
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <img 
                                                            src={product.image || "/images/image_product.png"} 
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
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalQuantity}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {token ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <User className="h-6 w-6" />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Thông tin cá nhân
                                        </Link>
                                        <Link
                                            to="/profile/order"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Đơn hàng của tôi
                                        </Link>
                                        <Link
                                            to="/profile/favorite"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            Sản phẩm yêu thích
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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
            </div>
        </header>
    );
};

export default Header;