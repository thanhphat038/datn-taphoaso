import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaBox, FaTag, FaCalendarAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';
import { getProductById, deleteProduct, toggleProductStatus } from '../../service/Admin.Service.jsx';

const API_BASE_URL = 'http://localhost:3000/api';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        setError('Không thể tải thông tin sản phẩm: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle delete product
  const handleDeleteProduct = async () => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(id);
      setMessage('Xóa sản phẩm thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
      navigate('/admin/product');
    } catch (error) {
      setMessage('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle product status
  const handleToggleStatus = async () => {
    if (!product) return;

    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const actionText = product.status === 'active' ? 'ẩn' : 'hiện';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} sản phẩm này?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await toggleProductStatus(id, newStatus);
      setProduct(prev => ({ ...prev, status: newStatus }));
      setMessage(`Đã ${actionText} sản phẩm thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} sản phẩm: ` + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Get product status info
  const getProductStatusInfo = (status) => {
    if (status === 'active') {
      return {
        label: 'Đang bán',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Ngừng bán',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500'
      };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">Không tìm thấy sản phẩm</div>
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = getProductStatusInfo(product.status);

  return (
    <AdminLayout>
      {message && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <span>{message}</span>
          <button className="ml-2 text-lg" onClick={() => setMessage('')}>×</button>
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/product')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h1>
              <p className="text-gray-600 mt-1">Xem thông tin chi tiết sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModalButton
              variant={product.status === 'active' ? 'warning' : 'success'}
              onClick={handleToggleStatus}
              disabled={loading}
            >
              {product.status === 'active' ? (
                <>
                  <FaEyeSlash className="w-4 h-4" />
                  <span>Ẩn sản phẩm</span>
                </>
              ) : (
                <>
                  <FaEye className="w-4 h-4" />
                  <span>Hiện sản phẩm</span>
                </>
              )}
            </ModalButton>
            <ModalButton
              onClick={() => navigate(`/admin/addproduct/${id}`)}
              disabled={loading}
            >
              <FaEdit className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </ModalButton>
            <ModalButton
              variant="danger"
              onClick={handleDeleteProduct}
              disabled={loading}
            >
              <FaTrash className="w-4 h-4" />
              <span>Xóa sản phẩm</span>
            </ModalButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <AdminCard title="Hình ảnh sản phẩm" noPadding>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square">
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </AdminCard>
            )}

            {/* Product Information */}
            <AdminCard title="Thông tin sản phẩm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border ${statusInfo.color}`}>
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}
              </div>
            </AdminCard>

            {/* Pricing Information */}
            <AdminCard title="Thông tin giá cả">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(product.original_price)}</div>
                  <div className="text-sm text-gray-600">Giá gốc</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</div>
                  <div className="text-sm text-gray-600">Giá bán</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {product.original_price && product.price 
                      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Giảm giá</div>
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stock Information */}
            <AdminCard title="Kho hàng">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold ${
                  (product.stock || 0) > 10 ? 'text-green-600' : 
                  (product.stock || 0) > 0 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {product.stock || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {(product.stock || 0) > 10 ? 'Còn hàng' : 
                   (product.stock || 0) > 0 ? 'Sắp hết hàng' : 'Hết hàng'}
                </div>
              </div>
            </AdminCard>

            {/* Category Information */}
            <AdminCard title="Danh mục">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-[#06AEF4] bg-opacity-10 rounded-lg">
                  <FaTag className="w-5 h-5 text-[#06AEF4]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {product.category_id?.name || 'Chưa phân loại'}
                  </div>
                  {product.category_id?.description && (
                    <div className="text-sm text-gray-500">{product.category_id.description}</div>
                  )}
                </div>
              </div>
            </AdminCard>

            {/* Meta Information */}
            <AdminCard title="Thông tin khác">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Ngày tạo</div>
                    <div className="font-medium">
                      {(() => {
                        const date = product.create_at || product.created_at || product.createdAt;
                        if (!date) return 'Không rõ';
                        // Nếu là ISO string, chỉ lấy phần yyyy-MM-dd
                        let displayDate = '';
                        if (typeof date === 'string' && date.includes('T')) {
                          displayDate = new Date(date).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } else {
                          displayDate = date;
                        }
                        return displayDate;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Cập nhật lần cuối</div>
                    <div className="font-medium">
                      {new Date(product.updatedAt || product.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaBox className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">ID sản phẩm</div>
                    <div className="font-medium font-mono text-sm">{product._id}</div>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailProduct; 
