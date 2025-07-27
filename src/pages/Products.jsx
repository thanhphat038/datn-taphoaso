import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../components/Product';

const API_BASE_URL = 'http://localhost:3000/api';

const ProductsPage = () => {

    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const productsPerPage = 16;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('category');
        if (categoryId) {
            setSelectedCategoryId(categoryId);
        }
    }, [location.search]);

    // Fetch products từ API trực tiếp
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const result = await response.json();
                setProducts(result.data || []);
            } catch (error) {
                setError('Không thể tải danh sách sản phẩm: ' + error.message);
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categoryList = [
        { id: "684697023d545550b38460cd", name: "Mì ăn liền" },
        { id: "68693d5117edd67c23b67bc1", name: "Nước uống" },
    ];

    // Đếm số sản phẩm theo id danh mục
    const getCategoryCount = (categoryId) => {
        return products.filter(product => product.category_id === categoryId).length;
    };


    const getPriceRangeCount = (range) => {
        return products.filter(product => {
            const price = product.price;
            switch (range) {
                case 'under-200': return price < 200000;
                case '200-500': return price >= 200000 && price <= 500000;
                case '500-1000': return price > 500000 && price <= 1000000;
                case 'over-1000': return price > 1000000;
                default: return true;
            }
        }).length;
    };

    const filterProducts = (products) => {
        let result = products;

        if (selectedCategoryId !== null) {
            result = result.filter(product => product.category_id === selectedCategoryId);
        }

        if (selectedPriceRange) {
            result = result.filter(product => {
                const price = product.price;
                switch (selectedPriceRange) {
                    case 'under-200': return price < 200000;
                    case '200-500': return price >= 200000 && price <= 500000;
                    case '500-1000': return price > 500000 && price <= 1000000;
                    case 'over-1000': return price > 1000000;
                    default: return true;
                }
            });
        }

        return result;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPriceRange, selectedCategoryId]);

    const filteredProducts = filterProducts(products);
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex).map((element, index) => (
        <Product key={index} data={element} />
    ));

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
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

    const getProductsByCategory = (categoryId, limit = 5) => {
        if (loading) {
            // Hiển thị skeleton loading
            return Array.from({ length: limit }, (_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded mb-1"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
            ));
        }

        if (error) {
            return (
                <div className="col-span-full text-center py-8">
                    <p className="text-red-600">Không thể tải sản phẩm</p>
                </div>
            );
        }
        // Lọc sản phẩm theo id danh mục (so sánh chuỗi)
        const filteredProducts = products.filter(product => product.category_id === categoryId);
        // Log ra để kiểm tra
        // console.log('categoryId:', categoryId);
        // console.log('filteredProducts:', filteredProducts);

        if (filteredProducts.length === 0) {
            return (
                <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">Không có sản phẩm nào trong danh mục này</p>
                </div>
            );
        }

        return filteredProducts.slice(0, limit).map((product, index) => (
            <Product key={product._id || index} data={product} />
        ));
    };
    // Hiển thị loading state
    if (loading) {
        return (
            <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <div className='flex justify-center items-center h-96'>
                        <div className='text-center'>
                            <div className='animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6'></div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Đang tải sản phẩm...</h2>
                            <p className='text-gray-600'>Vui lòng chờ trong giây lát</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Hiển thị error state
    if (error) {
        return (
            <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <div className='flex justify-center items-center h-96'>
                        <div className='text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
                            <div className='text-red-500 text-6xl mb-4'>⚠️</div>
                            <h2 className='text-2xl font-bold text-gray-800 mb-2'>Lỗi tải dữ liệu</h2>
                            <p className='text-gray-600 mb-6 max-w-md'>{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className='px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 font-medium'
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
        <main className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>Sản phẩm</h1>
                    <p className='text-gray-600'>Khám phá các sản phẩm chất lượng của chúng tôi</p>
                </div>

                <div className='flex gap-8'>
                    {/* Sidebar Filters */}
                    <div className='w-80 flex-shrink-0'>
                        <div className='sticky top-4 space-y-6'>
                            {/* Category Filter */}
                            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='text-xl font-bold text-gray-800'>Danh mục</h2>
                                    {selectedCategoryId && (
                                        <button
                                            onClick={() => setSelectedCategoryId(null)}
                                            className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>
                                <div className='space-y-2'>
                                    {categoryList.map(category => (
                                        <div
                                            key={category.id}
                                            className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                            ${selectedCategoryId === category.id 
                                                ? 'bg-blue-50 border border-blue-200' 
                                                : 'hover:bg-gray-50 border border-transparent'}`}
                                            onClick={() => setSelectedCategoryId(category.id)}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <input
                                                    type="radio"
                                                    id={category.id}
                                                    className='w-4 h-4 text-blue-600'
                                                    name="category"
                                                    checked={selectedCategoryId === category.id}
                                                    onChange={() => setSelectedCategoryId(category.id)}
                                                />
                                                <label htmlFor={category.id} className='font-medium text-gray-700'>{category.name}</label>
                                            </div>
                                            <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                                {getCategoryCount(category.id)}
                                            </span>
                                        </div>
                                    ))}
                                    {/* All Categories */}
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                        ${selectedCategoryId === null 
                                            ? 'bg-blue-50 border border-blue-200' 
                                            : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedCategoryId(null)}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="radio"
                                                id="all"
                                                className='w-4 h-4 text-blue-600'
                                                name="category"
                                                checked={selectedCategoryId === null}
                                                onChange={() => setSelectedCategoryId(null)}
                                            />
                                            <label htmlFor="all" className='font-medium text-gray-700'>Tất cả</label>
                                        </div>
                                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                            {products.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h2 className='text-xl font-bold text-gray-800'>Khoảng giá</h2>
                                    {selectedPriceRange && (
                                        <button
                                            onClick={() => setSelectedPriceRange(null)}
                                            className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                                        >
                                            Xóa bộ lọc
                                        </button>
                                    )}
                                </div>
                                <div className='space-y-2'>
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                        ${selectedPriceRange === 'under-200' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedPriceRange('under-200')}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="radio"
                                                id="price1"
                                                className='w-4 h-4 text-blue-600'
                                                name="price"
                                                checked={selectedPriceRange === 'under-200'}
                                                onChange={() => setSelectedPriceRange('under-200')}
                                            />
                                            <label htmlFor="price1" className='font-medium text-gray-700'>Dưới 200.000đ</label>
                                        </div>
                                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                            {getPriceRangeCount('under-200')}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                        ${selectedPriceRange === '200-500' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedPriceRange('200-500')}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="radio"
                                                id="price2"
                                                className='w-4 h-4 text-blue-600'
                                                name="price"
                                                checked={selectedPriceRange === '200-500'}
                                                onChange={() => setSelectedPriceRange('200-500')}
                                            />
                                            <label htmlFor="price2" className='font-medium text-gray-700'>200.000đ - 500.000đ</label>
                                        </div>
                                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                            {getPriceRangeCount('200-500')}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                        ${selectedPriceRange === '500-1000' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedPriceRange('500-1000')}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="radio"
                                                id="price3"
                                                className='w-4 h-4 text-blue-600'
                                                name="price"
                                                checked={selectedPriceRange === '500-1000'}
                                                onChange={() => setSelectedPriceRange('500-1000')}
                                            />
                                            <label htmlFor="price3" className='font-medium text-gray-700'>500.000đ - 1.000.000đ</label>
                                        </div>
                                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                            {getPriceRangeCount('500-1000')}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all duration-200
                                        ${selectedPriceRange === 'over-1000' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                                        onClick={() => setSelectedPriceRange('over-1000')}
                                    >
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type="radio"
                                                id="price4"
                                                className='w-4 h-4 text-blue-600'
                                                name="price"
                                                checked={selectedPriceRange === 'over-1000'}
                                                onChange={() => setSelectedPriceRange('over-1000')}
                                            />
                                            <label htmlFor="price4" className='font-medium text-gray-700'>Trên 1.000.000đ</label>
                                        </div>
                                        <span className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                            {getPriceRangeCount('over-1000')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className='flex-1'>
                        {/* Results Header */}
                        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <h2 className='text-xl font-bold text-gray-800'>Kết quả tìm kiếm</h2>
                                    <p className='text-gray-600 mt-1'>
                                        Hiển thị {currentProducts.length} trong tổng số {totalProducts} sản phẩm
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-gray-500'>Trang {currentPage} / {totalPages}</p>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
                            {currentProducts}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
                                <div className='flex justify-center items-center gap-2'>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200
                                        ${currentPage === 1 
                                            ? 'opacity-50 cursor-not-allowed border-gray-200' 
                                            : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    {getPageNumbers().map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200
                                            ${currentPage === pageNum
                                                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                                : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-200
                                        ${currentPage === totalPages 
                                            ? 'opacity-50 cursor-not-allowed border-gray-200' 
                                            : 'border-gray-300 hover:bg-blue-50 hover:border-blue-300'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductsPage;
