import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCalendar, FaDollarSign } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllOrders, updateOrderStatus as updateOrderStatusService, deleteOrder as deleteOrderService } from '../../service/Admin.Service.jsx';

const API_BASE_URL = 'http://localhost:3000/api';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [currentEditOrder, setCurrentEditOrder] = useState(null);

  // Status options with beautiful styling
  const statusOptions = [
    { 
      value: 'pending', 
      label: 'Chờ xử lý', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      dotColor: 'bg-yellow-500'
    },
    { 
      value: 'processing', 
      label: 'Đang xử lý', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500'
    },
    { 
      value: 'shipped', 
      label: 'Đã giao hàng', 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      dotColor: 'bg-purple-500'
    },
    { 
      value: 'delivered', 
      label: 'Hoàn thành', 
      color: 'bg-green-100 text-green-800 border-green-200',
      dotColor: 'bg-green-500'
    },
    { 
      value: 'cancelled', 
      label: 'Đã hủy', 
      color: 'bg-red-100 text-red-800 border-red-200',
      dotColor: 'bg-red-500'
    }
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllOrders();
        const ordersData = response.data.data;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        setError('Không thể tải danh sách đơn hàng: ' + (error.response?.data?.message || error.message));
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!currentEditOrder || !editStatus) return;
    try {
      setLoading(true);
      await updateOrderStatusService(currentEditOrder._id, editStatus);
      setOrders(orders.map(order => 
        order._id === currentEditOrder._id ? { ...order, status: editStatus } : order
      ));
      setShowEditModal(false);
      setCurrentEditOrder(null);
      setEditStatus('');
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa đơn hàng này?\n\nHành động này không thể hoàn tác!`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      setLoading(true);
      await deleteOrderService(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      alert('Lỗi khi xóa đơn hàng: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Filter and pagination logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.receiver && order.receiver.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // Table columns
  const columns = [
    {
      title: 'Đơn hàng',
      key: 'id',
      render: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#06AEF4] bg-opacity-10 rounded-lg flex items-center justify-center">
            <FaShoppingCart className="w-4 h-4 text-[#06AEF4]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">#{order._id?.slice(-8)}</div>
            <div className="text-sm text-gray-500">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (order) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUser className="w-3 h-3 text-gray-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{order.receiver || 'Không có tên'}</div>
            <div className="text-sm text-gray-500">{order.sdt || 'Không có SĐT'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      render: (order) => (
        <div className="flex items-start gap-2 max-w-xs">
          <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">{order.address || 'Không có địa chỉ'}</span>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (order) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">{formatCurrency(calculateOrderTotal(order))}</div>
          <div className="text-sm text-gray-500">
            {order.payment_method === 'cod' ? 'Tiền mặt' : order.payment_method || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (order) => {
        const statusInfo = getStatusInfo(order.status);
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
      render: (order) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)
            },
            {
              label: 'Sửa trạng thái',
              icon: FaEdit,
              onClick: () => {
                setCurrentEditOrder(order);
                setEditStatus(order.status);
                setShowEditModal(true);
              }
            },
            {
              label: 'Xóa đơn hàng',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteOrder(order._id)
            }
          ]}
          onActionClick={(action) => action.onClick()}
        />
      )
    }
  ];

  // Filter options for search component
  const filterOptions = [
    {
      key: 'status',
      label: selectedStatus === 'All' ? 'Tất cả trạng thái' : getStatusInfo(selectedStatus).label,
      value: selectedStatus,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        ...statusOptions.map(status => ({
          value: status.value,
          label: status.label
        }))
      ]
    }
  ];

  const handleFilterChange = (key, value, label) => {
    if (key === 'status') {
      setSelectedStatus(value);
      setCurrentPage(1);
    }
  };

  // Render expanded row
  const renderExpandedRow = (order) => (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <AdminCard title="Chi tiết sản phẩm" className="h-fit">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.product_id?.name || 'Sản phẩm không xác định'}</div>
                    <div className="text-sm text-gray-500">Số lượng: {item.qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.price * item.qty)}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(item.price)}/sp</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">Không có sản phẩm</div>
            )}
          </div>
        </AdminCard>

        {/* Order Summary */}
        <AdminCard title="Thông tin đơn hàng" className="h-fit">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
              <span className="text-gray-600">Tổng tiền hàng:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(calculateOrderTotal(order))}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
              <span className="text-gray-600">Phương thức thanh toán:</span>
              <span className="font-medium text-gray-900">{order.payment_method === 'cod' ? 'Tiền mặt' : order.payment_method || 'N/A'}</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-100">
              <div className="text-gray-600 mb-2">Ghi chú:</div>
              <div className="text-gray-900">{order.note || 'Không có ghi chú'}</div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#06AEF4] to-[#0590d8] rounded-lg text-white">
              <span>Trạng thái hiện tại:</span>
              <span className="font-semibold">{getStatusInfo(order.status).label}</span>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">Quản lý đơn hàng</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả đơn hàng</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Tổng đơn hàng</div>
              <div className="text-2xl font-bold text-[#06AEF4]">{totalOrders}</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo ID đơn hàng, tên khách hàng hoặc địa chỉ..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Orders Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedOrders}
            loading={loading}
            error={error}
            emptyMessage="Không có đơn hàng nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedOrders.map(order => order._id) : []);
            }}
            onSelectOne={(id, checked) => {
              setSelectedIds(prev => 
                checked ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
              );
            }}
            expandedRowId={expandedOrderId}
            renderExpandedRow={renderExpandedRow}
            onRowClick={(order) => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
          />
          
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalOrders}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* Edit Status Modal */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCurrentEditOrder(null);
            setEditStatus('');
          }}
          title="Cập nhật trạng thái đơn hàng"
          footer={
            <>
              <ModalButton 
                variant="secondary" 
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentEditOrder(null);
                  setEditStatus('');
                }}
              >
                Hủy bỏ
              </ModalButton>
              <ModalButton 
                onClick={handleStatusUpdate}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Cập nhật'}
              </ModalButton>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Đơn hàng</div>
              <div className="font-semibold text-gray-900">#{currentEditOrder?._id?.slice(-8)}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái mới
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default OrderPage;
