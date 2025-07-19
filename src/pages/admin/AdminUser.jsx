import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const result = await response.json();
        setUsers(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách người dùng: ' + error.message);
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle edit user
  const handleEditUser = (user) => {
    setCurrentEditUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      username: user.username || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!currentEditUser) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${currentEditUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      setUsers(users.map(user => 
        user._id === currentEditUser._id ? { ...user, ...editFormData } : user
      ));

      setShowEditModal(false);
      setCurrentEditUser(null);
      setEditFormData({ name: '', email: '', phone: '', username: '' });
    } catch (error) {
      alert('Lỗi khi cập nhật người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userName) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa người dùng "${userName}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      alert('Lỗi khi xóa người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (userId, currentStatus, userName) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'vô hiệu hóa' : 'kích hoạt';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} tài khoản "${userName}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
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
        throw new Error(errorData.message || 'Failed to update user status');
      }

      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      alert(`Lỗi khi ${actionText} tài khoản: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Get user status info
  const getUserStatusInfo = (status) => {
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

  // Generate avatar initials
  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold">
            {getAvatarInitials(user.name)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name || 'Không có tên'}</div>
            <div className="text-sm text-gray-500">@{user.username || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Thông tin liên hệ',
      key: 'contact',
      render: (user) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <FaEnvelope className="w-3 h-3 text-gray-400" />
            <span className="text-gray-700">{user.email || 'Không có email'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaPhone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-700">{user.phone || 'Không có SĐT'}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Ngày tham gia',
      key: 'joinDate',
      render: (user) => (
        <div className="text-sm text-gray-600">
          {user.create_at ? new Date(user.create_at).toLocaleDateString('vi-VN', {
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
      render: (user) => {
        const statusInfo = getUserStatusInfo(user.status);
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
      render: (user) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => handleEditUser(user)
            },
            {
              label: user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt',
              icon: user.status === 'active' ? FaUserTimes : FaUserCheck,
              variant: user.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(user._id, user.status, user.name)
            },
            {
              label: 'Xóa người dùng',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteUser(user._id, user.name)
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
    }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  // Calculate statistics
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">Quản lý khách hàng</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái khách hàng</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalUsers}</div>
            <div className="text-sm text-gray-600">Tổng khách hàng</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
            <div className="text-sm text-gray-600">Không hoạt động</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
            </div>
            <div className="text-sm text-gray-600">Mới trong tháng</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tên, email hoặc username..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Users Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedUsers}
            loading={loading}
            error={error}
            emptyMessage="Không có người dùng nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedUsers.map(user => user._id) : []);
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
            totalItems={totalUsers}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* Edit User Modal */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCurrentEditUser(null);
            setEditFormData({ name: '', email: '', phone: '', username: '' });
          }}
          title="Chỉnh sửa thông tin khách hàng"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentEditUser(null);
                  setEditFormData({ name: '', email: '', phone: '', username: '' });
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
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getAvatarInitials(currentEditUser?.name)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{currentEditUser?.name}</div>
                <div className="text-sm text-gray-500">ID: {currentEditUser?._id}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              />
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminUser;
