import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash, FaImage, FaPlus } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AddProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '0', // Default to '0' for in_stock field
    category_id: '',
    status: 'active',
    images: [],
    created_at: new Date().toISOString().split('T')[0] // Auto-fill today's date
  });

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch product data if editing
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const result = await response.json();
          const product = result.data;
          
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price ? product.price.toString() : '',
            original_price: product.original_price ? product.original_price.toString() : '',
            stock: product.in_stock ? product.in_stock.toString() : '0', // Map from in_stock
            category_id: product.category_id?._id || product.category_id || '',
            status: product.status || 'active',
            images: product.images || [],
            created_at: product.created_at || product.create_at || new Date().toISOString().split('T')[0] // Handle both field names
          });

          if (product.images && product.images.length > 0) {
            setImagePreviews(product.images);
          }
        } catch (error) {
          setError('Không thể tải thông tin sản phẩm: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const result = await response.json();
        setCategories(result.data || []);
      } catch (error) {
        setError('Không thể tải danh mục: ' + error.message);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload with compression
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 2MB each to prevent server errors)
    const maxSize = 2 * 1024 * 1024; // Reduced to 2MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setError('Kích thước file không được vượt quá 2MB');
      return;
    }

    // Limit to 3 images total to reduce payload size
    const totalImages = imagePreviews.length + files.length;
    if (totalImages > 3) {
      setError('Tối đa 3 hình ảnh cho mỗi sản phẩm');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Create compressed previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Compress image by resizing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const maxWidth = 800;
          const maxHeight = 600;
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
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          
          setImagePreviews(prev => [...prev, compressedDataUrl]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`, {
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
      setCategories(prev => [...prev, result.data]);
      setFormData(prev => ({ ...prev, category_id: result.data._id }));
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);
      setError(null);
    } catch (error) {
      setError('Lỗi khi tạo danh mục: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tên sản phẩm không được để trống');
      return false;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError('Giá bán phải lớn hơn 0');
      return false;
    }

    if (!formData.original_price || Number(formData.original_price) <= 0) {
      setError('Giá gốc phải lớn hơn 0');
      return false;
    }

    if (Number(formData.price) > Number(formData.original_price)) {
      setError('Giá bán không được lớn hơn giá gốc');
      return false;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      setError('Số lượng tồn kho không được âm');
      return false;
    }

    if (!formData.category_id) {
      setError('Vui lòng chọn danh mục');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare product data with base64 images (fallback approach)
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        original_price: Number(formData.original_price),
        in_stock: Number(formData.stock),
        category_id: formData.category_id,
        status: formData.status,
        images: imagePreviews // Use compressed base64 images directly
      };
      
      // Only include create_at for new products, not for updates
      if (!id) {
        productData.create_at = formData.created_at;
      }

      const url = id ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`;
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      navigate('/admin/product');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const hasChanges = formData.name || formData.description || formData.price || imagePreviews.length > 0;
    
    if (hasChanges) {
      const confirmMessage = 'Bạn có chắc chắn muốn hủy? Mọi thay đổi sẽ không được lưu.';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    navigate('/admin/product');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-gray-600 mt-1">
            {id ? 'Cập nhật thông tin sản phẩm' : 'Tạo sản phẩm mới cho cửa hàng'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <AdminCard title="Thông tin cơ bản">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập tên sản phẩm"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Nhập mô tả chi tiết về sản phẩm"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo
                    </label>
                    <input
                      type="date"
                      name="created_at"
                      value={formData.created_at}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ngày tạo sản phẩm (tự động điền ngày hôm nay)</p>
                  </div>
                </div>
              </AdminCard>

              {/* Images */}
              <AdminCard title="Hình ảnh sản phẩm">
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FaUpload className="w-8 h-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        Kéo thả hoặc click để tải lên hình ảnh
                      </div>
                      <div className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP (tối đa 5MB mỗi file, tối đa 5 ảnh)
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <FaImage className="w-4 h-4" />
                        Chọn file
                      </div>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AdminCard>

              {/* Pricing */}
              <AdminCard title="Giá cả và kho hàng">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá gốc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Giá gốc của sản phẩm (VND)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá bán <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Giá bán cho khách hàng (VND)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Số lượng sản phẩm có sẵn</p>
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
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.status === 'active' 
                    ? 'Sản phẩm sẽ hiển thị trên cửa hàng'
                    : 'Sản phẩm sẽ bị ẩn khỏi cửa hàng'}
                </p>
              </AdminCard>

              {/* Category */}
              <AdminCard title="Danh mục">
                <div className="space-y-3">
                  {categoriesLoading ? (
                    <div className="text-gray-500">Đang tải danh mục...</div>
                  ) : (
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                    Tạo danh mục mới
                  </button>
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
                    type="submit"
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading ? 'Đang lưu...' : id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                  </ModalButton>
                  <ModalButton
                    type="button"
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
        </form>

        {/* Add Category Modal */}
        <AdminModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setNewCategory({ name: '', description: '' });
            setError(null);
          }}
          title="Thêm danh mục mới"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategory({ name: '', description: '' });
                  setError(null);
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton 
                onClick={handleAddCategory}
                disabled={loading}
              >
                {loading ? 'Đang tạo...' : 'Tạo danh mục'}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả danh mục
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả danh mục (tùy chọn)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AddProductPage;
