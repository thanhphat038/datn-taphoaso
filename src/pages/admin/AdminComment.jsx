import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaEyeSlash, FaComments, FaUser, FaBox } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllComments, deleteComment, updateCommentStatus, getUserById } from '../../service/Admin.Service.jsx';


const AdminComment = () => {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  // Toast/Message states
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const result = await getAllComments();
      let commentsArr = [];
      if (Array.isArray(result.data)) {
        commentsArr = result.data;
      } else if (Array.isArray(result.data?.data)) {
        commentsArr = result.data.data;
      }
      // Map lại dữ liệu cho đúng định dạng component mong muốn
      // Nếu user_id hoặc product_id là id, lấy chi tiết
      const mappedComments = await Promise.all(commentsArr.map(async c => {
        let user = { name: 'Ẩn danh', email: '' };
        let product = { name: 'Không rõ', images: [] };
        try {
          if (c.user_id && typeof c.user_id === 'string') {
            const userRes = await getUserById(c.user_id);
            if (userRes?.data?.data) {
              user = userRes.data.data;
            } else if (userRes?.data) {
              user = userRes.data;
            }
          } else if (typeof c.user_id === 'object' && c.user_id !== null) {
            user = c.user_id;
          }
        } catch (e) { /* giữ mặc định */ }
        try {
          if (c.product_id && typeof c.product_id === 'string') {
            const productRes = await getProductById(c.product_id);
            if (productRes?.data?.data) {
              product = productRes.data.data;
            } else if (productRes?.data) {
              product = productRes.data;
            }
          } else if (typeof c.product_id === 'object' && c.product_id !== null) {
            product = c.product_id;
          }
        } catch (e) { /* giữ mặc định */ }
        return {
          _id: c._id,
          content: c.comment || c.content || '',
          createdAt: c.create_at || c.createdAt || '',
          status: c.status || 'active',
          user_id: user,
          product_id: product,
        };
      }));
      setComments(mappedComments);
      console.log('Fetched comments:', mappedComments); // Log dữ liệu ra console
    } catch (error) {
      setError('Không thể tải danh sách bình luận: ' + error.message);
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa bình luận này?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      setMessage('Xóa bình luận thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa bình luận: ' + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle comment status
  const handleToggleStatus = async (commentId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiện';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} bình luận này?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await updateCommentStatus(commentId, newStatus);
      setComments(comments.map(c => 
        c._id === commentId ? { ...c, status: newStatus } : c
      ));
      setMessage(`Đã ${actionText} bình luận thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} bình luận: ` + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Filter comments
  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      (comment.content && comment.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (comment.user_id?.name && comment.user_id.name.toLowerCase().includes(searchQuery.toLowerCase()));
    // Status filtering disabled
    // const matchesStatus = statusFilter === 'All' || comment.status === statusFilter;
    // return matchesSearch && matchesStatus;
    return matchesSearch;
  });

  const totalComments = filteredComments.length;
  const totalPages = Math.ceil(totalComments / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedComments = filteredComments.slice(startIndex, startIndex + pageSize);

  // Get comment status info
  const getCommentStatusInfo = (status) => {
    if (status === 'active') {
      return {
        label: 'Hiển thị',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Đã ẩn',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-500'
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (comment) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold">
            {comment.user_id?.username ? comment.user_id.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{comment.user_id?.username || 'Người dùng ẩn danh'}</div>
            <div className="text-sm text-gray-500">{comment.user_id?.email || 'Không có email'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (comment) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
            {comment.product_id?.images?.[0] ? (
              <img
                src={comment.product_id.images[0]}
                alt={comment.product_id.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaBox className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="font-medium text-gray-900">{comment.product_id?.name || 'Sản phẩm không tồn tại'}</div>
        </div>
      )
    },
    {
      title: 'Nội dung',
      key: 'content',
      render: (comment) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-600 line-clamp-2">{comment.content}</div>
          {comment.content.length > 100 && (
            <button
              className="text-[#06AEF4] text-sm hover:underline mt-1"
              onClick={() => {
                setCurrentComment(comment);
                setShowViewModal(true);
              }}
            >
              Xem thêm
            </button>
          )}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (comment) => (
        <div className="text-sm text-gray-600">
          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A'}
        </div>
      )
    },
    // {
    //   title: 'Trạng thái',
    //   key: 'status',
    //   render: (comment) => {
    //     const statusInfo = getCommentStatusInfo(comment.status);
    //     return (
    //       <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${statusInfo.color}`}>
    //         <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
    //         {statusInfo.label}
    //       </span>
    //     );
    //   }
    // },
    {
      title: '',
      key: 'actions',
      render: (comment) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => {
                setCurrentComment(comment);
                setShowViewModal(true);
              }
            },
            // Status toggle disabled
            // {
            //   label: comment.status === 'active' ? 'Ẩn bình luận' : 'Hiện bình luận',
            //   icon: comment.status === 'active' ? FaEyeSlash : FaEye,
            //   variant: comment.status === 'active' ? 'warning' : 'success',
            //   onClick: () => handleToggleStatus(comment._id, comment.status)
            // },
            {
              label: 'Xóa bình luận',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteComment(comment._id)
            }
          ]}
          onActionClick={(action) => action.onClick()}
        />
      )
    }
  ];

  // Filter options
  const filterOptions = [
    // Status filter disabled
    // {
    //   key: 'status',
    //   label: statusFilter === 'All' ? 'Tất cả trạng thái' : 
    //          statusFilter === 'active' ? 'Đang hiển thị' : 'Đã ẩn',
    //   value: statusFilter,
    //   options: [
    //     { value: 'All', label: 'Tất cả trạng thái' },
    //     { value: 'active', label: 'Đang hiển thị' },
    //     { value: 'inactive', label: 'Đã ẩn' }
    //   ]
    // }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  // Calculate statistics
  // const activeComments = comments.filter(c => c.status === 'active').length;
  // const inactiveComments = comments.filter(c => c.status === 'inactive').length;
  const todayComments = comments.filter(c => 
    c.createdAt && new Date(c.createdAt).toDateString() === new Date().toDateString()
  ).length;

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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
            <p className="text-gray-600 mt-1">Quản lý bình luận của khách hàng</p>
          </div>
          <button
            className="px-4 py-2 bg-[#06AEF4] text-white rounded hover:bg-[#0590d8] transition"
            onClick={fetchComments}
            disabled={loading}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalComments}</div>
            <div className="text-sm text-gray-600">Tổng bình luận</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">{todayComments}</div>
            <div className="text-sm text-gray-600">Hôm nay</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo nội dung hoặc tên người dùng..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Comments Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedComments}
            loading={loading}
            error={error}
            emptyMessage="Không có bình luận nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedComments.map(comment => comment._id) : []);
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
            totalItems={totalComments}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* View Comment Modal */}
        <AdminModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setCurrentComment(null);
          }}
          title="Chi tiết bình luận"
          size="lg"
        >
          {currentComment && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {currentComment.user_id?.username ? currentComment.user_id.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{currentComment.user_id?.username || 'Người dùng ẩn danh'}</div>
                  <div className="text-sm text-gray-500">{currentComment.user_id?.email || 'Không có email'}</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {currentComment.product_id?.images?.[0] ? (
                    <img
                      src={currentComment.product_id.images[0]}
                      alt={currentComment.product_id.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{currentComment.product_id?.name || 'Sản phẩm không tồn tại'}</div>
                  <div className="text-sm text-gray-500">
                    {currentComment.createdAt ? new Date(currentComment.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Comment Content */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">{currentComment.content}</div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <ModalButton
                  variant="secondary"
                  onClick={() => {
                    setShowViewModal(false);
                    setCurrentComment(null);
                  }}
                >
                  Đóng
                </ModalButton>
                <ModalButton
                  variant={currentComment.status === 'active' ? 'warning' : 'success'}
                  onClick={() => {
                    handleToggleStatus(currentComment._id, currentComment.status);
                    setShowViewModal(false);
                    setCurrentComment(null);
                  }}
                >
                  {currentComment.status === 'active' ? 'Ẩn bình luận' : 'Hiện bình luận'}
                </ModalButton>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminComment;
