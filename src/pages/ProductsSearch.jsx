import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchProducts, getProductsByCategory } from '../service/Product.service';
import Product from '../components/Product';
import { useToast } from '../components/ToastContainer';
import axios from 'axios';
import { getApiUrl } from '../config/api.js';

const ProductsSearch = () => {
    const api = getApiUrl('');
    const { showSuccess, showError } = useToast();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'created_at'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const productsPerPage = 16;

    const { value } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let response;
                if (selectedCategoryId) {
                    // Nếu có chọn danh mục, lấy sản phẩm theo danh mục
                    response = await getProductsByCategory(selectedCategoryId, currentPage, productsPerPage);
                } else if (value) {
                    // Nếu có từ khóa, tìm kiếm theo từ khóa
                    try {
                        response = await searchProducts(value, currentPage, productsPerPage, sortBy, sortOrder);
                    } catch (searchError) {
                        // Fallback: sử dụng getAllProducts và lọc client-side
                        const allProductsResponse = await axios.get(`${api}/products`);
                        const allProducts = allProductsResponse.data.data || allProductsResponse.data.products || [];
                        
                        // Lọc theo từ khóa
                        const filteredProducts = allProducts.filter(product => 
                            product.name?.toLowerCase().includes(value.toLowerCase()) ||
                            product.description?.toLowerCase().includes(value.toLowerCase())
                        );
                        
                        response = {
                            data: {
                                data: filteredProducts,
                                total: filteredProducts.length,
                                totalPages: Math.ceil(filteredProducts.length / productsPerPage)
                            }
                        };
                    }
                } else {
                    // Nếu không có gì, lấy tất cả sản phẩm
                    response = await axios.get(`${api}/products`);
                }
                
                // Xử lý response format khác nhau
                let productsData, totalData, totalPagesData;
                
                if (response.data.data && Array.isArray(response.data.data)) {
                    // Format: { status: 200, data: Array, message: "Success" }
                    productsData = response.data.data;
                    totalData = response.data.data.length;
                    totalPagesData = Math.ceil(totalData / productsPerPage);
                } else if (response.data.products) {
                    // Format: { products: Array, total: number, totalPages: number }
                    productsData = response.data.products;
                    totalData = response.data.total;
                    totalPagesData = response.data.totalPages;
                } else {
                    // Fallback
                    productsData = response.data || [];
                    totalData = productsData.length;
                    totalPagesData = Math.ceil(totalData / productsPerPage);
                }
                
                setProducts(productsData);
                setTotalProducts(totalData);
                setTotalPages(totalPagesData);
            } catch (error) {
                console.error('🔍 Debug - Error in fetchProducts:', error);
                console.error('🔍 Debug - Error response:', error.response?.data);
                setError(`Không thể tải danh sách sản phẩm: ${error.response?.data?.message || error.message}`);
                setProducts([]);
                setTotalProducts(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };
        
        if (value || selectedCategoryId) {
            fetchProducts();
        } else if (!value && !selectedCategoryId) {
            // Nếu không có từ khóa và không chọn danh mục, hiển thị tất cả sản phẩm
            fetchProducts();
        }
    }, [value, currentPage, selectedCategoryId, sortBy, sortOrder]);

    // Lọc sản phẩm theo khoảng giá (client-side filtering)
    const filterProductsByPrice = (products) => {
        if (!selectedPriceRange) return products;
        
        return products.filter(product => {
            const price = product.price || 0;
            switch (selectedPriceRange) {
                case 'under-200': return price < 200000;
                case '200-500': return price >= 200000 && price <= 500000;
                case '500-1000': return price > 500000 && price <= 1000000;
                case 'over-1000': return price > 1000000;
                default: return true;
            }
        });
    };

    // Lọc sản phẩm theo giá
    const filteredProducts = filterProductsByPrice(products);

    // Callback để hiển thị thông báo khi thêm vào giỏ hàng thành công
    const handleAddToCartSuccess = (message, type = 'success') => {
        if (type === 'success') {
            showSuccess(message);
        } else {
            showError(message);
        }
    };

    // Tạo danh sách sản phẩm hiển thị
    const userId = (() => {
        const token = Cookies.get('auth_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            } catch (error) {
                return 'guest';
            }
        }
        return 'guest';
    })();

    const currentProducts = filteredProducts.map((element, index) => (
        <Product 
            key={`${element._id}-${userId}-${index}`} 
            data={element} 
            onAddToCartSuccess={handleAddToCartSuccess}
        />
    ));

    // Reset page khi thay đổi filter
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPriceRange, selectedCategoryId, sortBy, sortOrder]);




    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };



    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages)
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        else {
            if (currentPage <= 3)
                for (let i = 1; i <= 5; i++) pageNumbers.push(i);
            else if (currentPage >= totalPages - 2)
                for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
            else
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
        }

        return pageNumbers;
    };






    // Hiển thị loading state
    if (loading) {
        return (
            <main className='w-full bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 min-h-screen'>
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <div className='flex justify-center items-center h-64'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#06AEF4] mx-auto mb-4'></div>
                            <p className='text-gray-600 font-medium'>Đang tải kết quả tìm kiếm...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Hiển thị error state
    if (error) {
        return (
            <main className='w-full bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 min-h-screen'>
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <div className='flex justify-center items-center h-64'>
                        <div className='text-center'>
                            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Lỗi tải dữ liệu</h2>
                            <p className='text-gray-600 mb-4'>{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className='px-6 py-3 bg-[#06AEF4] text-white rounded-lg hover:bg-[#70d9ff] transition-colors font-medium'
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className='w-full bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Sidebar Filters */}
                    <div className='w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-4 h-fit'>
                        {/* Categories Filter */}
                        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold text-gray-800'>Danh mục</h2>
                                {selectedCategoryId && (
                                    <button
                                        onClick={() => setSelectedCategoryId(null)}
                                        className='text-sm text-[#06AEF4] hover:text-[#70d9ff] font-medium'
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedCategoryId === null ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId(null)}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedCategoryId === null ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedCategoryId === null && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>Tất cả</label>
                                    </div>

                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedCategoryId === "684697023d545550b38460cd" ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId("684697023d545550b38460cd")}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedCategoryId === "684697023d545550b38460cd" ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedCategoryId === "684697023d545550b38460cd" && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>Mì ăn liền</label>
                                    </div>

                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedCategoryId === "68693d5117edd67c23b67bc1" ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedCategoryId("68693d5117edd67c23b67bc1")}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedCategoryId === "68693d5117edd67c23b67bc1" ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedCategoryId === "68693d5117edd67c23b67bc1" && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>Nước uống</label>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-bold text-gray-800'>Khoảng giá</h2>
                                {selectedPriceRange && (
                                    <button
                                        onClick={() => setSelectedPriceRange(null)}
                                        className='text-sm text-[#06AEF4] hover:text-[#70d9ff] font-medium'
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedPriceRange === 'under-200' ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('under-200')}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedPriceRange === 'under-200' ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedPriceRange === 'under-200' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>Dưới 200.000₫</label>
                                    </div>

                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedPriceRange === '200-500' ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('200-500')}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedPriceRange === '200-500' ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedPriceRange === '200-500' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>200.000₫ - 500.000₫</label>
                                    </div>

                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedPriceRange === '500-1000' ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('500-1000')}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedPriceRange === '500-1000' ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedPriceRange === '500-1000' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>500.000₫ - 1.000.000₫</label>
                                    </div>

                                </div>
                                <div
                                    className={`flex items-center justify-between cursor-pointer py-3 px-3 rounded-xl transition-all
                                    ${selectedPriceRange === 'over-1000' ? 'bg-[#06AEF4]/10 border border-[#06AEF4]/20' : 'hover:bg-gray-50'}`}
                                    onClick={() => setSelectedPriceRange('over-1000')}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                        ${selectedPriceRange === 'over-1000' ? 'border-[#06AEF4] bg-[#06AEF4]' : 'border-gray-300'}`}>
                                            {selectedPriceRange === 'over-1000' && (
                                                <div className='w-2 h-2 bg-white rounded-full'></div>
                                            )}
                                        </div>
                                        <label className='font-medium text-gray-800 cursor-pointer'>Trên 1.000.000₫</label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='flex-1'>
                        {/* Search Results Header */}
                        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <div>
                                    <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                                        {selectedCategoryId ? 'Sản phẩm theo danh mục' : 
                                         value ? `Kết quả tìm kiếm: "${value}"` : 'Tất cả sản phẩm'}
                                    </h1>
                                    <p className='text-gray-600'>
                                        Tìm thấy {totalProducts} sản phẩm
                                        {selectedCategoryId && ` trong danh mục đã chọn`}
                                        {selectedPriceRange && ` với khoảng giá đã chọn`}
                                        {filteredProducts.length !== totalProducts && ` (${filteredProducts.length} sau khi lọc giá)`}
                                    </p>
                                </div>
                                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                                    <div className='text-left sm:text-right'>
                                        <p className='text-sm text-gray-500'>Trang {currentPage} / {totalPages}</p>
                                        <p className='text-sm text-gray-500'>Hiển thị {filteredProducts.length} / {totalProducts} sản phẩm</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <label className='text-sm font-medium text-gray-700'>Sắp xếp:</label>
                                        <select
                                            value={`${sortBy}-${sortOrder}`}
                                            onChange={(e) => {
                                                const [newSortBy, newSortOrder] = e.target.value.split('-');
                                                setSortBy(newSortBy);
                                                setSortOrder(newSortOrder);
                                            }}
                                            className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent'
                                        >
                                            <option value="name-asc">Tên sản phẩm A-Z</option>
                                            <option value="name-desc">Tên sản phẩm Z-A</option>
                                            <option value="price-asc">Giá tăng dần</option>
                                            <option value="price-desc">Giá giảm dần</option>
                                            <option value="created_at-desc">Mới nhất</option>
                                            <option value="created_at-asc">Cũ nhất</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Products Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className='bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center'>
                                <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                                    {totalProducts === 0 ? 'Không tìm thấy sản phẩm!' : 'Không có sản phẩm nào phù hợp với bộ lọc!'}
                                </h2>
                                <p className='text-gray-600 mb-4'>
                                    {totalProducts === 0 
                                        ? 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc'
                                        : 'Thử điều chỉnh khoảng giá hoặc danh mục'
                                    }
                                </p>
                                <div className='flex justify-center gap-4'>
                                    <button
                                        onClick={() => {
                                            setSelectedCategoryId(null);
                                            setSelectedPriceRange(null);
                                        }}
                                        className='px-4 py-2 bg-[#06AEF4] text-white rounded-lg hover:bg-[#70d9ff] transition-colors'
                                    >
                                        Xóa tất cả bộ lọc
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                                {currentProducts}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && filteredProducts.length > 0 && (
                            <div className='flex justify-center items-center gap-2 mt-8'>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 
                                    ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border 
                                        ${currentPage === pageNum
                                                ? 'bg-[#06AEF4] text-white border-[#06AEF4]'
                                                : 'border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 
                                    ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductsSearch;
