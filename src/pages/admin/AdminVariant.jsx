import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaCubes,
  FaTags,
  FaBarcode,
  FaDollarSign,
  FaWarehouse,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminCard from "../../components/admin/AdminCard";
import AdminTable from "../../components/admin/AdminTable";
import AdminSearchFilter from "../../components/admin/AdminSearchFilter";
import AdminPagination from "../../components/admin/AdminPagination";
import AdminActionDropdown from "../../components/admin/AdminActionDropdown";
import AdminModal from "../../components/admin/AdminModal";
import { getAllVariants, deleteVariant, toggleVariantStatus, getVariantStats } from '../../service/Variant.service.jsx';
import { getAllProducts } from '../../service/Admin.Service.jsx';

const API_BASE_URL = "http://localhost:3000/api";

const AdminVariant = () => {
  const [variants, setVariants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [stats, setStats] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);

  const navigate = useNavigate();

  // Fetch variants
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: pageSize,
          name: searchQuery || undefined,
          status: statusFilter !== "All" ? statusFilter : undefined,
          product_id: productFilter !== "All" ? productFilter : undefined,
        };

        const response = await getAllVariants(params);
        setVariants(response.data || []);
      } catch (error) {
        setError("Không thể tải danh sách biến thể: " + error.message);
        console.error("Error fetching variants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVariants();
  }, [currentPage, pageSize, searchQuery, statusFilter, productFilter]);

  // Fetch products for mapping
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.data || []);
      } catch (error) {
        // Không cần setError ở đây, chỉ cần để products là [] nếu lỗi
      }
    };
    fetchProducts();
  }, []);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getVariantStats();
        setStats(response.data || {});
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Handle edit variant
  const handleEditVariant = (variantId) => {
    navigate(`/admin/addvariant/${variantId}`);
  };

  // Handle delete variant
  const handleDeleteVariant = async (variantId, variantName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa biến thể "${variantName}"?\n\nHành động này không thể hoàn tác!`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteVariant(variantId);

      setVariants(variants.filter(v => v._id !== variantId));
      setMessage("Xóa biến thể thành công!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Không thể xóa biến thể: " + error.message);
      console.error("Error deleting variant:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (variantId, currentStatus, variantName) => {
    const actionText = currentStatus === 'active' ? 'vô hiệu hóa' : 'kích hoạt';
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} biến thể "${variantName}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await toggleVariantStatus(variantId);

      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setVariants(variants.map(v => 
        v._id === variantId ? { ...v, status: newStatus } : v
      ));

      setMessage(`Đã ${actionText} biến thể thành công!`);
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError("Không thể thay đổi trạng thái biến thể: " + error.message);
      console.error("Error toggling variant status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view variant details
  const handleViewVariant = (variant) => {
    setCurrentVariant(variant);
    setShowViewModal(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get variant status info
  const getVariantStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Hoạt động',
          color: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'inactive':
        return {
          label: 'Vô hiệu hóa',
          color: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-500'
        };
      default:
        return {
          label: 'Không xác định',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-500'
        };
    }
  };

  // Get stock status info
  const getStockStatusInfo = (stock) => {
    if (stock === 0) {
      return {
        label: 'Hết hàng',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500'
      };
    } else if (stock < 10) {
      return {
        label: 'Sắp hết',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-500'
      };
    } else {
      return {
        label: 'Còn hàng',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    }
  };

  // Truncate text
  const truncateDescription = (desc, wordLimit = 5) => {
    if (!desc) return 'Không có mô tả';
    const words = desc.split(' ');
    if (words.length <= wordLimit) return desc;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      setError("Vui lòng chọn ít nhất một biến thể!");
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn ${action} ${selectedIds.length} biến thể đã chọn?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading(true);
      // Implement bulk actions here
      setMessage(`Đã ${action} ${selectedIds.length} biến thể thành công!`);
      setMessageType("success");
      setSelectedIds([]);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(`Không thể ${action} biến thể: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'search':
        setSearchQuery(value);
        setCurrentPage(1);
        break;
      case 'status':
        setStatusFilter(value);
        setCurrentPage(1);
        break;
      case 'product':
        setProductFilter(value);
        setCurrentPage(1);
        break;
      case 'price':
        setPriceFilter(value);
        setCurrentPage(1);
        break;
      case 'stock':
        setStockFilter(value);
        setCurrentPage(1);
        break;
      default:
        break;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Tên biến thể',
      key: 'name',
      render: (variant) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {variant.images && variant.images.length > 0 ? (
              <img
                src={variant.images[0]}
                alt={variant.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <FaImage className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{variant.name}</div>
            <div className="text-sm text-gray-500">
              {variant.product_id?.name || 'Sản phẩm không xác định'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Đơn vị',
      key: 'unit',
      render: (variant) => (
        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {variant.quantity_per_unit} {variant.unit}
        </div>
      )
    },
    {
      title: 'Giá',
      key: 'price',
      render: (variant) => (
        <div>
          <div className="font-semibold text-gray-900">
            {formatCurrency(variant.price)}
          </div>
          {variant.original_price && variant.original_price > variant.price && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(variant.original_price)}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Tồn kho',
      key: 'in_stock',
      render: (variant) => {
        const stockInfo = getStockStatusInfo(variant.in_stock);
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${stockInfo.dotColor}`}></div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
              {variant.in_stock} ({stockInfo.label})
            </span>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (variant) => {
        const statusInfo = getVariantStatusInfo(variant.status);
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        );
      }
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (variant) => (
        <div className="text-sm text-gray-600">
          {new Date(variant.createdAt).toLocaleDateString('vi-VN')}
        </div>
      )
    },
    {
      title: '',
      key: 'actions',
      render: (variant) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => handleViewVariant(variant)
            },
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => handleEditVariant(variant._id)
            },
            {
              label: variant.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt',
              icon: variant.status === 'active' ? FaEyeSlash : FaEye,
              onClick: () => handleToggleStatus(variant._id, variant.status, variant.name)
            },
            {
              label: 'Xóa biến thể',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteVariant(variant._id, variant.name)
            }
          ]}
          onActionClick={(action) => action.onClick()}
        />
      )
    }
  ];

  // Filter options
  const filterOptions = [
    {
      key: 'status',
      label: 'Trạng thái',
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Vô hiệu hóa' }
      ]
    },
    {
      key: 'product',
      label: 'Sản phẩm',
      value: productFilter,
      options: [
        { value: 'All', label: 'Tất cả sản phẩm' },
        ...products.map(product => ({
          value: product._id,
          label: product.name
        }))
      ]
    },
    {
      key: 'stock',
      label: 'Tồn kho',
      value: stockFilter,
      options: [
        { value: 'All', label: 'Tất cả' },
        { value: 'in_stock', label: 'Còn hàng' },
        { value: 'low_stock', label: 'Sắp hết' },
        { value: 'out_of_stock', label: 'Hết hàng' }
      ]
    }
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Biến thể</h1>
          <p className="text-gray-600">Quản lý các biến thể sản phẩm</p>
        </div>
        <NavLink
          to="/admin/addvariant"
          className="inline-flex items-center px-4 py-2 bg-[#06AEF4] text-white rounded-lg hover:bg-[#0590d8] transition-colors duration-200"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Thêm biến thể
        </NavLink>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <AdminCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaCubes className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng biến thể</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaEye className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active || 0}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaEyeSlash className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vô hiệu hóa</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inactive || 0}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaWarehouse className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.lowStock || 0}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaBox className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hết hàng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.outOfStock || 0}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Search and Filter */}
      <AdminSearchFilter
        searchQuery={searchQuery}
        onSearchChange={(value) => handleFilterChange('search', value)}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        placeholder="Tìm kiếm biến thể..."
      />

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <AdminCard>
        <AdminTable
          data={variants}
          columns={columns}
          loading={loading}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onBulkAction={handleBulkAction}
          bulkActions={[
            { label: 'Kích hoạt', action: 'kích hoạt' },
            { label: 'Vô hiệu hóa', action: 'vô hiệu hóa' },
            { label: 'Xóa', action: 'xóa' }
          ]}
        />
      </AdminCard>

      {/* Pagination */}
      <div className="mt-6">
        <AdminPagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={variants.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* View Modal */}
      <AdminModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setCurrentVariant(null);
        }}
        title="Chi tiết biến thể"
        size="lg"
      >
        {currentVariant && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tên biến thể:</label>
                    <p className="text-gray-900">{currentVariant.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">SKU:</label>
                    <p className="font-mono text-gray-900">{currentVariant.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Sản phẩm:</label>
                    <p className="text-gray-900">{currentVariant.product_id?.name || 'Không xác định'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mô tả:</label>
                    <p className="text-gray-900">{currentVariant.description || 'Không có mô tả'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giá và tồn kho</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Giá hiện tại:</label>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(currentVariant.price)}</p>
                  </div>
                  {currentVariant.original_price && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Giá gốc:</label>
                      <p className="text-gray-900 line-through">{formatCurrency(currentVariant.original_price)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tồn kho:</label>
                    <p className="text-gray-900">{currentVariant.stock} sản phẩm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Trạng thái:</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getVariantStatusInfo(currentVariant.status).color
                    }`}>
                      {getVariantStatusInfo(currentVariant.status).label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {currentVariant.images && currentVariant.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentVariant.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${currentVariant.name} - ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {currentVariant.attributes && Object.keys(currentVariant.attributes).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thuộc tính</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(currentVariant.attributes).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-gray-600">{key}:</label>
                      <p className="text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminVariant; 