import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaEyeSlash, FaStar, FaUser, FaBox } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/reviews`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const result = await response.json();
        setReviews(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách đánh giá: ' + error.message);
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa đánh giá này?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }

      setReviews(reviews.filter(r => r._id !== reviewId));
    } catch (error) {
      alert('Lỗi khi xóa đánh giá: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle review status
  const handleToggleStatus = async (reviewId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiện';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} đánh giá này?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/status`, {
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
        throw new Error(errorData.message || 'Failed to update review status');
      }

      setReviews(reviews.map(r => 
        r._id === reviewId ? { ...r, status: newStatus } : r
      ));
    } catch (error) {
      alert(`Lỗi khi ${actionText} đánh giá: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.comment && review.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.user_id?.name && review.user_id.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'All' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + pageSize);

  // Get review status info
  const getReviewStatusInfo = (status) => {
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

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (review) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold">
            {review.user_id?.name ? review.user_id.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{review.user_id?.name || 'Người dùng ẩn danh'}</div>
            <div className="text-sm text-gray-500">{review.user_id?.email || 'Không có email'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (review) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
            {review.product_id?.images?.[0] ? (
              <img
                src={review.product_id.images[0]}
                alt={review.product_id.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaBox className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="font-medium text-gray-900">{review.product_id?.name || 'Sản phẩm không tồn tại'}</div>
        </div>
      )
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (review) => renderStars(review.rating)
    },
    {
      title: 'Nội dung',
      key: 'comment',
      render: (review) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-600 line-clamp-2">{review.comment || 'Không có bình luận'}</div>
          {review.comment && review.comment.length > 100 && (
            <button
              className="text-[#06AEF4] text-sm hover:underline mt-1"
              onClick={() => {
                setCurrentReview(review);
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
      render: (review) => (
        <div className="text-sm text-gray-600">
          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'N/A'}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (review) => {
        const statusInfo = getReviewStatusInfo(review.status);
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
      render: (review) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => {
                setCurrentReview(review);
                setShowViewModal(true);
              }
            },
            {
              label: review.status === 'active' ? 'Ẩn đánh giá' : 'Hiện đánh giá',
              icon: review.status === 'active' ? FaEyeSlash : FaEye,
              variant: review.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(review._id, review.status)
            },
            {
              label: 'Xóa đánh giá',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteReview(review._id)
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
             statusFilter === 'active' ? 'Đang hiển thị' : 'Đã ẩn',
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Đang hiển thị' },
        { value: 'inactive', label: 'Đã ẩn' }
      ]
    },
    {
      key: 'rating',
      label: ratingFilter === 'All' ? 'Tất cả đánh giá' : `${ratingFilter} sao`,
      value: ratingFilter,
      options: [
        { value: 'All', label: 'Tất cả đánh giá' },
        { value: '5', label: '5 sao' },
        { value: '4', label: '4 sao' },
        { value: '3', label: '3 sao' },
        { value: '2', label: '2 sao' },
        { value: '1', label: '1 sao' }
      ]
    }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    } else if (key === 'rating') {
      setRatingFilter(value);
    }
    setCurrentPage(1);
  };

  // Calculate statistics
  const activeReviews = reviews.filter(r => r.status === 'active').length;
  const inactiveReviews = reviews.filter(r => r.status === 'inactive').length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const todayReviews = reviews.filter(r => 
    r.createdAt && new Date(r.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h1>
          <p className="text-gray-600 mt-1">Quản lý đánh giá sản phẩm từ khách hàng</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalReviews}</div>
            <div className="text-sm text-gray-600">Tổng đánh giá</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeReviews}</div>
            <div className="text-sm text-gray-600">Đang hiển thị</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="text-2xl font-bold text-yellow-600">{averageRating}</div>
              <FaStar className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-sm text-gray-600">Đánh giá trung bình</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">{todayReviews}</div>
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

        {/* Reviews Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedReviews}
            loading={loading}
            error={error}
            emptyMessage="Không có đánh giá nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedReviews.map(review => review._id) : []);
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
            totalItems={totalReviews}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* View Review Modal */}
        <AdminModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setCurrentReview(null);
          }}
          title="Chi tiết đánh giá"
          size="lg"
        >
          {currentReview && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {currentReview.user_id?.name ? currentReview.user_id.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{currentReview.user_id?.name || 'Người dùng ẩn danh'}</div>
                  <div className="text-sm text-gray-500">{currentReview.user_id?.email || 'Không có email'}</div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {currentReview.product_id?.images?.[0] ? (
                    <img
                      src={currentReview.product_id.images[0]}
                      alt={currentReview.product_id.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{currentReview.product_id?.name || 'Sản phẩm không tồn tại'}</div>
                  <div className="text-sm text-gray-500">
                    {currentReview.createdAt ? new Date(currentReview.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Đánh giá</div>
                {renderStars(currentReview.rating)}
              </div>

              {/* Review Content */}
              {currentReview.comment && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Nội dung đánh giá</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{currentReview.comment}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <ModalButton
                  variant="secondary"
                  onClick={() => {
                    setShowViewModal(false);
                    setCurrentReview(null);
                  }}
                >
                  Đóng
                </ModalButton>
                <ModalButton
                  variant={currentReview.status === 'active' ? 'warning' : 'success'}
                  onClick={() => {
                    handleToggleStatus(currentReview._id, currentReview.status);
                    setShowViewModal(false);
                    setCurrentReview(null);
                  }}
                >
                  {currentReview.status === 'active' ? 'Ẩn đánh giá' : 'Hiện đánh giá'}
                </ModalButton>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminReview;
