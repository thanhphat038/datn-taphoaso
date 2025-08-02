import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBlogById, getAllBlogs } from '../service/Blog.service.jsx';

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <Link to="/blog" className="mt-4 text-blue-600 hover:underline">
                        Quay lại trang blog
                    </Link>
                </div>
            </div>
        );
    }

    if (!blogDetail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy bài viết</p>
                    <Link to="/blog" className="mt-4 text-blue-600 hover:underline">
                        Quay lại trang blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center space-x-1 font-medium"
                    style={{ color: '#06AEF4' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
                    onMouseLeave={e => e.currentTarget.style.color = '#06AEF4'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Quay lại trang blog</span>
                </button>
            </div>
            <div className="mb-8">
                <img src={blogDetail.image} alt={blogDetail.title} className="w-full max-w-3xl mx-auto rounded-lg shadow-md" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                <h1 className="text-3xl font-bold mt-6 mb-2">{blogDetail.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span>{new Date(blogDetail.create_at).toLocaleDateString('vi-VN')}</span>
                    {blogDetail.author && (
                        <>
                            <span> | </span>
                            <span>{blogDetail.author}</span>
                        </>
                    )}
                </div>
                <div
                    className="blog-content prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: blogDetail.content }}
                />
            </div>

            {relatedPosts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Bài viết liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {relatedPosts.map(post => (
                            <Link key={post._id} to={`/blog/${post._id}`} className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                                <div className="w-full h-48 overflow-hidden relative">
                                    <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2 truncate">{post.title}</h3>
                                    <p className="text-gray-500 text-sm">
                                        {new Date(post.create_at).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-gray-700 text-sm line-clamp-3 mt-2">
                                        {post.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetailPage;
