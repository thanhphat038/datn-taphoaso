import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaListAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllBrands, createBrand, updateBrand, deleteBrand, toggleBrandStatus } from '../../service/Admin.Service.js';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminBrand = () => {
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditBrand, setCurrentEditBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Toast/Message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getAllBrands();
        setBrands(response.data.data || []);
      } catch (error) {
        setError('Không thể tải danh sách thương hiệu: ' + (error.response?.data?.message || error.message));
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Handle add brand
  const handleAddBrand = async () => {
    if (!formData.name.trim()) {
      setMessage('Vui lòng nhập tên thương hiệu');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      setLoading(true);
      const response = await createBrand(formData);
      setBrands([...brands, response.data.data]);
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      setMessage('Tạo thương hiệu thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi tạo thương hiệu: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit brand
  const handleEditBrand = (brand) => {
    setCurrentEditBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      setMessage('Vui lòng nhập tên thương hiệu');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      setLoading(true);
      await updateBrand(currentEditBrand._id, formData);
      setBrands(brands.map(b => b._id === currentEditBrand._id ? { ...b, ...formData } : b));
      setShowEditModal(false);
      setCurrentEditBrand(null);
      setFormData({ name: '', description: '' });
      setMessage('Cập nhật thương hiệu thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi cập nhật thương hiệu: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete brand
  const handleDeleteBrand = async (brandId, brandName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"?\n\nHành động này không thể hoàn tác!`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      setLoading(true);
      await deleteBrand(brandId);
      setBrands(brands.filter(b => b._id !== brandId));
      setMessage('Xóa thương hiệu thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa thương hiệu: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle brand status
  const handleToggleStatus = async (brandId, currentStatus, brandName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiển thị';
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} thương hiệu "${brandName}"?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      setLoading(true);
      const response = await toggleBrandStatus(brandId, newStatus);
      const updatedBrand = response?.data?.data;
      setBrands(brands.map(b =>
        b._id === brandId
          ? (updatedBrand ? { ...b, ...updatedBrand } : { ...b, status: newStatus })
          : b
      ));
      setMessage(`Đã ${actionText} thương hiệu thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} thương hiệu: ` + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort brands
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name && brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || brand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedBrands = filteredBrands.sort((a, b) => {
    const dateA = new Date(a.create_at || a.created_at || 0);
    const dateB = new Date(b.create_at || b.created_at || 0);
    return dateB - dateA;
  });

  const totalBrands = sortedBrands.length;
  const totalPages = Math.ceil(totalBrands / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBrands = sortedBrands.slice(startIndex, startIndex + pageSize);

  // Get brand status info
  const getBrandStatusInfo = (status) => {
    if (status === 'active') {
      return {
        label: 'Hiển thị',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Ẩn',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        dotColor: 'bg-gray-500'
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Thương hiệu',
      key: 'name',
      render: (brand) => (
        <div className="font-semibold text-gray-900">{brand.name}</div>
      )
    },
    {
      title: 'Mô tả',
      key: 'description',
      render: (brand) => (
        <div className="text-sm text-gray-600 max-w-xs">
          {brand.description || 'Không có mô tả'}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (brand) => (
        <div className="text-sm text-gray-600">
          {brand.create_at ? new Date(brand.create_at).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'N/A'}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (brand) => {
        const statusInfo = getBrandStatusInfo(brand.status);
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
      render: (brand) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => handleEditBrand(brand)
            },
            {
              label: brand.status === 'active' ? 'Ẩn thương hiệu' : 'Hiển thị thương hiệu',
              icon: brand.status === 'active' ? FaEyeSlash : FaEye,
              variant: brand.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(brand._id, brand.status, brand.name)
            },
            {
              label: 'Xóa thương hiệu',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteBrand(brand._id, brand.name)
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
             statusFilter === 'active' ? 'Hiển thị' : 'Ẩn',
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hiển thị' },
        { value: 'inactive', label: 'Ẩn' }
      ]
    }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  // Calculate statistics
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const inactiveBrands = brands.filter(b => b.status === 'inactive').length;
  const now = new Date();
  const newThisMonth = brands.filter(b => {
    const created = b.create_at || b.created_at || b.createdAt;
    if (!created) return false;
    const d = new Date(created);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các thương hiệu sản phẩm</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Thêm thương hiệu
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalBrands}</div>
            <div className="text-sm text-gray-600">Tổng thương hiệu</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeBrands}</div>
            <div className="text-sm text-gray-600">Đang hiển thị</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-gray-600">{inactiveBrands}</div>
            <div className="text-sm text-gray-600">Đang ẩn</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">{newThisMonth}</div>
            <div className="text-sm text-gray-600">Mới trong tháng</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tên thương hiệu..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Brands Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedBrands}
            loading={loading}
            error={error}
            emptyMessage="Không có thương hiệu nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedBrands.map(b => b._id) : []);
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
            totalItems={totalBrands}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* Add Brand Modal */}
        <AdminModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ name: '', description: '' });
          }}
          title="Thêm thương hiệu mới"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ name: '', description: '' });
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton 
                onClick={handleAddBrand}
                disabled={loading}
              >
                {loading ? 'Đang tạo...' : 'Tạo thương hiệu'}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên thương hiệu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả thương hiệu"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>

        {/* Edit Brand Modal */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCurrentEditBrand(null);
            setFormData({ name: '', description: '' });
          }}
          title="Chỉnh sửa thương hiệu"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentEditBrand(null);
                  setFormData({ name: '', description: '' });
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton 
                onClick={handleSaveEdit}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Thương hiệu</div>
              <div className="font-semibold text-gray-900">{currentEditBrand?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thương hiệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên thương hiệu"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả thương hiệu"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminBrand;
