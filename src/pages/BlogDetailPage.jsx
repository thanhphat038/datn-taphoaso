import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogById, getAllBlogs } from '../service/Blog.service.jsx';

const RelatedPostCard = ({ post }) => (
    <Link to={`/blog/${post._id}`} className="group block">
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="h-48 relative overflow-hidden">
                <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                    {new Date(post.create_at).toLocaleDateString('vi-VN')}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {post.description}
                </p>
            </div>
        </div>
    </Link>
);

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blogDetail, setBlogDetail] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const response = await getBlogById(id);
                setBlogDetail(response.data.data);
                
                // Fetch related posts (excluding current post)
                const relatedResponse = await getAllBlogs(1, 3);
                const allPosts = relatedResponse.data.data || [];
                const filteredPosts = allPosts.filter(post => post._id !== id);
                setRelatedPosts(filteredPosts.slice(0, 3));
            } catch (err) {
                console.error('Error fetching blog detail:', err);
                setError('Không thể tải chi tiết bài viết');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogDetail();
        }
    }, [id]);

    if (loading) {
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
                        <Link to="/blog" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                            Quay lại trang blog
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!blogDetail) {
        return (
            <div className="min-h-screen bg-[#F5FBFB] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Không tìm thấy bài viết</h3>
                        <p className="text-gray-600 mb-4">Bài viết này có thể đã bị xóa hoặc không tồn tại</p>
                        <Link to="/blog" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                            Quay lại trang blog
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5FBFB]">
            {/* Navigation */}
            <div className="container mx-auto max-w-7xl px-4 py-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Quay lại</span>
                </button>
            </div>

            <div className="container mx-auto max-w-7xl px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Image */}
                        <div className="relative mb-8">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                <img 
                                    src={blogDetail.image} 
                                    alt={blogDetail.title} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
                        </div>

                        {/* Article Header */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(blogDetail.create_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                                {blogDetail.author && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{blogDetail.author}</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                                {blogDetail.title}
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                {blogDetail.description}
                            </p>
                        </div>

                        {/* Article Content */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg"
                                dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                            />
                        </div>

                        {/* Article Footer */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Thích bài viết này?</p>
                                        <p className="text-sm text-gray-600">Chia sẻ với bạn bè</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                    </button>
                                    <button className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                        </svg>
                                    </button>
                                    <button className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors duration-300">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Author Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Về tác giả</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {blogDetail.author || 'Tác giả'}
                                        </p>
                                        <p className="text-sm text-gray-600">Chuyên gia dinh dưỡng</p>
                                    </div>
                                </div>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết liên quan</h3>
                                    <div className="space-y-4">
                                        {relatedPosts.map(post => (
                                            <RelatedPostCard key={post._id} post={post} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
