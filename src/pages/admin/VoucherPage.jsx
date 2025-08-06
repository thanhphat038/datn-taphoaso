import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTicketAlt, FaPercent, FaDollarSign, FaCalendar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import { getAllVouchers, deleteVoucher as deleteVoucherService, updateVoucher } from '../../service/Admin.Service.jsx';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Fetch vouchers and auto-update expired ones
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const response = await getAllVouchers();
        let vouchersData = response.data.data || [];
        
        // Auto-update expired vouchers to inactive
        const updatedVouchers = vouchersData.map(voucher => {
          if (isExpired(voucher.end_date) && voucher.status === 'active') {
            return { ...voucher, status: 'inactive' };
          }
          return voucher;
        });
        
        setVouchers(updatedVouchers);
      } catch (error) {
        setError('Không thể tải danh sách voucher: ' + (error.response?.data?.message || error.message));
        console.error('Error fetching vouchers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  // Handle delete voucher
  const handleDeleteVoucher = async (voucherId, voucherCode) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa voucher "${voucherCode}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteVoucherService(voucherId);

      setVouchers(vouchers.filter(v => v._id !== voucherId));
      setMessage('Xóa voucher thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa voucher: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle voucher status
  const handleToggleStatus = async (voucherId, currentStatus, voucherCode) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'vô hiệu hóa' : 'kích hoạt';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} voucher "${voucherCode}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await updateVoucher(voucherId, { status: newStatus });

      if (response.status === 200) {
        setVouchers(vouchers.map(v => 
          v._id === voucherId ? { ...v, status: newStatus } : v
        ));
        setMessage(`Đã ${actionText} voucher thành công!`);
        setMessageType('success');
        setTimeout(() => setMessage(''), 2000);
      } else {
        const errorData = response.data;
        throw new Error(errorData.message || 'Failed to update voucher status');
      }
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} voucher: ` + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Check if voucher is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format discount value
  const formatDiscount = (voucher) => {
    if (voucher.discount_type === 'percentage') {
      return `${voucher.discount_value}%`;
    } else {
      return formatCurrency(voucher.discount_value);
    }
  };

  // Filter vouchers
  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code && voucher.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'expired') {
      matchesStatus = isExpired(voucher.end_date);
    } else {
      matchesStatus = voucher.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const totalVouchers = filteredVouchers.length;
  const totalPages = Math.ceil(totalVouchers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedVouchers = filteredVouchers.slice(startIndex, startIndex + pageSize);

  // Get voucher status info
  const getVoucherStatusInfo = (voucher) => {
    if (isExpired(voucher.end_date)) {
      return {
        label: 'Hết hạn',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500'
      };
    } else if (voucher.status === 'active') {
      return {
        label: 'Hoạt động',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Không hoạt động',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        dotColor: 'bg-gray-500'
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Voucher',
      key: 'code',
      render: (voucher) => (
        <div className="font-semibold text-gray-900">{voucher.code}</div>
      )
    },
    {
      title: 'Giảm giá',
      key: 'discount',
      render: (voucher) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            {voucher.discount_type === 'percentage' ? (
              <FaPercent className="w-3 h-3 text-orange-600" />
            ) : (
              <FaDollarSign className="w-3 h-3 text-orange-600" />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{formatDiscount(voucher)}</div>
            {voucher.max_discount && voucher.discount_type === 'percentage' && (
              <div className="text-sm text-gray-500">Tối đa {formatCurrency(voucher.max_discount)}</div>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Đơn tối thiểu',
      key: 'min_order',
      render: (voucher) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{formatCurrency(voucher.min_order_value)}</div>
        </div>
      )
    },
    {
      title: 'Thời gian',
      key: 'dates',
      render: (voucher) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <FaCalendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              {new Date(voucher.start_date).toLocaleDateString('vi-VN')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaCalendar className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">
              {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (voucher) => {
        const statusInfo = getVoucherStatusInfo(voucher);
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
      render: (voucher) => {
        const isVoucherExpired = isExpired(voucher.end_date);
        const actions = [
          {
            label: 'Chỉnh sửa',
            icon: FaEdit,
            onClick: () => window.location.href = `/admin/addvoucher/${voucher._id}`
          },
          {
            label: 'Xóa voucher',
            icon: FaTrash,
            variant: 'danger',
            onClick: () => handleDeleteVoucher(voucher._id, voucher.code)
          }
        ];

        if (!isVoucherExpired) {
          actions.splice(1, 0, {
            label: voucher.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt',
            icon: voucher.status === 'active' ? FaTrash : FaEdit,
            variant: voucher.status === 'active' ? 'warning' : 'success',
            onClick: () => handleToggleStatus(voucher._id, voucher.status, voucher.code)
          });
        }

        return (
          <AdminActionDropdown
            actions={actions}
            onActionClick={(action) => action.onClick()}
          />
        );
      }
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
  const activeVouchers = vouchers.filter(v => v.status === 'active' && !isExpired(v.end_date)).length;
  const expiredVouchers = vouchers.filter(v => isExpired(v.end_date)).length;

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">Quản lý voucher</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các mã giảm giá</p>
          </div>
          <NavLink 
            to="/admin/addvoucher" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Thêm voucher
          </NavLink>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalVouchers}</div>
            <div className="text-sm text-gray-600">Tổng voucher</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeVouchers}</div>
            <div className="text-sm text-gray-600">Đang hoạt động</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-red-600">{expiredVouchers}</div>
            <div className="text-sm text-gray-600">Đã hết hạn</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-gray-600">{vouchers.filter(v => v.status === 'inactive').length}</div>
            <div className="text-sm text-gray-600">Không hoạt động</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo mã voucher..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Quick Status Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleFilterChange("status", "All")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "All"
                ? "bg-gradient-to-r from-[#06AEF4] to-[#05a0e0] text-white shadow-lg shadow-[#06AEF4]/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-[#06AEF4]/50 hover:text-[#06AEF4] hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Tất cả
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "All" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-[#06AEF4]/10"
            }`}>
              {vouchers.length}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange("status", "active")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "active"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-green-500/50 hover:text-green-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đang hoạt động
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "active" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-green-500/10"
            }`}>
              {activeVouchers}
            </span>
          </button>

          <button
            onClick={() => handleFilterChange("status", "inactive")}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "inactive"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-red-500/50 hover:text-red-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Không hoạt động
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "inactive" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-red-500/10"
            }`}>
              {vouchers.filter(v => v.status === 'inactive').length}
            </span>
          </button>

          <button
            onClick={() => {
              const expiredCount = vouchers.filter(v => isExpired(v.end_date)).length;
              setStatusFilter(prev => prev === "expired" ? "All" : "expired");
              setCurrentPage(1);
            }}
            className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              statusFilter === "expired"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-500/50 hover:text-orange-600 hover:shadow-md"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đã hết hạn
            </span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === "expired" 
                ? "bg-white/20 text-white" 
                : "bg-gray-100 text-gray-600 group-hover:bg-orange-500/10"
            }`}>
              {expiredVouchers}
            </span>
          </button>
        </div>

        {/* Vouchers Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedVouchers}
            loading={loading}
            error={error}
            emptyMessage="Không có voucher nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedVouchers.map(voucher => voucher._id) : []);
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
            totalItems={totalVouchers}
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

export default VoucherPage;
