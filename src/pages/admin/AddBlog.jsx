import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage, FaUpload } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    status: 'draft'
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch blog');
          }
          const result = await response.json();
          const blog = result.data;
          
          setFormData({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            image: blog.image || '',
            category: blog.category || '',
            status: blog.status || 'draft'
          });

          if (blog.image) {
            setImagePreview(blog.image);
          }
        } catch (error) {
          setError('Không thể tải thông tin bài viết: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload image
      const formData = new FormData();
      formData.append('image', file);

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        image: result.url
      }));
    } catch (error) {
      setError('Lỗi khi tải lên hình ảnh: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return false;
    }

    if (!formData.content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const url = id ? `${API_BASE_URL}/blogs/${id}` : `${API_BASE_URL}/blogs`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save blog');
      }

      navigate('/admin/blog');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const confirmMessage = 'Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.';
    if (window.confirm(confirmMessage)) {
      navigate('/admin/blog');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Cập nhật thông tin bài viết' : 'Tạo bài viết mới cho blog'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Excerpt */}
            <AdminCard>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề bài viết"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Nhập mô tả ngắn cho bài viết"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>
              </div>
            </AdminCard>

            {/* Content */}
            <AdminCard title="Nội dung">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Nhập nội dung bài viết"
                rows="20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <AdminCard title="Trạng thái">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                {formData.status === 'published' 
                  ? 'Bài viết sẽ được hiển thị công khai'
                  : 'Bài viết sẽ được lưu dưới dạng bản nháp'}
              </p>
            </AdminCard>

            {/* Category */}
            <AdminCard title="Danh mục">
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Nhập danh mục"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </AdminCard>

            {/* Featured Image */}
            <AdminCard title="Hình ảnh">
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FaImage className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        Kéo thả hoặc click để tải lên hình ảnh
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG hoặc GIF (tối đa 5MB)
                      </div>
                      <button className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaUpload className="w-4 h-4" />
                        Chọn file
                      </button>
                    </label>
                  </div>
                )}
              </div>
            </AdminCard>

            {/* Actions */}
            <AdminCard>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <ModalButton
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full justify-center"
                >
                  {loading ? 'Đang lưu...' : id ? 'Cập nhật bài viết' : 'Tạo bài viết'}
                </ModalButton>
                <ModalButton
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full justify-center"
                >
                  Hủy bỏ
                </ModalButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBlog;
