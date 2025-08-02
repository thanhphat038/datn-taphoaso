import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../service/Blog.service.jsx';

const BlogCard = ({ _id, image, title, description, create_at }) => (
    <Link to={`/blog/${_id}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-72 flex items-center justify-center overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-2 flex-grow">{description}</p>
            <p className="text-gray-500 text-xs mt-auto">
                {new Date(create_at).toLocaleDateString('vi-VN')}
            </p>
        </div>
        </div>
    </Link>
);

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const response = await getAllBlogs(1, 20); // Lấy 20 bài viết đầu tiên
                setBlogPosts(response.data.data || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Không thể tải dữ liệu blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-gray-50">
            {/* Banner Section */}
            <div className="bg-blue-50  pt-4">
            <div className="container mx-auto w-[1240px]">
                    <div className="flex justify-center h-96">
                        <img 
                            src="/images/banner1.jpg" 
                            alt="Shopping Banner" 
                            className="max-w-full max-h-96 object-contain rounded-lg "
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-center mt-6 mb-8 text-cyan-600">
                        Thực phẩm tốt cho sức khỏe
                    </h1>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="w-[1240px] mx-auto px-4 py-12">
                {blogPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Chưa có bài viết nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {blogPosts.map((post) => (
                            <BlogCard key={post._id} {...post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
