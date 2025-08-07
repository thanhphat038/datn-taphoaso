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
import ImageExtension from '@tiptap/extension-image';
import Toolbar from '../../components/admin/ToolbarTiptap';

import { getApiUrl, getBaseUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

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
      ImageExtension.configure({
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
    images: [],
    blog_category_id: '',
    status: 'draft'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categoryLoading, setCategoryLoading] = useState(false);

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
            images: blog.images || [], // Ensure images array is populated
            blog_category_id: blog.blog_category_id || '',
            status: blog.status || 'draft'
          });

          if (blog.image) {
            // Xử lý hình ảnh base64 hoặc URL
            if (blog.image.startsWith('data:image')) {
              // Đây là base64 image
              setImagePreview(blog.image);
                          } else {
                // Đây là URL image (từ dữ liệu cũ)
                const imagePath = blog.image.startsWith('http') ? blog.image : `${getBaseUrl()}${blog.image}`;
              setImagePreview(imagePath);
            }
          }

          // Handle multiple images if they exist
          if (blog.images && blog.images.length > 0) {
            const imageDataArray = blog.images.map((img, index) => ({
              base64: img,
              name: `Image ${index + 1}`,
              size: img.length
            }));
            setImagePreviews(imageDataArray);
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
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log('handleImageChange called with files:', files.map(f => f.name));

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    // Limit number of images (max 10)
    if (files.length > 10) {
      setError('Tối đa 10 hình ảnh');
      return;
    }

    try {
      setImageUploading(true);
      setError(null);

      console.log('Starting base64 conversion for multiple images...');
      
      // Convert all images to base64
      const imagePromises = files.map(async (file) => {
        const base64Image = await convertImageToBase64(file);
        return {
          base64: base64Image,
          name: file.name,
          size: file.size
        };
      });

      const convertedImages = await Promise.all(imagePromises);
      
      console.log('Base64 conversion successful for all images');
      
      // Update image previews
      setImagePreviews(prev => [...prev, ...convertedImages]);

      // Save base64 images to form data (for backward compatibility, keep the first image as main image)
      setFormData(prev => ({
        ...prev,
        image: convertedImages[0]?.base64 || '',
        images: [...(prev.images || []), ...convertedImages.map(img => img.base64)]
      }));
      
      console.log('Image previews and form data updated successfully');
      
      // Hiển thị thông báo thành công
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Image conversion error:', error);
      setError('Lỗi khi xử lý hình ảnh: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Function to convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      console.log('Starting image conversion for file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const reader = new FileReader();
      reader.onload = () => {
        console.log('FileReader completed, data length:', reader.result.length);
        console.log('Data URL starts with:', reader.result.substring(0, 50));
        
        // Compress image before converting to base64
        const img = new window.Image();
        img.onload = () => {
          console.log('Image loaded successfully, dimensions:', img.width, 'x', img.height);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions for compression
          const maxWidth = 1200;
          const maxHeight = 800;
          let { width, height } = img;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          console.log('Canvas dimensions after compression:', width, 'x', height);
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
          console.log('Base64 conversion completed, length:', compressedBase64.length);
          console.log('Base64 starts with:', compressedBase64.substring(0, 50));
          
          resolve(compressedBase64);
        };
        img.onerror = (error) => {
          console.error('Image loading error:', error);
          reject(new Error('Không thể tải hình ảnh'));
        };
        img.src = reader.result;
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Không thể đọc file'));
      };
      reader.readAsDataURL(file);
    });
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

  // Function để tạo danh mục mới
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    // Kiểm tra danh mục đã tồn tại
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === newCategory.name.trim().toLowerCase()
    );
    if (existingCategory) {
      setError('Danh mục này đã tồn tại');
      return;
    }

    try {
      setCategoryLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/blogs_categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
          status: 'active'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const result = await response.json();
      console.log('Category created:', result);

      // Thêm danh mục mới vào danh sách
      setCategories(prev => [...prev, result.data]);
      
      // Chọn danh mục mới vừa tạo
      setFormData(prev => ({
        ...prev,
        blog_category_id: result.data._id
      }));

      // Reset form và đóng modal
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);

      // Hiển thị thông báo thành công
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Create category error:', error);
      setError('Lỗi khi tạo danh mục: ' + error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
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
        ...formData,
        // Đảm bảo image là base64 string
        image: formData.image || '',
        images: formData.images // Ensure images array is sent
      };

      console.log('Submitting blog with base64 image:', {
        ...blogData,
        imageLength: blogData.image ? blogData.image.length : 0
      });

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
                  <div className="flex gap-2 mb-3">
                    <select
                      name="blog_category_id"
                      value={formData.blog_category_id}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      title="Tạo danh mục mới"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Chọn danh mục phù hợp cho bài viết hoặc tạo danh mục mới
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
                
                {/* Multiple Images Preview */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreviews.map((imageData, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageData.base64}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                            onLoad={(e) => {
                              console.log(`Image ${index + 1} loaded successfully:`, e.target.src.substring(0, 50));
                            }}
                            onError={(e) => {
                              console.error(`Image ${index + 1} preview error:`, e.target.src.substring(0, 50));
                              setError('Không thể tải hình ảnh. Vui lòng thử lại.');
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => {
                                setImagePreviews(prev => prev.filter((_, i) => i !== index));
                                setFormData(prev => ({
                                  ...prev,
                                  images: prev.images.filter((_, i) => i !== index),
                                  image: index === 0 ? (prev.images[1] || '') : prev.image
                                }));
                              }}
                              className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                              title="Xóa hình ảnh"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Đã tải lên {imagePreviews.length} hình ảnh</p>
                      <p>Tổng kích thước: {Math.round(imagePreviews.reduce((total, img) => total + img.base64.length, 0) / 1024)}KB</p>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
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
                      const event = { target: { files } };
                      handleImageChange(event);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
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
                      PNG, JPG, GIF hoặc WebP (tối đa 5MB mỗi file, tối đa 10 ảnh)
                    </div>
                    <button 
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={imageUploading}
                    >
                      <FaUpload className="w-4 h-4" />
                      {imageUploading ? 'Đang xử lý...' : 'Chọn file'}
                    </button>
                  </label>
                </div>
                
                {uploadSuccess && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800 font-medium">
                      ✅ Hình ảnh đã được xử lý thành công!
                    </p>
                  </div>
                )}
                
                {formData.image && !uploadSuccess && (
                  <div className="text-xs text-gray-500">
                    <p>Hình ảnh đã được chuyển đổi sang base64</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Kích thước: {Math.round(formData.image.length / 1024)}KB
                    </p>
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
                    <div className={`w-2 h-2 rounded-full ${imagePreviews.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>Hình ảnh: {imagePreviews.length > 0 ? `Đã tải lên ${imagePreviews.length} ảnh` : 'Chưa tải lên'}</span>
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

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 backdrop-sepia-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tạo danh mục mới</h3>
              </div>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategory({ name: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  placeholder="Nhập tên danh mục"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Nhập mô tả cho danh mục (tùy chọn)"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={categoryLoading}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {categoryLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang tạo...
                    </div>
                  ) : (
                    'Tạo danh mục'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategory({ name: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AddBlog;