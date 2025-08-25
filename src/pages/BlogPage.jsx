import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, getAllBlogCategories, getBlogsByCategory } from '../service/Blog.service.js';

const BlogCard = ({ _id, image, title, description, create_at }) => (
    <Link to={`/blog/${_id}`} className="group block h-full">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2 border border-gray-100">
            <div className="h-64 relative overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                    {new Date(create_at).toLocaleDateString('vi-VN')}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
                    {description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors duration-300">
                        Đọc thêm →
                    </span>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </Link>
);

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, totalPosts }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lọc theo danh mục</h3>
                <p className="text-sm text-gray-600">
                    {selectedCategory ? `Đang hiển thị: ${selectedCategory.name}` : 'Tất cả bài viết'}
                </p>
            </div>
            <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                {totalPosts} bài viết
            </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <button
                onClick={() => onCategoryChange(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !selectedCategory
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                Tất cả
            </button>
            {categories.map((category) => (
                <button
                    key={category._id}
                    onClick={() => onCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory && selectedCategory._id === category._id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    </div>
);

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12); // 12 blog mỗi trang

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesResponse = await getAllBlogCategories();
                setCategories(categoriesResponse.data.data || []);
                
                // Fetch blogs
                const blogsResponse = await getAllBlogs();
                setBlogPosts(blogsResponse.data.data || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter blogs based on selected category
    const filteredBlogs = blogPosts.filter(blog => {
        if (!selectedCategory) return true;
        return blog.category_id === selectedCategory._id;
    });

    // Pagination calculations
    const totalBlogs = filteredBlogs.length;
    const totalPages = Math.ceil(totalBlogs / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + pageSize);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Get page numbers for pagination
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

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when changing category
    };

    if (loading && blogPosts.length === 0) {
        return (
            <div className="min-h-screen bg-[#F5FBFB] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400 opacity-20"></div>
                    </div>
                    <p className="mt-6 text-gray-600 font-medium">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F5FBFB] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5FBFB]">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
                <div className="relative container mx-auto max-w-7xl px-4 py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Blog Thực Phẩm
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Khám phá những bài viết về dinh dưỡng, sức khỏe và các mẹo chế biến thực phẩm tốt cho gia đình
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Dinh dưỡng</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                <span>Sức khỏe</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Thực phẩm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <div className="container mx-auto max-w-7xl px-4 py-12">
                {/* Category Filter */}
                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        totalPosts={totalBlogs}
                    />
                )}

                {/* Loading State for Category Change */}
                {loading && blogPosts.length > 0 && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600"></div>
                            <span className="text-gray-600">Đang tải...</span>
                        </div>
                    </div>
                )}

                {/* Blog Grid */}
                {!loading && (
                    <>
                        {filteredBlogs.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {selectedCategory ? `Không có bài viết nào trong danh mục "${selectedCategory.name}"` : 'Chưa có bài viết nào'}
                                </h3>
                                <p className="text-gray-500">
                                    {selectedCategory 
                                        ? 'Hãy thử chọn danh mục khác hoặc quay lại sau'
                                        : 'Hãy quay lại sau để xem những bài viết mới nhất'
                                    }
                                </p>
                                {selectedCategory && (
                                    <button
                                        onClick={() => handleCategoryChange(null)}
                                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Xem tất cả bài viết
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Blog Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                    {paginatedBlogs.map((post) => (
                                        <BlogCard key={post._id} {...post} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mb-8">
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
                                )}

                                {/* Page Info */}
                                {totalPages > 1 && (
                                    <div className="text-center text-sm text-gray-500 mb-4">
                                        Hiển thị {paginatedBlogs.length} trong tổng số {totalBlogs} bài viết (Trang {currentPage} / {totalPages})
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 mt-16">
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Đăng ký nhận tin tức
                    </h2>
                    <p className="text-blue-100 mb-8 text-lg">
                        Nhận những bài viết mới nhất về dinh dưỡng và sức khỏe
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="Nhập email của bạn" 
                            className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 outline-none"
                        />
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
