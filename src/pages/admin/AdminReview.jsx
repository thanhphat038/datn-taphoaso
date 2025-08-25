import React, { useState, useEffect } from 'react';
import { FaTrash, FaEye, FaEyeSlash, FaStar, FaUser, FaBox } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { getAllReviews, deleteReview } from '../../service/Admin.Service.js';
import { getUserById } from '../../service/Admin.Service.js';
import { getProductById } from '../../service/Admin.Service.js';


const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);


  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const result = await getAllReviews();
      let reviewsArr = [];
      if (Array.isArray(result.data)) {
        reviewsArr = result.data;
      } else if (Array.isArray(result.data?.data)) {
        reviewsArr = result.data.data;
      }
      // Map lại dữ liệu: lấy chi tiết user và sản phẩm nếu chỉ có id
      const mappedReviews = [];
      for (const r of reviewsArr) {
        let user = { username: 'Ẩn danh', email: '' };
        let product = { name: 'Sản phẩm không tồn tại', images: [] };
        let skip = false;
        try {
          if (r.user_id && typeof r.user_id === 'string') {
            const userRes = await getUserById(r.user_id);
            if (userRes?.data?.data) {
              user = userRes.data.data;
            } else if (userRes?.data) {
              user = userRes.data;
            }
          } else if (typeof r.user_id === 'object' && r.user_id !== null) {
            user = r.user_id;
          }
        } catch (e) {
          if (e?.response?.status === 404) skip = true; // Nếu lỗi 404 thì bỏ qua review này
        }
        try {
          if (r.product_id && typeof r.product_id === 'string') {
            const productRes = await getProductById(r.product_id);
            if (productRes?.data?.data) {
              product = productRes.data.data;
            } else if (productRes?.data) {
              product = productRes.data;
            }
          } else if (typeof r.product_id === 'object' && r.product_id !== null) {
            product = r.product_id;
          }
        } catch (e) {
          if (e?.response?.status === 404) skip = true; // Nếu lỗi 404 thì bỏ qua review này
        }
        if (!skip) {
          mappedReviews.push({
            ...r,
            user_id: user,
            product_id: product,
            
          });
        }
      }
      setReviews(mappedReviews);
      console.log('Fetched reviews:', mappedReviews); // Log dữ liệu ra console
    } catch (error) {
      setError('Không thể tải danh sách đánh giá: ' + error.message);
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      await deleteReview(reviewId);

      setReviews(reviews.filter(r => r._id !== reviewId));
      setMessage('Xóa đánh giá thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa đánh giá: ' + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };



  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.user_review && review.user_review.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.user_id?.username && review.user_id.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.user_id?.full_name && review.user_id.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = ratingFilter === 'All' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + pageSize);



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

  // Hàm giới hạn số từ
  function limitWords(str, num) {
    if (!str) return '';
    const words = str.split(' ');
    return words.length > num ? words.slice(0, num).join(' ') + '...' : str;
  }

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (review) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#06AEF4] to-[#0590d8] rounded-full flex items-center justify-center text-white font-semibold">
            {review.user_id?.username ? review.user_id.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{review.user_id?.username || review.user_id?.full_name || 'Người dùng ẩn danh'}</div>
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
          <div className="text-sm text-gray-600 line-clamp-2">{limitWords(review.user_review, 3) || 'Không có bình luận'}</div>
          {review.user_review && review.user_review.length > 100 && (
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
          {review.create_at ? new Date(review.create_at).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',

          }) : 'N/A'}
        </div>
      )
    },
    // {
    //   title: 'Trạng thái',
    //   key: 'status',
    //   render: (review) => {
    //     const statusInfo = getReviewStatusInfo(review.status);
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
    if (key === 'rating') {
      setRatingFilter(value);
    }
    setCurrentPage(1);
  };

  // Calculate statistics
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const todayReviews = reviews.filter(r => 
    r.create_at && new Date(r.create_at).toDateString() === new Date().toDateString()
  ).length;
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;
  const oneStarReviews = reviews.filter(r => r.rating === 1).length;

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quản lý đánh giá
            </h1>
            <p className="text-gray-600 mt-1">Quản lý đánh giá sản phẩm từ khách hàng</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">Tổng đánh giá</div>
              <div className="text-2xl font-bold text-[#06AEF4]">{totalReviews}</div>
            </div>
            <button
              className="px-4 py-2 bg-[#06AEF4] text-white rounded-lg hover:bg-[#0590d8] transition-colors duration-200"
              onClick={fetchReviews}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminCard>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaStar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đánh giá</p>
                <p className="text-2xl font-semibold text-gray-900">{totalReviews}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaStar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-semibold text-gray-900">{averageRating}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaStar className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5 sao</p>
                <p className="text-2xl font-semibold text-gray-900">{fiveStarReviews}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaUser className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-semibold text-gray-900">{todayReviews}</p>
              </div>
            </div>
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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRatingFilter('All')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === 'All'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả ({totalReviews})
          </button>
          <button
            onClick={() => setRatingFilter('5')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === '5'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            5 sao ({fiveStarReviews})
          </button>
          <button
            onClick={() => setRatingFilter('4')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === '4'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            4 sao ({reviews.filter(r => r.rating === 4).length})
          </button>
          <button
            onClick={() => setRatingFilter('3')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === '3'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3 sao ({reviews.filter(r => r.rating === 3).length})
          </button>
          <button
            onClick={() => setRatingFilter('2')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === '2'
                ? 'bg-red-400 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2 sao ({reviews.filter(r => r.rating === 2).length})
          </button>
          <button
            onClick={() => setRatingFilter('1')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              ratingFilter === '1'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1 sao ({oneStarReviews})
          </button>
        </div>

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
                  {currentReview.user_id?.username ? currentReview.user_id.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{currentReview.user_id?.username || currentReview.user_id?.full_name || 'Người dùng ẩn danh'}</div>
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
                    {currentReview.create_at ? new Date(currentReview.create_at).toLocaleDateString('vi-VN', {
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
              {currentReview.user_review && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Nội dung đánh giá</div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">{currentReview.user_review}</div>
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
                   variant="danger"
                   onClick={() => {
                     handleDeleteReview(currentReview._id);
                     setShowViewModal(false);
                     setCurrentReview(null);
                   }}
                 >
                   Xóa đánh giá
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
