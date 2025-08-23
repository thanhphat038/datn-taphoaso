import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage, FaUpload, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Toolbar from '../../components/admin/ToolbarTiptap';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';

const AddBlog = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData(prev => ({
        ...prev,
        content: html
      }));
      
      // Extract base64 images from content (for logging/debugging)
      const base64ImagesFromContent = extractBase64Images(html);
      console.log('Base64 images in content:', base64ImagesFromContent.length);
    }
  });


  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    blog_category_id: '',
    status: 'draft'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [blogCategories, setBlogCategories] = useState([]);

  // Fetch blog categories
  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          console.error('No authentication token found');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/blogs_categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const result = await response.json();
          setBlogCategories(result.data || []);
        } else if (response.status === 401) {
          console.error('Unauthorized: Token may be invalid or expired');
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error fetching blog categories:', error);
      }
    };

    fetchBlogCategories();
  }, [navigate]);

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const token = Cookies.get('auth_token');
          if (!token) {
            console.error('No authentication token found');
            navigate('/login');
            return;
          }

          const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            if (response.status === 401) {
              console.error('Unauthorized: Token may be invalid or expired');
              navigate('/login');
              return;
            }
            throw new Error('Failed to fetch blog');
          }
          const result = await response.json();
          const blog = result.data;

          setFormData({
            title: blog.title || '',
            description: blog.description || '',
            content: blog.content || '',
            image: blog.image || '',
            blog_category_id: blog.blog_category_id || '',
            status: blog.status || 'draft'
          });

          if (blog.image) {
            // If the image is already base64, use it directly
            if (blog.image.startsWith('data:')) {
              setImagePreview(blog.image);
            } else {
              // Convert URL to base64 if needed
              try {
                const response = await fetch(blog.image);
                const blob = await response.blob();
                const base64Image = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
                setImagePreview(base64Image);
                setFormData(prev => ({
                  ...prev,
                  image: base64Image
                }));
              } catch (error) {
                console.error('Error converting image to base64:', error);
                setImagePreview(blog.image);
              }
            }
          }
          if (editor && blog.content) {
            editor.commands.setContent(blog.content);
          }
        } catch (error) {
setError('Không thể tải thông tin bài viết: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, editor]);

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
      setLoading(true);
      
      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Set preview and form data with base64
      setImagePreview(base64Image);
      setFormData(prev => ({
        ...prev,
        image: base64Image
      }));
      
    } catch (error) {
      setError('Lỗi khi xử lý hình ảnh: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function để extract base64 images từ content (for debugging)
  const extractBase64Images = (htmlContent) => {
    const base64Images = [];
    const imgRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"/g;
    let match;
    
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      base64Images.push(match[1]);
    }
    
    return base64Images;
  };

  // Function để replace base64 images với URLs trong content (không cần thiết nữa)
  // const replaceBase64WithUrls = (content, base64Images, uploadedUrls) => {
  //   let updatedContent = content;
  //   
  //   for (let i = 0; i < base64Images.length; i++) {
  //     updatedContent = updatedContent.replace(base64Images[i], uploadedUrls[i]);
  //   }
  //   
  //   return updatedContent;
  // };

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

      // Prepare blog data with base64 images
      const blogData = {
        ...formData
      };

      // Ensure the image is in base64 format
      if (blogData.image && !blogData.image.startsWith('data:')) {
        try {
          const response = await fetch(blogData.image);
          const blob = await response.blob();
          const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          blogData.image = base64Image;
        } catch (error) {
          console.error('Error converting image to base64:', error);
        }
      }

      console.log('Submitting blog data with base64 images');
      const url = id ? `${API_BASE_URL}/blogs/${id}` : `${API_BASE_URL}/blogs`;
      const method = id ? 'PUT' : 'POST';

      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No authentication token found');
        navigate('/login');
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData),
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
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả cho bài viết"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  />
                </div>
              </div>
            </AdminCard>

            {/* Content */}
            <AdminCard title="Nội dung">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <Toolbar editor={editor} />
<div className="min-h-[400px] max-h-[600px] overflow-y-auto">
                  <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none border-none focus:outline-none"
                  />
                </div>
              </div>
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
                <option value="publish">Xuất bản</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                {formData.status === 'publish'
                  ? 'Bài viết sẽ được hiển thị công khai'
                  : 'Bài viết sẽ được lưu dưới dạng bản nháp'}
              </p>
            </AdminCard>

            {/* Category */}
            <AdminCard title="Danh mục">
              <select
                name="blog_category_id"
                value={formData.blog_category_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              >
                <option value="">Chọn danh mục blog</option>
                {blogCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Chọn danh mục phù hợp cho bài viết của bạn
              </p>
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
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) {
                        const event = { target: { files: [file] } };
                        handleImageChange(event);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
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