import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

const BlogCard = ({ id, image, title, description, date }) => (
    <Link to={`/blog/${id}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="h-72 flex items-center justify-center overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-2 flex-grow">{description}</p>
            <p className="text-gray-500 text-xs mt-auto">{date}</p>
        </div>
        </div>
    </Link>
);

const BlogPage = () => {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', description: '' });

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('auth_token');
            const response = await axios.get('http://localhost:3000/api/blogs_categories?status=active', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Không thể tải danh mục blog');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setEditForm({
            name: category.name,
            description: category.description || ''
        });
        setShowEditModal(true);
    };

    const handleUpdateCategory = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('auth_token');
            await axios.put(`http://localhost:3000/api/blogs_categories/${editingCategory._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh categories
            await fetchCategories();
            setShowEditModal(false);
            setEditingCategory(null);
            setEditForm({ name: '', description: '' });
        } catch (error) {
            console.error('Error updating category:', error);
            setError('Không thể cập nhật danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            return;
        }

        try {
            setLoading(true);
            const token = Cookies.get('auth_token');
            await axios.delete(`http://localhost:3000/api/blogs_categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh categories
            await fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Không thể xóa danh mục');
        } finally {
            setLoading(false);
        }
    };

    const blogPosts = [
        {
            id: 1,
            image: "/images/healthy-food.jpg",
            title: "Top 10 Thực Phẩm Tốt Cho Sức Khỏe Bạn Nên Bổ Sung Hàng Ngày",
            description: "Khám phá 10 loại thực phẩm giàu dinh dưỡng nên có trong thực đơn hàng ngày của bạn. Từ cá hồi giàu omega-3 đến các loại rau xanh bổ dưỡng.",
            date: "20/01/2024"
        },
        {
            id: 2,
            image: "/images/promo1.png",
            title: "Chế độ ăn Địa Trung Hải - Bí quyết sống khỏe từ thiên nhiên",
            description: "Tìm hiểu về chế độ ăn Địa Trung Hải và những lợi ích sức khỏe tuyệt vời từ phương pháp ăn uống này.",
            date: "19/01/2024"
        },
        {
            id: 3,
            image: "/images/promo2.png",
            title: "5 Loại Hạt Dinh Dưỡng Cần Có Trong Bữa Ăn Hàng Ngày",
            description: "Khám phá các loại hạt giàu dinh dưỡng và cách kết hợp chúng vào chế độ ăn hàng ngày của bạn.",
            date: "18/01/2024"
        },
        {
            id: 4,
            image: "/images/promo3.png",
            title: "Nguồn Protein Thực Vật Tốt Cho Sức Khỏe",
            description: "Tìm hiểu về các nguồn protein thực vật phong phú và cách đưa chúng vào thực đơn hàng ngày.",
            date: "17/01/2024"
        },
        {
            id: 5,
            image: "/images/blog5.jpg",
            title: "Lợi Ích Của Việc Uống Nước Đúng Cách Mỗi Ngày",
            description: "Khám phá những lợi ích sức khỏe khi bạn duy trì thói quen uống nước đúng cách hàng ngày.",
            date: "16/01/2024"
        },
        {
            id: 6,
            image: "/images/blog6.jpg",
            title: "Các Bài Tập Thể Dục Giúp Tăng Cường Sức Khỏe Tim Mạch",
            description: "Tổng hợp các bài tập thể dục hiệu quả giúp cải thiện sức khỏe tim mạch và tăng cường thể lực.",
            date: "15/01/2024"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Section */}
            <div className="bg-blue-50 pt-4">
                <div className="container mx-auto w-[1240px]">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-cyan-600">
                            Thực phẩm tốt cho sức khỏe
                        </h1>
                        
                        {/* Category Management Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FaEllipsisV className="w-4 h-4" />
                                Quản lý danh mục
                            </button>
                            
                            {showCategoryDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Danh mục blog</h3>
                                            <button
                                                onClick={() => setShowCategoryDropdown(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        
                                        {error && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                                {error}
                                            </div>
                                        )}
                                        
                                        {loading ? (
                                            <div className="text-center py-4 text-gray-500">
                                                Đang tải...
                                            </div>
                                        ) : (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {categories.length === 0 ? (
                                                    <p className="text-gray-500 text-center py-4">
                                                        Chưa có danh mục nào
                                                    </p>
                                                ) : (
                                                    categories.map((category) => (
                                                        <div
                                                            key={category._id}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-900">
                                                                    {category.name}
                                                                </h4>
                                                                {category.description && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {category.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 ml-3">
                                                                <button
                                                                    onClick={() => handleEditCategory(category)}
                                                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                                    title="Sửa danh mục"
                                                                >
                                                                    <FaEdit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCategory(category._id)}
                                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                                    title="Xóa danh mục"
                                                                >
                                                                    <FaTrash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-center h-96">
                        <img 
                            src="/images/banner1.jpg" 
                            alt="Shopping Banner" 
                            className="max-w-full max-h-96 object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="w-[1240px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((post, index) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>
            </div>

            {/* Edit Category Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingCategory(null);
                                setEditForm({ name: '', description: '' });
                            }}
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-bold mb-4">Sửa danh mục</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateCategory(); }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên danh mục <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập tên danh mục"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mô tả danh mục (tùy chọn)"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingCategory(null);
                                        setEditForm({ name: '', description: '' });
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
