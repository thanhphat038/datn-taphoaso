import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaListAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
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
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const result = await response.json();
        setCategories(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách danh mục: ' + error.message);
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const result = await response.json();
      setCategories([...categories, result.data]);
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('Lỗi khi tạo danh mục: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setCurrentEditCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories/${currentEditCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      setCategories(categories.map(cat => 
        cat._id === currentEditCategory._id ? { ...cat, ...formData } : cat
      ));

      setShowEditModal(false);
      setCurrentEditCategory(null);
      setFormData({ name: '', description: '' });
    } catch (error) {
      alert('Lỗi khi cập nhật danh mục: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      setCategories(categories.filter(cat => cat._id !== categoryId));
    } catch (error) {
      alert('Lỗi khi xóa danh mục: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle category status
  const handleToggleStatus = async (categoryId, currentStatus, categoryName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiển thị';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} danh mục "${categoryName}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category status');
      }

      setCategories(categories.map(cat => 
        cat._id === categoryId ? { ...cat, status: newStatus } : cat
      ));
    } catch (error) {
      alert(`Lỗi khi ${actionText} danh mục: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedCategories = filteredCategories.sort((a, b) => {
    const dateA = new Date(a.create_at || a.created_at || 0);
    const dateB = new Date(b.create_at || b.created_at || 0);
    return dateB - dateA; // Mặc định sắp xếp mới nhất
  });

  const totalCategories = sortedCategories.length;
  const totalPages = Math.ceil(totalCategories / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + pageSize);

  // Get category status info
  const getCategoryStatusInfo = (status) => {
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
      title: 'Danh mục',
      key: 'name',
      render: (category) => (
        <div className="font-semibold text-gray-900">{category.name}</div>
      )
    },
    {
      title: 'Mô tả',
      key: 'description',
      render: (category) => (
        <div className="text-sm text-gray-600 max-w-xs">
          {category.description || 'Không có mô tả'}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (category) => (
        <div className="text-sm text-gray-600">
          {category.create_at ? new Date(category.create_at).toLocaleDateString('vi-VN', {
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
      render: (category) => {
        const statusInfo = getCategoryStatusInfo(category.status);
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
      render: (category) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => handleEditCategory(category)
            },
            {
              label: category.status === 'active' ? 'Ẩn danh mục' : 'Hiển thị danh mục',
              icon: category.status === 'active' ? FaEyeSlash : FaEye,
              variant: category.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(category._id, category.status, category.name)
            },
            {
              label: 'Xóa danh mục',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteCategory(category._id, category.name)
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
  const activeCategories = categories.filter(c => c.status === 'active').length;
  const inactiveCategories = categories.filter(c => c.status === 'inactive').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các danh mục sản phẩm</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalCategories}</div>
            <div className="text-sm text-gray-600">Tổng danh mục</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
            <div className="text-sm text-gray-600">Đang hiển thị</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-gray-600">{inactiveCategories}</div>
            <div className="text-sm text-gray-600">Đang ẩn</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {categories.filter(c => c.createdAt && new Date(c.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
            </div>
            <div className="text-sm text-gray-600">Mới trong tháng</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tên danh mục..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Categories Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedCategories}
            loading={loading}
            error={error}
            emptyMessage="Không có danh mục nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedCategories.map(cat => cat._id) : []);
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
            totalItems={totalCategories}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* Add Category Modal */}
        <AdminModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ name: '', description: '' });
          }}
          title="Thêm danh mục mới"
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả danh mục"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>

        {/* Edit Category Modal */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCurrentEditCategory(null);
            setFormData({ name: '', description: '' });
          }}
          title="Chỉnh sửa danh mục"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentEditCategory(null);
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
              <div className="text-sm text-gray-600">Danh mục</div>
              <div className="font-semibold text-gray-900">{currentEditCategory?.name}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên danh mục"
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
                placeholder="Nhập mô tả danh mục"
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

export default AdminCategory;
