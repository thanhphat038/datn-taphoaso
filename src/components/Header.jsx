import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { dataProduct } from '../service/Product.service';
import Cookies from "js-cookie";
import { getCart } from '../service/Cart.service';

const Header = () => {
    const token = Cookies.get("auth_token");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await getCart();
                setCartItems(res.data.data.items); // hoặc res.data.items tùy API trả về
            } catch (err) {
                setCartItems([]);
            }
        };
        fetchCart();

        // Debounce để tránh gọi API quá nhiều
        let debounceTimer;
        const handleCartUpdate = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchCart();
            }, 300);
        };
        
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            clearTimeout(debounceTimer);
        };
    }, []);
    

    const totalQuantity = cartItems.reduce((total, item) => total + (item.qty || item.quantity || 0), 0);
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
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
// console.log(products.data[0]);
    // const filteredProducts = products.filter((product) =>
    //     product.data.name.toLowerCase().includes(query.toLowerCase())
    // );
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
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
                // Navigate to selected product
                navigate(`/product/${filteredProducts[selectedIndex]._id || filteredProducts[selectedIndex].id}`);
                setQuery("");
                setSelectedIndex(-1);
            } else {
                handleSearch();
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => 
                prev < filteredProducts.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === "Escape") {
            setQuery("");
            setSelectedIndex(-1);
            setIsFocused(false);
        }
    };


    return (
        <header className='h-[80px] w-full border-b-1 border-[#9F9F9F]'>
            <div className='w-[1240px] h-full m-auto flex place-content-between place-items-center gap-20'>

                <Link to="/">
                    <img className='w-[185px] hover:opacity-90 transition-opacity' src="/images/logo_ngang.png" alt="Logo" />
                </Link>

                <Navbar />

                <div className='flex place-content-end place-items-center gap-10'>




                    <div className='z-100'>

                        <div className='bg-white border-1 border-[#9F9F9F] rounded-full w-[265px] h-[40px] flex overflow-hidden'>

                            <input 
                                className='w-full px-4 outline-0 text-gray-800 placeholder-gray-500 font-medium [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none' 
                                placeholder='Tìm kiếm sản phẩm...' 
                                type="search"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(-1);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                autoComplete="off"
                            />

                            {query && (
                                <button 
                                    className='px-2 cursor-pointer hover:bg-[#06AEF4]/10 text-gray-400 hover:text-[#06AEF4] transition-colors rounded-full' 
                                    onClick={() => setQuery("")}
                                    title="Xóa tìm kiếm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <button 
                                className='px-3 cursor-pointer hover:bg-[#06AEF4]/10 text-gray-600 hover:text-[#06AEF4] transition-colors' 
                                onClick={handleSearch}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>

                        {query === "" || !isFocused ? null :
                            <div className='absolute bg-white border border-gray-200 rounded-xl w-[320px] shadow-xl top-[50px] z-50 max-h-96 overflow-hidden backdrop-blur-sm bg-white/95'>
                                <div className='p-3'>
                                    {filteredProducts.length === 0 ? (
                                        <div className='flex items-center gap-3 p-4 text-gray-500'>
                                            <div className='w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            <span className='text-sm font-medium'>Không tìm thấy sản phẩm</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className='text-xs text-gray-500 px-3 py-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg -mx-3 -mt-3 mb-2'>
                                                <div className='flex items-center gap-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    Tìm thấy {filteredProducts.length} sản phẩm
                                                </div>
                                            </div>
                                            <div className='space-y-1 max-h-64 overflow-y-auto'>
                                                {filteredProducts.slice(0, 6).map((product, index) => (
                                                    <Link 
                                                        key={product._id || product.id} 
                                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group border-2 ${
                                                            index === selectedIndex 
                                                                ? 'bg-[#06AEF4]/10 border-[#06AEF4] shadow-sm' 
                                                                : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                                                        }`}
                                                        to={`/product/${product._id || product.id}`}
                                                        onClick={() => {
                                                            setQuery("");
                                                            setSelectedIndex(-1);
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                    >
                                                        <div className='w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm'>
                                                            <img 
                                                                src={product.images?.[0] || '/images/image_product.png'} 
                                                                alt={product.name}
                                                                className='w-full h-full object-cover'
                                                                onError={(e) => {
                                                                    e.target.src = '/images/image_product.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className='flex-1 min-w-0'>
                                                            <div className='font-medium text-gray-800 group-hover:text-[#06AEF4] transition-colors truncate text-sm'>
                                                                {product.name}
                                                            </div>
                                                            <div className='text-sm text-red-500 font-semibold mt-1'>
                                                                {product.price?.toLocaleString()}₫
                                                            </div>
                                                        </div>
                                                        <div className='text-gray-400 group-hover:text-[#06AEF4] transition-colors'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                            {filteredProducts.length > 6 && (
                                                <div className='border-t border-gray-100 p-3 -mx-3 -mb-3 bg-gray-50/30 rounded-b-lg'>
                                                    <Link 
                                                        className='w-full text-center text-sm text-[#06AEF4] hover:text-[#70d9ff] font-medium block py-2 rounded-lg hover:bg-[#06AEF4]/5 transition-colors'
                                                        to={`/search/${encodeURIComponent(query.trim())}`}
                                                        onClick={() => setQuery("")}
                                                    >
                                                        Xem tất cả {filteredProducts.length} kết quả
                                                    </Link>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        }

                    </div>







                    <Link to="/cart" className="relative group">
                        <div className="flex place-content-end place-items-center cursor-pointer hover:text-blue-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalQuantity}
                                </span>
                            )}
                        </div>
                    </Link>
                     {token ? (
                    <div>
                        <Link to="/profile" className="relative group">
                            <div className='flex place-content-end place-items-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    ) : (
                    <div>
                        <Link to="/login" className="relative group">
                            <div className='flex place-content-end place-items-center cursor-pointer'>
                                login
                            </div>
                        </Link>
                    </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Header;