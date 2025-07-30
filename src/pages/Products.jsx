import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../components/Product';
import { 
  Filter, 
  Grid3X3, 
  List, 
  ChevronLeft, 
  ChevronRight,
  Search,
  X,
  SlidersHorizontal
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';

const ProductsPage = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPriceRange, setSelectedPriceRange] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'rating'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const productsPerPage = 12;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryId = params.get('category');
        if (categoryId) {
            setSelectedCategoryId(categoryId);
        }
    }, [location.search]);

    // Fetch products và categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch products
                const productsResponse = await fetch(`${API_BASE_URL}/products`);
                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch products');
                }
                const productsResult = await productsResponse.json();
                setProducts(productsResult.data || []);

                // Fetch categories
                const categoriesResponse = await fetch(`${API_BASE_URL}/categories`);
                if (categoriesResponse.ok) {
                    const categoriesResult = await categoriesResponse.json();
                    setCategories(categoriesResult.data || []);
                }
            } catch (error) {
                setError('Không thể tải danh sách sản phẩm: ' + error.message);
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Đếm số sản phẩm theo category
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

    const filterAndSortProducts = (products) => {
        let result = products;

        // Filter by search query
        if (searchQuery.trim()) {
            result = result.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategoryId !== null) {
            result = result.filter(product => product.category_id === selectedCategoryId);
        }

        // Filter by price range
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

        // Sort products
        result.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'rating':
                    aValue = a.rating?.rate || 0;
                    bValue = b.rating?.rate || 0;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return result;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPriceRange, selectedCategoryId, searchQuery, sortBy, sortOrder]);

    const filteredProducts = filterAndSortProducts(products);
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex).map((element, index) => (
        <Product key={element._id || index} data={element} />
    ));

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pageNumbers.push(i);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
            }
        }

        return pageNumbers;
    };

    const clearAllFilters = () => {
        setSelectedCategoryId(null);
        setSelectedPriceRange(null);
        setSearchQuery('');
        setSortBy('name');
        setSortOrder('asc');
    };

    const activeFiltersCount = [
        selectedCategoryId !== null,
        selectedPriceRange !== null,
        searchQuery.trim() !== '',
        sortBy !== 'name' || sortOrder !== 'asc'
    ].filter(Boolean).length;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải sản phẩm...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-xl mb-4">⚠️</div>
                            <p className="text-red-600 mb-2">Lỗi tải dữ liệu</p>
                            <p className="text-gray-600 text-sm mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
                    <p className="text-gray-600">
                        Tìm thấy {totalProducts} sản phẩm
                        {selectedCategoryId && ` trong danh mục "${categories.find(c => c._id === selectedCategoryId)?.name || 'Unknown'}"`}
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Grid3X3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list' 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Sắp xếp:</label>
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy);
                                    setSortOrder(newSortOrder);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name-asc">Tên A-Z</option>
                                <option value="name-desc">Tên Z-A</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                                <option value="rating-desc">Đánh giá cao nhất</option>
                            </select>
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Bộ lọc
                            {activeFiltersCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedCategoryId && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {categories.find(c => c._id === selectedCategoryId)?.name || 'Category'}
                                    <button
                                        onClick={() => setSelectedCategoryId(null)}
                                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {selectedPriceRange && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    {selectedPriceRange === 'under-200' && 'Dưới 200.000đ'}
                                    {selectedPriceRange === '200-500' && '200.000đ - 500.000đ'}
                                    {selectedPriceRange === '500-1000' && '500.000đ - 1.000.000đ'}
                                    {selectedPriceRange === 'over-1000' && 'Trên 1.000.000đ'}
                                    <button
                                        onClick={() => setSelectedPriceRange(null)}
                                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                    Tìm: "{searchQuery}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-gray-500 hover:text-gray-700 underline"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex gap-6">
                    
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block w-80 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            
                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                    <span>Danh mục</span>
                                    {selectedCategoryId && (
                                        <button
                                            onClick={() => setSelectedCategoryId(null)}
                                            className="text-sm text-blue-500 hover:text-blue-700"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </h3>
                                <div className="space-y-2">
                                    <div
                                        className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                            selectedCategoryId === null 
                                                ? 'bg-blue-50 border border-blue-200' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => setSelectedCategoryId(null)}
                                    >
                                        <span className="text-sm">Tất cả</span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {products.length}
                                        </span>
                                    </div>
                                    {categories.map(category => (
                                        <div
                                            key={category._id}
                                            className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                                selectedCategoryId === category._id 
                                                    ? 'bg-blue-50 border border-blue-200' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedCategoryId(category._id)}
                                        >
                                            <span className="text-sm">{category.name}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {getCategoryCount(category._id)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                                    <span>Khoảng giá</span>
                                    {selectedPriceRange && (
                                        <button
                                            onClick={() => setSelectedPriceRange(null)}
                                            className="text-sm text-blue-500 hover:text-blue-700"
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'under-200', label: 'Dưới 200.000đ' },
                                        { value: '200-500', label: '200.000đ - 500.000đ' },
                                        { value: '500-1000', label: '500.000đ - 1.000.000đ' },
                                        { value: 'over-1000', label: 'Trên 1.000.000đ' }
                                    ].map(range => (
                                        <div
                                            key={range.value}
                                            className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                                selectedPriceRange === range.value 
                                                    ? 'bg-blue-50 border border-blue-200' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedPriceRange(range.value)}
                                        >
                                            <span className="text-sm">{range.label}</span>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {getPriceRangeCount(range.value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Filters */}
                    {isFilterOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">Bộ lọc</h3>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Categories */}
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-3">Danh mục</h4>
                                        <div className="space-y-2">
                                            <div
                                                className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                                    selectedCategoryId === null 
                                                        ? 'bg-blue-50 border border-blue-200' 
                                                        : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => setSelectedCategoryId(null)}
                                            >
                                                <span className="text-sm">Tất cả</span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                    {products.length}
                                                </span>
                                            </div>
                                            {categories.map(category => (
                                                <div
                                                    key={category._id}
                                                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                                        selectedCategoryId === category._id 
                                                            ? 'bg-blue-50 border border-blue-200' 
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => setSelectedCategoryId(category._id)}
                                                >
                                                    <span className="text-sm">{category.name}</span>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {getCategoryCount(category._id)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-3">Khoảng giá</h4>
                                        <div className="space-y-2">
                                            {[
                                                { value: 'under-200', label: 'Dưới 200.000đ' },
                                                { value: '200-500', label: '200.000đ - 500.000đ' },
                                                { value: '500-1000', label: '500.000đ - 1.000.000đ' },
                                                { value: 'over-1000', label: 'Trên 1.000.000đ' }
                                            ].map(range => (
                                                <div
                                                    key={range.value}
                                                    className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-colors ${
                                                        selectedPriceRange === range.value 
                                                            ? 'bg-blue-50 border border-blue-200' 
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => setSelectedPriceRange(range.value)}
                                                >
                                                    <span className="text-sm">{range.label}</span>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        {getPriceRangeCount(range.value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1">
                        {currentProducts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-500 mb-4">
                                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`grid gap-6 ${
                                    viewMode === 'grid' 
                                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                                        : 'grid-cols-1'
                                }`}>
                                    {currentProducts}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <nav className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-lg border transition-colors ${
                                                    currentPage === 1
                                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>

                                            {getPageNumbers().map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-2 rounded-lg border transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-500 text-white border-blue-500'
                                                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-lg border transition-colors ${
                                                    currentPage === totalPages
                                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
