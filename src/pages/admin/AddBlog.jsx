import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaImage, FaUpload, FaTrash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Toolbar from '../../components/admin/ToolbarTiptap';

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
  const [categories, setCategories] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs_categories?status=active`);
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
            description: blog.description || '',
            content: blog.content || '',
            image: blog.image || '',
            blog_category_id: blog.blog_category_id || '',
            status: blog.status || 'draft'
          });

          if (blog.image) {
            setImagePreview(blog.image);
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
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WebP)');
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

      setImageUploading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errorMessage = 'Lỗi khi upload hình ảnh';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Nếu không parse được JSON, sử dụng status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Kiểm tra response có đúng format không
      if (!result.url) {
        throw new Error('Response không hợp lệ từ server');
      }

      // Đảm bảo URL là đầy đủ
      const imageUrl = result.url.startsWith('http') ? result.url : `http://localhost:3000${result.url}`;
      
      console.log('Upload result:', result);
      console.log('Image URL:', imageUrl);
      
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      // Hiển thị thông báo thành công
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Lỗi khi tải lên hình ảnh: ' + error.message);
      setImagePreview(null);
    } finally {
      setImageUploading(false);
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

    if (!formData.blog_category_id) {
      setError('Vui lòng chọn danh mục cho bài viết');
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

      // Lưu trực tiếp vào database với base64 images
      const blogData = {
        ...formData
      };

      console.log(blogData);
const url = id ? `${API_BASE_URL}/blogs/${id}` : `${API_BASE_URL}/blogs`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
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
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    navigate('/admin/blog');
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
              {categoriesLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#06AEF4] mr-2"></div>
                  <span className="text-sm text-gray-600">Đang tải danh mục...</span>
                </div>
              ) : (
                <>
                  <select
                    name="blog_category_id"
                    value={formData.blog_category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Chọn danh mục phù hợp cho bài viết
                  </p>
                  {formData.blog_category_id && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Danh mục đã chọn:</strong> {
                          categories.find(cat => cat._id === formData.blog_category_id)?.name || 'Không xác định'
                        }
                      </p>
                    </div>
                  )}
                </>
              )}
            </AdminCard>

            {/* Featured Image */}
            <AdminCard title="Hình ảnh nổi bật">
              <div className="space-y-4">
                {imageUploading && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#06AEF4] mr-3"></div>
                    <span className="text-sm text-blue-600">Đang tải lên hình ảnh...</span>
                  </div>
                )}
                
                                 {imagePreview ? (
                   <div className="relative group">
                     <img
                       src={imagePreview}
                       alt="Preview"
                       className="w-full h-48 object-cover rounded-lg"
                       onError={(e) => {
                         console.error('Image load error:', e.target.src);
                         setError('Không thể tải hình ảnh. Vui lòng thử lại.');
                       }}
                       onLoad={() => {
                         console.log('Image loaded successfully:', imagePreview);
                       }}
                     />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                        title="Xóa hình ảnh"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#06AEF4] transition-colors duration-200"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('border-[#06AEF4]', 'bg-blue-50');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-[#06AEF4]', 'bg-blue-50');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-[#06AEF4]', 'bg-blue-50');
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        const file = files[0];
                        const event = { target: { files: [file] } };
                        handleImageChange(event);
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      disabled={imageUploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`cursor-pointer flex flex-col items-center gap-2 ${imageUploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <FaImage className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        Kéo thả hoặc click để tải lên hình ảnh
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG hoặc GIF (tối đa 5MB)
                      </div>
                      <button 
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={imageUploading}
                      >
                        <FaUpload className="w-4 h-4" />
                        {imageUploading ? 'Đang tải...' : 'Chọn file'}
                      </button>
                    </label>
                  </div>
                )}
                
                                 {uploadSuccess && (
                   <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                     <p className="text-xs text-green-800 font-medium">
                       ✅ Hình ảnh đã được tải lên thành công!
                     </p>
                   </div>
                 )}
                 
                 {formData.image && !uploadSuccess && (
                   <div className="text-xs text-gray-500">
                     <p>Hình ảnh đã được tải lên thành công</p>
                     <p className="text-xs text-blue-600 mt-1 break-all">
                       URL: {formData.image}
                     </p>
                     <button 
                       onClick={() => window.open(formData.image, '_blank')}
                       className="text-xs text-blue-600 underline mt-1"
                     >
                       Mở hình ảnh trong tab mới
                     </button>
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
              
              {/* Status Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.blog_category_id ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Danh mục: {formData.blog_category_id ? 'Đã chọn' : 'Chưa chọn'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.image ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>Hình ảnh: {formData.image ? 'Đã tải lên' : 'Chưa tải lên'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.content.trim() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Nội dung: {formData.content.trim() ? 'Đã nhập' : 'Chưa nhập'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <ModalButton
                  onClick={handleSubmit}
                  disabled={loading || imageUploading}
                  className="w-full justify-center"
                >
                  {loading ? 'Đang lưu...' : id ? 'Cập nhật bài viết' : 'Tạo bài viết'}
                </ModalButton>
                <ModalButton
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading || imageUploading}
                  className="w-full justify-center"
                >
                  Hủy bỏ
                </ModalButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy"
        message="Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu."
        confirmText="Hủy bỏ"
        cancelText="Tiếp tục chỉnh sửa"
        type="warning"
      />
    </AdminLayout>
  );
};

export default AddBlog;