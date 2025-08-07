import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage, FaLink, FaCloudUploadAlt, FaCalendarAlt } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminModal from '../../components/admin/AdminModal';
import { createBanner, updateBanner, getBannerById } from '../../service/Admin.Service.jsx';

const AddBannerPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [banner, setBanner] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    display_order: 0,
    is_active: true,
    type: 'main',
    start_date: '',
    end_date: ''
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Upload modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Load banner data if editing
  useEffect(() => {
    const loadBanner = async () => {
      if (isEditing) {
        try {
          setInitialLoading(true);
          // Sử dụng public API không cần token
          const result = await getBannerById(id);
          if (result.data) {
            const bannerData = result.data;
            setBanner({
              title: bannerData.title || '',
              description: bannerData.description || '',
              image_url: bannerData.image_url || '',
              link_url: bannerData.link_url || '',
              display_order: bannerData.display_order || 0,
              is_active: bannerData.is_active !== undefined ? bannerData.is_active : true,
              type: bannerData.type || 'main',
              start_date: bannerData.start_date ? new Date(bannerData.start_date).toISOString().split('T')[0] : '',
              end_date: bannerData.end_date ? new Date(bannerData.end_date).toISOString().split('T')[0] : ''
            });
          }
        } catch (error) {
          setMessage('Lỗi khi tải thông tin banner: ' + error.message);
          setMessageType('error');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    loadBanner();
  }, [id, isEditing]);

  // Handle form field changes
  const handleBannerChange = useCallback((field, value) => {
    setBanner(prev => ({ ...prev, [field]: value }));
  }, []);

  // Convert image URL to base64 to avoid CORS issues
  const getImageUrl = useCallback((url) => {
    if (!url) return '';
    
    // If it's already a base64 or data URL, return as is
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    
    // If it's a localhost URL, convert to base64 via API
    if (url.includes('localhost:3000') && url.includes('/uploads/')) {
      const filename = url.split('/uploads/')[1];
      if (filename) {
        return `http://localhost:3000/api/upload/base64/${encodeURIComponent(filename)}`;
      }
    }
    
    return url;
  }, []);

  // Function to fetch base64 image
  const fetchBase64Image = useCallback(async (url) => {
    try {
      if (url.includes('/api/upload/base64/')) {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
      return url;
    } catch (error) {
      console.error('Error fetching base64 image:', error);
      return url;
    }
  }, []);

  // Function to convert image to base64
  const convertImageToBase64 = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return url; // Fallback to original URL
    }
  }, []);

  // Image Component with base64 support
  const ImageComponent = useCallback(({ src, alt, className, onError }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const loadImage = async () => {
        if (!src) {
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setHasError(false);

          // If it's a base64 API URL, fetch the base64 data
          if (src.includes('/api/upload/base64/')) {
            const base64Data = await fetchBase64Image(src);
            setImageSrc(base64Data);
          } else {
            setImageSrc(src);
          }
        } catch (error) {
          console.error('Error loading image:', error);
          setHasError(true);
          if (onError) onError(error);
        } finally {
          setIsLoading(false);
        }
      };

      loadImage();
    }, [src, fetchBase64Image, onError]);

    if (isLoading) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Đang tải...</p>
          </div>
        </div>
      );
    }

    if (hasError || !imageSrc) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <FaImage className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">Không thể tải ảnh</p>
          </div>
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          setHasError(true);
          if (onError) onError(e);
        }}
      />
    );
  }, [fetchBase64Image]);

  // Memoize the preview image component to prevent unnecessary re-renders
  const PreviewImage = useCallback(() => {
    if (!banner.image_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaImage className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">Chưa có hình ảnh</p>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <ImageComponent
          src={getImageUrl(banner.image_url)}
          alt="Preview"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image load error:', e);
          }}
        />
      </div>
    );
  }, [banner.image_url, getImageUrl, ImageComponent]);

  // Handle file upload
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  }, []);

  // Handle file selection (from input or drag & drop)
  const handleFileSelect = useCallback((file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Vui lòng chọn file hình ảnh hợp lệ');
      setMessageType('error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
      setMessageType('error');
      return;
    }

    setUploadFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#06AEF4]', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#06AEF4]', 'bg-blue-50');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#06AEF4]', 'bg-blue-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!uploadFile) {
      setMessage('Vui lòng chọn file để upload');
      setMessageType('error');
      return;
    }

    try {
      setUploadLoading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', uploadFile);
      
      console.log('Uploading file:', uploadFile.name, 'Size:', uploadFile.size);
      
      // Upload to server
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use text
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload result:', result);
      
      if (result.success && result.url) {
        setBanner(prev => ({ ...prev, image_url: result.url }));
        setMessage('Upload ảnh thành công!');
        setMessageType('success');
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadPreview(null);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = error.message;
      
      // Handle specific error types
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Lỗi CORS. Vui lòng thử lại.';
      }
      
      setMessage('Lỗi khi upload ảnh: ' + errorMessage);
      setMessageType('error');
    } finally {
      setUploadLoading(false);
    }
  }, [uploadFile]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bannerData = {
        ...banner,
        start_date: banner.start_date ? new Date(banner.start_date) : null,
        end_date: banner.end_date ? new Date(banner.end_date) : null
      };

      console.log('Submitting banner data:', bannerData);
      console.log('Is editing:', isEditing);
      console.log('Banner ID:', id);

      if (isEditing) {
        console.log('Updating banner with ID:', id);
        await updateBanner(id, bannerData);
        setMessage('Banner đã được cập nhật thành công!');
      } else {
        console.log('Creating new banner');
        await createBanner(bannerData);
        setMessage('Banner đã được thêm thành công!');
      }
      setMessageType('success');
      setTimeout(() => {
        setMessage('');
        navigate('/admin/banner');
      }, 2000);
    } catch (error) {
      console.error('Error submitting banner:', error);
      console.error('Error response:', error.response);
      setMessage(`Lỗi khi ${isEditing ? 'cập nhật' : 'thêm'} banner: ` + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#06AEF4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin banner...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
          </h1>
          <Link
            to="/admin/banner"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <AdminCard>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => handleBannerChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      placeholder="Nhập tiêu đề banner"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={banner.description}
                      onChange={(e) => handleBannerChange('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      placeholder="Nhập mô tả banner"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link hình ảnh <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaImage className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          value={banner.image_url}
                          onChange={(e) => handleBannerChange('image_url', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">hoặc</span>
                        <button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition flex items-center gap-1"
                        >
                          <FaCloudUploadAlt className="w-3 h-3" />
                          Upload ảnh
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link chuyển hướng</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLink className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={banner.link_url}
                        onChange={(e) => handleBannerChange('link_url', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </AdminCard>

              {/* Settings */}
              <AdminCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại banner</label>
                    <select
                      value={banner.type}
                      onChange={(e) => handleBannerChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                    >
                      <option value="main">Chính</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="popup">Popup</option>
                      <option value="slider">Slider</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị</label>
                    <input
                      type="number"
                      value={banner.display_order}
                      onChange={(e) => handleBannerChange('display_order', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={banner.start_date}
                        onChange={(e) => handleBannerChange('start_date', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={banner.end_date}
                        onChange={(e) => handleBannerChange('end_date', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={banner.is_active}
                      onChange={(e) => handleBannerChange('is_active', e.target.checked)}
                      className="h-4 w-4 text-[#06AEF4] focus:ring-[#06AEF4] border-gray-300 rounded"
                    />
                    <span className="ml-2 block text-sm text-gray-700">
                      Kích hoạt banner
                    </span>
                  </label>
                </div>
              </AdminCard>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              <AdminCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xem trước</h3>
                <div className="space-y-4">
                  <PreviewImage />
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">{banner.title || 'Tiêu đề banner'}</div>
                    <div className="text-sm text-gray-600">{banner.description || 'Mô tả banner'}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${
                        banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {banner.type === 'main' ? 'Chính' : 
                         banner.type === 'sidebar' ? 'Sidebar' :
                         banner.type === 'popup' ? 'Popup' : 'Slider'}
                      </span>
                    </div>
                  </div>
                </div>
              </AdminCard>

              {/* Status Card */}
              <AdminCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      banner.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {banner.is_active ? <FaImage className="w-3 h-3" /> : <FaImage className="w-3 h-3" />}
                      {banner.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Loại:</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {banner.type === 'main' ? 'Chính' : 
                       banner.type === 'sidebar' ? 'Sidebar' :
                       banner.type === 'popup' ? 'Popup' : 'Slider'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Thứ tự:</span>
                    <span className="font-medium text-gray-900">{banner.display_order}</span>
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/banner')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition flex items-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#06AEF4] text-white rounded-md hover:bg-[#0590d8] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="w-4 h-4" />
                  {isEditing ? 'Cập nhật banner' : 'Lưu banner'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Upload Modal */}
        <AdminModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setUploadFile(null);
            setUploadPreview(null);
          }}
          title="Upload ảnh banner"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn file ảnh <span className="text-red-500">*</span>
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#06AEF4] transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadLoading}
                />
                <label htmlFor="image-upload" className={`cursor-pointer ${uploadLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadLoading ? 'Đang upload...' : 'Click để chọn file hoặc kéo thả file vào đây'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                  </p>
                </label>
              </div>
            </div>

            {uploadPreview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Xem trước</label>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Tên file: {uploadFile?.name}</p>
                  <p>Kích thước: {(uploadFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Loại file: {uploadFile?.type}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadPreview(null);
                }}
                disabled={uploadLoading}
              >
                Hủy
              </button>
              <button
                variant="primary"
                onClick={handleUpload}
                disabled={!uploadFile || uploadLoading}
              >
                {uploadLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang upload...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="w-4 h-4 mr-2" />
                    Upload ảnh
                  </>
                )}
              </button>
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AddBannerPage;
