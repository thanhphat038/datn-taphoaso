import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaListAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminBlogCategory = () => {
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

  // Toast/Message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Fetch blog categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('auth_token');
        const response = await axios.get(`${API_BASE_URL}/blogs_categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data.data || []);
      } catch (error) {
        setError('Không thể tải danh sách danh mục blog: ' + (error.response?.data?.message || error.message));
        console.error('Error fetching blog categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle add category
  const handleAddCategory = async () => {
    if (!formData.name.trim()) {
      setMessage('Vui lòng nhập tên danh mục');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      const response = await axios.post(`${API_BASE_URL}/blogs_categories`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: 'active'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCategories([...categories, response.data.data]);
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      setMessage('Tạo danh mục blog thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi tạo danh mục blog: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
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
      setMessage('Vui lòng nhập tên danh mục');
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      const response = await axios.put(`${API_BASE_URL}/blogs_categories/${currentEditCategory._id}`, {
        name: formData.name.trim(),
        description: formData.description.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(categories.map(cat => 
        cat._id === currentEditCategory._id ? response.data.data : cat
      ));
      setShowEditModal(false);
      setCurrentEditCategory(null);
      setFormData({ name: '', description: '' });
      setMessage('Cập nhật danh mục blog thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi cập nhật danh mục blog: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      await axios.delete(`${API_BASE_URL}/blogs_categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(categories.filter(cat => cat._id !== categoryId));
      setMessage('Xóa danh mục blog thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa danh mục blog: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (categoryId, currentStatus, categoryName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa';

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      await axios.patch(`${API_BASE_URL}/blogs_categories/${categoryId}/toggle-status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategories(categories.map(cat => 
        cat._id === categoryId ? { ...cat, status: newStatus } : cat
      ));
      setMessage(`${statusText.charAt(0).toUpperCase() + statusText.slice(1)} danh mục blog thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi thay đổi trạng thái danh mục blog: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Get status info
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
  const now = new Date();
  const newThisMonth = categories.filter(c => {
    const created = c.create_at || c.created_at || c.createdAt;
    if (!created) return false;
    const d = new Date(created);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục blog</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các danh mục blog</p>
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
            <div className="text-2xl font-bold text-purple-600">{newThisMonth}</div>
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
            emptyMessage="Không có danh mục blog nào"
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
      </div>

      {/* Add Category Modal */}
      <AdminModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ name: '', description: '' });
        }}
        title="Thêm danh mục blog mới"
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
              placeholder="Nhập tên danh mục blog"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả danh mục
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả danh mục blog (tùy chọn)"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
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
        title="Chỉnh sửa danh mục blog"
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
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
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
              placeholder="Nhập tên danh mục blog"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả danh mục
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả danh mục blog (tùy chọn)"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
            />
          </div>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default AdminBlogCategory; 