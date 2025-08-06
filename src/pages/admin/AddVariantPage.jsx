import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash, FaImage, FaPlus, FaCubes, FaBarcode, FaDollarSign, FaWarehouse, FaTags } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllProducts, getProductById } from '../../service/Admin.Service.js';
import { createVariant, updateVariant, getVariantById } from '../../service/Variant.service.js';
import Cookies from "js-cookie";

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

// Utility function to convert ISO or any date string to yyyy-MM-dd
const toDateInputValue = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

const AddVariantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    product_id: '',
    unit: 'chai',
    quantity_per_unit: '1',
    price: '',
    original_price: '',
    in_stock: '0',
    status: 'active',
    is_default: false,
    images: []
  });

  // Products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);



  // Fetch variant data if editing
  useEffect(() => {
    if (id) {
      const fetchVariant = async () => {
        try {
          setLoading(true);
          const response = await getVariantById(id);
          const variant = response.data;
          
          setFormData({
            name: variant.name || '',
            description: variant.description || '',
            product_id: variant.product_id?._id || variant.product_id || '',
            unit: variant.unit || 'chai',
            quantity_per_unit: variant.quantity_per_unit ? variant.quantity_per_unit.toString() : '1',
            price: variant.price ? variant.price.toString() : '',
            original_price: variant.original_price ? variant.original_price.toString() : '',
            in_stock: variant.in_stock ? variant.in_stock.toString() : '0',
            status: variant.status || 'active',
            is_default: variant.is_default || false,
            images: variant.images || []
          });

          if (variant.images && variant.images.length > 0) {
            setImagePreviews(variant.images);
          }

          // No attributes in new schema
        } catch (error) {
          setError('Không thể tải thông tin biến thể: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchVariant();
    }
  }, [id]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await getAllProducts();
        setProducts(response.data.data || []);
      } catch (error) {
        setError('Không thể tải danh sách sản phẩm: ' + error.message);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle product selection
  const handleProductChange = async (e) => {
    const productId = e.target.value;
    setFormData(prev => ({ ...prev, product_id: productId }));

    if (productId && !formData.sku) {
      try {
        const response = await generateSKU(productId);
        setFormData(prev => ({ ...prev, sku: response.data.sku }));
      } catch (error) {
        console.error('Error generating SKU:', error);
      }
    }

    // Set selected product for display
    if (productId) {
      const product = products.find(p => p._id === productId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        setError('Chỉ chấp nhận file JPG, PNG hoặc WebP');
        return false;
      }
      
      if (!isValidSize) {
        setError('Kích thước file không được vượt quá 5MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert to base64
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setImagePreviews(prev => [...prev, base64]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
      };
      reader.readAsDataURL(file);
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    setError(null);
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };



  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tên biến thể là bắt buộc');
      return false;
    }

    if (!formData.product_id) {
      setError('Vui lòng chọn sản phẩm');
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Giá phải lớn hơn 0');
      return false;
    }

    if (formData.original_price && parseFloat(formData.original_price) <= 0) {
      setError('Giá gốc phải lớn hơn 0');
      return false;
    }

    if (formData.original_price && parseFloat(formData.original_price) <= parseFloat(formData.price)) {
      setError('Giá gốc phải lớn hơn giá hiện tại');
      return false;
    }

    if (parseInt(formData.in_stock) < 0) {
      setError('Số lượng tồn kho không được âm');
      return false;
    }

    if (!formData.unit) {
      setError('Vui lòng chọn đơn vị');
      return false;
    }

    if (parseInt(formData.quantity_per_unit) < 1) {
      setError('Số lượng mỗi đơn vị phải lớn hơn 0');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        in_stock: parseInt(formData.in_stock),
        quantity_per_unit: parseInt(formData.quantity_per_unit)
      };

      let response;
      if (id) {
        response = await updateVariant(id, submitData);
        setMessage('Cập nhật biến thể thành công!');
      } else {
        response = await createVariant(submitData);
        setMessage('Tạo biến thể thành công!');
      }

      setMessageType('success');
      setTimeout(() => {
        navigate('/admin/variant');
      }, 2000);

    } catch (error) {
      setError('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/variant');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Chỉnh sửa Biến thể' : 'Thêm Biến thể Mới'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Cập nhật thông tin biến thể' : 'Tạo biến thể mới cho sản phẩm'}
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <AdminCard>
            <div className="flex items-center mb-4">
              <FaCubes className="w-5 h-5 text-[#06AEF4] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên biến thể *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="Nhập tên biến thể"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sản phẩm *
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleProductChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="Nhập mô tả biến thể"
                />
              </div>
            </div>
          </AdminCard>

          {/* Pricing and Stock */}
          <AdminCard>
            <div className="flex items-center mb-4">
              <FaDollarSign className="w-5 h-5 text-[#06AEF4] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Giá và Tồn kho</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá hiện tại *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá gốc
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tồn kho
                </label>
                <input
                  type="number"
                  name="in_stock"
                  value={formData.in_stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </AdminCard>

          {/* Unit Information */}
          <AdminCard>
            <div className="flex items-center mb-4">
              <FaCubes className="w-5 h-5 text-[#06AEF4] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Thông tin Đơn vị</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn vị *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  required
                >
                  <option value="thùng">Thùng</option>
                  <option value="lốc">Lốc</option>
                  <option value="gói">Gói</option>
                  <option value="chai">Chai</option>
                  <option value="lon">Lon</option>
                  <option value="túi">Túi</option>
                  <option value="hộp">Hộp</option>
                  <option value="kg">Kg</option>
                  <option value="gram">Gram</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng mỗi đơn vị *
                </label>
                <input
                  type="number"
                  name="quantity_per_unit"
                  value={formData.quantity_per_unit}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                  placeholder="1"
                  required
                />
              </div>
                        </div>
          </AdminCard>

          {/* Settings */}
          <AdminCard>
            <div className="flex items-center mb-4">
              <FaTags className="w-5 h-5 text-[#06AEF4] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Cài đặt</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Vô hiệu hóa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biến thể mặc định
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-[#06AEF4] focus:ring-[#06AEF4]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Đặt làm biến thể mặc định cho sản phẩm</span>
                </div>
              </div>
            </div>
          </AdminCard>



          {/* Images */}
          <AdminCard>
            <div className="flex items-center mb-4">
              <FaImage className="w-5 h-5 text-[#06AEF4] mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Hình ảnh</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click để tải hình ảnh hoặc kéo thả vào đây</p>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP (tối đa 5MB)</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </AdminCard>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#06AEF4] text-white rounded-md hover:bg-[#0590d8] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : (id ? 'Cập nhật' : 'Tạo biến thể')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddVariantPage; 