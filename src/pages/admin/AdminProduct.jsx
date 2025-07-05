import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBox, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        setProducts(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách sản phẩm: ' + error.message);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle edit product
  const handleEditProduct = (productId) => {
    navigate(`/admin/addproduct/${productId}`);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId, productName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle product status
  const handleToggleStatus = async (productId, currentStatus, productName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiện';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} sản phẩm "${productName}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${productId}/${action}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${action} product`);
      }

      setProducts(products.map(p => 
        p._id === productId ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      alert(`Lỗi khi ${actionText} sản phẩm: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply price sorting
  if (priceFilter === 'LowToHigh') {
    filteredProducts = filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (priceFilter === 'HighToLow') {
    filteredProducts = filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

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
        label: 'Hoạt động',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Không hoạt động',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500'
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (product) => {
        const truncateDescription = (desc, wordLimit = 5) => {
          if (!desc) return 'Không có mô tả';
          const words = desc.split(' ');
          if (words.length <= wordLimit) return desc;
          return words.slice(0, wordLimit).join(' ') + '...';
        };
        return (
          <div className=" flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: product.images && product.images[0] ? 'none' : 'flex' }}>
                <FaImage className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">{product.name}</div>
              <div className="text-sm text-gray-500 truncate">{truncateDescription(product.description)}</div>
            </div>
          </div>
        );
      }
    },
    {
      title: 'Danh mục',
      key: 'category',
      render: (product) => (
        <div className="text-sm text-gray-600">
          {product.category_id?.name || 'Chưa phân loại'}
        </div>
      )
    },
    {
      title: 'Giá bán',
      key: 'price',
      render: (product) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">{formatCurrency(product.price)}</div>
          {product.original_price && product.original_price > product.price && (
            <div className="text-sm text-gray-500 line-through">{formatCurrency(product.original_price)}</div>
          )}
        </div>
      )
    },
    {
      title: 'Kho',
      key: 'in_stock',
      render: (product) => (
        <div className="text-center">
          <div className={`font-semibold ${
            (product.in_stock || 0) > 10 ? 'text-green-600' : 
            (product.in_stock || 0) > 0 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {product.in_stock || 0}
          </div>
          <div className="text-xs text-gray-500">
            {(product.in_stock || 0) > 10 ? 'Còn hàng' : 
             (product.in_stock || 0) > 0 ? 'Sắp hết' : 'Hết hàng'}
          </div>
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      key: 'created_at',
      render: (product) => (
        <div className="text-sm text-gray-600 text-center">
          {(product.created_at || product.create_at) ? 
            new Date(product.created_at || product.create_at).toLocaleDateString('vi-VN') : 'N/A'}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (product) => {
        const statusInfo = getProductStatusInfo(product.status);
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${statusInfo.color}`}>
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
            {statusInfo.label}
          </span>
        );
      }
    },
    {
      title: '',
      key: 'actions',
      render: (product) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => handleEditProduct(product._id)
            },
            {
              label: product.status === 'active' ? 'Ẩn sản phẩm' : 'Hiện sản phẩm',
              icon: product.status === 'active' ? FaEyeSlash : FaEye,
              variant: product.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(product._id, product.status, product.name)
            },
            {
              label: 'Xóa sản phẩm',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteProduct(product._id, product.name)
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
      label: statusFilter === 'All' ? 'Tất cả trạng thái' : 
             statusFilter === 'active' ? 'Hoạt động' : 'Không hoạt động',
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
      ]
    },
    {
      key: 'price',
      label: priceFilter === 'All' ? 'Sắp xếp giá' :
             priceFilter === 'LowToHigh' ? 'Giá: Thấp → Cao' : 'Giá: Cao → Thấp',
      value: priceFilter,
      options: [
        { value: 'All', label: 'Sắp xếp giá' },
        { value: 'LowToHigh', label: 'Giá: Thấp → Cao' },
        { value: 'HighToLow', label: 'Giá: Cao → Thấp' }
      ]
    }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    } else if (key === 'price') {
      setPriceFilter(value);
    }
    setCurrentPage(1);
  };

  // Calculate statistics
  const activeProducts = products.filter(p => p.status === 'active').length;
  const inactiveProducts = products.filter(p => p.status === 'inactive').length;
  const lowStockProducts = products.filter(p => (p.in_stock || 0) <= 10 && (p.in_stock || 0) > 0).length;
  const outOfStockProducts = products.filter(p => (p.in_stock || 0) === 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm và thông tin chi tiết</p>
          </div>
          <NavLink 
            to="/admin/addproduct" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Thêm sản phẩm
          </NavLink>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalProducts}</div>
            <div className="text-sm text-gray-600">Tổng sản phẩm</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            <div className="text-sm text-gray-600">Đang bán</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-red-600">{inactiveProducts}</div>
            <div className="text-sm text-gray-600">Ngừng bán</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            <div className="text-sm text-gray-600">Sắp hết hàng</div>
            
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-gray-600">{outOfStockProducts}</div>
            <div className="text-sm text-gray-600">Hết hàng</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tên sản phẩm..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Products Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedProducts}
            loading={loading}
            error={error}
            emptyMessage="Không có sản phẩm nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedProducts.map(product => product._id) : []);
            }}
            onSelectOne={(id, checked) => {
              setSelectedIds(prev => 
                checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
              );
            }}
          />
          
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalProducts}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>
        
      </div>
    </AdminLayout>
  );
};

export default AdminProduct;
