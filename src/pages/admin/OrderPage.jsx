import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaShoppingCart, FaUser, FaMapMarkerAlt, FaCalendar, FaDollarSign } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllOrders, updateOrderStatus as updateOrderStatusService, deleteOrder as deleteOrderService, getUserById, getOrderDetailsByOrderId } from '../../service/Admin.Service.js';
import { formatDateShort } from '../../utils';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const OrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Modal states
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [currentEditOrder, setCurrentEditOrder] = useState(null);

  // Check for order ID in URL parameters on component mount
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      setSearchQuery(orderId);
      // Clear the URL parameter after setting the search query
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

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
      value: 'delivered', 
      label: 'Hoàn thành', 
      color: 'bg-green-100 text-green-800 border-green-200',
      dotColor: 'bg-green-500'
    },
    { 
      value: 'payment_failed', 
      label: 'Thanh toán thất bại', 
      color: 'bg-red-100 text-red-800 border-red-200',
      dotColor: 'bg-red-500'
    },
    { 
      value: 'cancelled', 
      label: 'Đã hủy', 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      dotColor: 'bg-gray-500'
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
        const ordersData = response.data.data.ordersWithItems || [];

        // Lấy chi tiết user cho từng order (KHÔNG lấy orderdetail nữa)
        const ordersWithDetails = await Promise.all(
          ordersData.map(async (order) => {
            let user = null;
            try {
              if (order.user_id && typeof order.user_id === 'string') {
                const userRes = await getUserById(order.user_id);
                user = userRes?.data?.data || userRes?.data;
              } else if (typeof order.user_id === 'object' && order.user_id !== null) {
                user = order.user_id;
              }
            } catch (e) {}
            return {
              ...order,
              user_id: user,
            };
          })
        );
        
        // Sắp xếp theo thời gian tạo mới nhất đầu tiên
        const sortedOrders = ordersWithDetails.sort((a, b) => {
          const dateA = new Date(a.created_at || a.create_at || 0);
          const dateB = new Date(b.created_at || b.create_at || 0);
          
          // Kiểm tra date hợp lệ
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // Giữ nguyên thứ tự nếu date không hợp lệ
          }
          
          return dateB - dateA; // Giảm dần (mới nhất trước)
        });
        
        setOrders(sortedOrders);
        console.log('All orders with details:', sortedOrders);
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
        order._id === currentEditOrder._id ? { ...order, order_status: editStatus } : order
      ));
      setShowEditModal(false);
      setCurrentEditOrder(null);
      setEditStatus('');
      setMessage('Cập nhật trạng thái thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
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
      setMessage('Xóa đơn hàng thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa đơn hàng: ' + (error.response?.data?.message || error.message));
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

    // Calculate statistics for filter tabs
  const allOrders = orders.length;
  const pendingOrders = orders.filter(order => (order.order_status || order.status) === 'pending').length;
  const processingOrders = orders.filter(order => (order.order_status || order.status) === 'processing').length;
  const deliveredOrders = orders.filter(order => (order.order_status || order.status) === 'delivered').length;
  const paymentFailedOrders = orders.filter(order => (order.order_status || order.status) === 'payment_failed').length;
  const cancelledOrders = orders.filter(order => (order.order_status || order.status) === 'cancelled').length;

  // Filter and pagination logic
  const filteredOrders = orders.filter(order => {
    // Kiểm tra order có tồn tại không
    if (!order) return false;
    
    const matchesSearch = 
      (order._id && order._id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.receiver && order.receiver.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.address && order.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'All' || (order.order_status || order.status) === selectedStatus;
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
          {/* <div className="w-10 h-10 bg-[#06AEF4] bg-opacity-10 rounded-lg flex items-center justify-center">
            <FaShoppingCart className="w-4 h-4 text-[#06AEF4]" />
          </div> */}
          <div>
            <div className="font-semibold text-gray-900">{order._id}</div>
            <div className="text-sm text-gray-500">
              {order.created_at ? formatDateShort(order.created_at) : (order.create_at ? formatDateShort(order.create_at) : 'N/A')}
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
            <div className="font-medium text-gray-900">{order.user_id?.email || order.receiver || 'Không có tên'}</div>
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
          <div className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</div>
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
        const statusInfo = getStatusInfo(order.order_status || order.status);
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
      render: (order) => {
        const isCompleted = (order.order_status || order.status) === 'delivered';
        return (
          <AdminActionDropdown
            actions={[
              {
                label: 'Xem chi tiết',
                icon: FaEye,
                onClick: () => {
                  console.log('Xem chi tiết:', order._id);
                  setExpandedOrderId(expandedOrderId === order._id ? null : order._id);
                }
              },
              {
                label: 'Sửa trạng thái',
                icon: FaEdit,
                disabled: isCompleted,
                onClick: () => {
                  if (!isCompleted) {
                    setCurrentEditOrder(order);
                    setEditStatus(order.order_status || order.status);
                    setShowEditModal(true);
                  }
                }
              },
              {
                label: 'Xóa đơn hàng',
                icon: FaTrash,
                variant: 'danger',
                disabled: isCompleted,
                onClick: () => {
                  if (!isCompleted) {
                    handleDeleteOrder(order._id);
                  }
                }
              }
            ]}
            onActionClick={(action) => action.onClick()}
          />
        );
      }
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
  const renderExpandedRow = (order) => {
    return (
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 border-t border-gray-200">
        {/* Danh sách sản phẩm */}
        <div className="flex-1 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Sản phẩm</th>
                <th className="px-4 py-2 text-right">Giá</th>
                <th className="px-4 py-2 text-right">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-b-0">
                    <td className="px-4 py-2">{item.product_id?.name || 'Sản phẩm không xác định'}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.cur_price)}</td>
                    <td className="px-4 py-2 text-right">x{item.qty}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="text-center text-gray-500 py-4">Không có sản phẩm</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Tổng hợp đơn hàng */}
        <div className="w-full md:w-96 flex-shrink-0 bg-white rounded-lg shadow p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span>Tiền hàng</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Phí giao hàng, phụ phí</span>
            <span>Miễn phí</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Tiền được giảm</span>
            <span className="text-red-500">- {formatCurrency(order.discount || 0)}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mt-2">
            <span>Tổng đơn</span>
            <span>{formatCurrency(order.total_amount - (order.discount || 0))}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Đã thanh toán</span>
            <span className="font-bold text-green-600">{formatCurrency(order.total_amount - (order.discount || 0))}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Thanh toán</span>
            <span>{order.payment_method === 'cod' ? 'Tiền mặt' : order.payment_method || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Trạng thái</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
              {getStatusInfo(order.order_status || order.status).label}
            </span>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                (order.order_status || order.status) === 'delivered'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={(order.order_status || order.status) === 'delivered'}
              onClick={() => {
                if ((order.order_status || order.status) !== 'delivered') {
                  setCurrentEditOrder(order);
                  setEditStatus(order.order_status || order.status);
                  setShowEditModal(true);
                }
              }}
            >
              Chỉnh trạng thái
            </button>
            <button 
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                (order.order_status || order.status) === 'delivered'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
              disabled={(order.order_status || order.status) === 'delivered'}
              onClick={() => {
                if ((order.order_status || order.status) !== 'delivered') {
                  handleDeleteOrder(order._id);
                }
              }}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {/* Toast Message */}
      {message && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-medium flex items-center gap-2 ${messageType === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <span>{message}</span>
<button className="ml-2 text-lg" onClick={() => setMessage("")}>×</button>
        </div>
      )}
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

         {/* Filter Tabs */}
         <div className="flex flex-wrap gap-2">
           <button
             onClick={() => setSelectedStatus('All')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'All'
                 ? 'bg-blue-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Tất cả ({allOrders})
           </button>
           <button
             onClick={() => setSelectedStatus('pending')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'pending'
                 ? 'bg-yellow-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Chờ xử lý ({pendingOrders})
           </button>
           <button
             onClick={() => setSelectedStatus('processing')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'processing'
                 ? 'bg-blue-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Đang xử lý ({processingOrders})
           </button>
           
           <button
             onClick={() => setSelectedStatus('delivered')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'delivered'
                 ? 'bg-green-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Hoàn thành ({deliveredOrders})
           </button>
           <button
             onClick={() => setSelectedStatus('payment_failed')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'payment_failed'
                 ? 'bg-red-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Thanh toán thất bại ({paymentFailedOrders})
           </button>
           <button
             onClick={() => setSelectedStatus('cancelled')}
             className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
               selectedStatus === 'cancelled'
                 ? 'bg-gray-500 text-white shadow-lg'
                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
             }`}
           >
             Đã hủy ({cancelledOrders})
           </button>
         </div>

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
              <div className="text-sm text-gray-600 mt-1">
                Trạng thái hiện tại: 
                <span className="font-medium text-gray-900 ml-1">
                  {currentEditOrder ? getStatusInfo(currentEditOrder.order_status || currentEditOrder.status).label : ''}
                </span>
              </div>
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