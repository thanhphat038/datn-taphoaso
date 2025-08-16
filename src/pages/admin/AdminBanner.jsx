import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaEye, FaEyeSlash, FaImage, FaPlus, FaEdit, FaCalendarAlt, FaLink } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminModal, { ModalButton } from '../../components/admin/AdminModal';
import { Link } from 'react-router-dom';
import { getAllBanners, deleteBanner, updateBannerStatus } from '../../service/Admin.Service.jsx';

const AdminBanner = () => {
  const [banners, setBanners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);

  // Convert image URL to base64 to avoid CORS issues
  const getImageUrl = useCallback((url) => {
    if (!url) return '';
    
    // If it's already a base64 or data URL, return as is
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    
    // If it's a localhost URL, convert to base64 via API
    if (url.includes('localhost:3000') && url.includes('/uploads/')) {
      const filename = url.split('/uploads/')[1];
      if (filename) {
        return `http://localhost:3000/api/upload/base64/${encodeURIComponent(filename)}`;
      }
    }
    
    return url;
  }, []);

  // Function to fetch base64 image
  const fetchBase64Image = useCallback(async (url) => {
    try {
      if (url.includes('/api/upload/base64/')) {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
      return url;
    } catch (error) {
      console.error('Error fetching base64 image:', error);
      return url;
    }
  }, []);

  // Image Component with base64 support
  const ImageComponent = useCallback(({ src, alt, className, onError }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const loadImage = async () => {
        if (!src) {
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          setHasError(false);

          // If it's a base64 API URL, fetch the base64 data
          if (src.includes('/api/upload/base64/')) {
            const base64Data = await fetchBase64Image(src);
            setImageSrc(base64Data);
          } else {
            setImageSrc(src);
          }
        } catch (error) {
          console.error('Error loading image:', error);
          setHasError(true);
          if (onError) onError(error);
        } finally {
          setIsLoading(false);
        }
      };

      loadImage();
    }, [src, fetchBase64Image, onError]);

    if (isLoading) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
            <p className="text-xs">Đang tải...</p>
          </div>
        </div>
      );
    }

    if (hasError || !imageSrc) {
      return (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <FaImage className="w-4 h-4 mx-auto" />
          </div>
        </div>
      );
    }

    return (
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          setHasError(true);
          if (onError) onError(e);
        }}
      />
    );
  }, [fetchBase64Image]);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      // Sử dụng getAllBanners - không cần token
      const result = await getAllBanners();
      let bannersArr = [];
      if (Array.isArray(result.data)) {
        bannersArr = result.data;
      } else if (Array.isArray(result.data?.data)) {
        bannersArr = result.data.data;
      }
      
      setBanners(bannersArr.map(banner => ({
        ...banner,
        status: banner.is_active ? 'active' : 'inactive'
      })));
    } catch (error) {
      setError('Không thể tải danh sách banner: ' + error.message);
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle delete banner
  const handleDeleteBanner = async (bannerId) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa banner này?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await deleteBanner(bannerId);
      setBanners(banners.filter(b => b._id !== bannerId));
      setMessage('Xóa banner thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('Lỗi khi xóa banner: ' + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle banner status
  const handleToggleStatus = async (bannerId, currentStatus) => {
    const actionText = currentStatus === 'active' ? 'ẩn' : 'hiện';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} banner này?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      await updateBannerStatus(bannerId);
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      setBanners(banners.map(b => 
        b._id === bannerId ? { ...b, status: newStatus } : b
      ));
      setMessage(`Đã ${actionText} banner thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${actionText} banner: ` + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      (banner.title && banner.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (banner.description && banner.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || banner.status === statusFilter;
    const matchesType = typeFilter === 'All' || banner.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBanners = filteredBanners.length;
  const totalPages = Math.ceil(totalBanners / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBanners = filteredBanners.slice(startIndex, startIndex + pageSize);

  // Get banner status info
  const getBannerStatusInfo = (status) => {
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

  // Get banner type info
  const getBannerTypeInfo = (type) => {
    const typeMap = {
      'main': { label: 'Chính', color: 'bg-blue-100 text-blue-800' },
      'sidebar': { label: 'Sidebar', color: 'bg-purple-100 text-purple-800' },
      'popup': { label: 'Popup', color: 'bg-orange-100 text-orange-800' },
      'slider': { label: 'Slider', color: 'bg-indigo-100 text-indigo-800' }
    };
    return typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  // Table columns
  const columns = [
    {
      title: 'Hình ảnh',
      key: 'image',
      render: (banner) => (
        <div className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200">
          {banner.image_url ? (
            <ImageComponent
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <FaImage className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (banner) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 line-clamp-1">{banner.title || 'Không có tiêu đề'}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{banner.description || 'Không có mô tả'}</div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{banner.created_at ? new Date(banner.created_at).toLocaleDateString('vi-VN') : 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Loại',
      key: 'type',
      render: (banner) => {
        const typeInfo = getBannerTypeInfo(banner.type);
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        );
      }
    },
    {
      title: 'Thứ tự',
      key: 'order',
      render: (banner) => (
        <span className="font-medium text-gray-900">{banner.display_order || 0}</span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (banner) => {
        const statusInfo = getBannerStatusInfo(banner.status);
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
      render: (banner) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => {
                setCurrentBanner(banner);
                setShowViewModal(true);
              }
            },
            {
              label: banner.status === 'active' ? 'Ẩn banner' : 'Hiện banner',
              icon: banner.status === 'active' ? FaEyeSlash : FaEye,
              variant: banner.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(banner._id, banner.status)
            },
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => {
                window.location.href = `/admin/banner/edit/${banner._id}`;
              }
            },
            {
              label: 'Xóa banner',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteBanner(banner._id)
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
      key: 'type',
      label: typeFilter === 'All' ? 'Tất cả loại' : typeFilter,
      value: typeFilter,
      options: [
        { value: 'All', label: 'Tất cả loại' },
        { value: 'main', label: 'Chính' },
        { value: 'sidebar', label: 'Sidebar' },
        { value: 'popup', label: 'Popup' },
        { value: 'slider', label: 'Slider' }
      ]
    }
  ];

  const handleFilterChange = (key, value) => {
    if (key === 'status') {
      setStatusFilter(value);
    } else if (key === 'type') {
      setTypeFilter(value);
    }
    setCurrentPage(1);
  };

  // Calculate statistics
  const activeBanners = banners.filter(b => b.status === 'active').length;
  const inactiveBanners = banners.filter(b => b.status === 'inactive').length;
  const todayBanners = banners.filter(b => 
    b.created_at && new Date(b.created_at).toDateString() === new Date().toDateString()
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Banner</h1>
          <Link
            to="/admin/banner/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Thêm Banner
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{banners.length}</div>
            <div className="text-sm text-gray-600">Tổng banner</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeBanners}</div>
            <div className="text-sm text-gray-600">Đang hiển thị</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-red-600">{inactiveBanners}</div>
            <div className="text-sm text-gray-600">Đã ẩn</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">{todayBanners}</div>
            <div className="text-sm text-gray-600">Hôm nay</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Banners Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedBanners}
            loading={loading}
            error={error}
            emptyMessage="Không có banner nào"
          />
          
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalBanners}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </AdminCard>

        {/* View Banner Modal */}
        <AdminModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setCurrentBanner(null);
          }}
          title="Chi tiết banner"
          size="lg"
        >
          {currentBanner && (
            <div className="space-y-6">
              {/* Banner Image */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {currentBanner.image_url ? (
                  <ImageComponent
                    src={currentBanner.image_url}
                    alt={currentBanner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Tiêu đề</div>
                  <div className="font-semibold text-gray-900">{currentBanner.title || 'Không có tiêu đề'}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Mô tả</div>
                  <div className="text-gray-900">{currentBanner.description || 'Không có mô tả'}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Loại banner</div>
                    <div className="font-medium text-gray-900">{getBannerTypeInfo(currentBanner.type).label}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Thứ tự hiển thị</div>
                    <div className="font-medium text-gray-900">{currentBanner.display_order || 0}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Link chuyển hướng</div>
                  <div className="text-gray-900">
                    {currentBanner.link_url ? (
                      <a href={currentBanner.link_url} target="_blank" rel="noopener noreferrer" className="text-[#06AEF4] hover:underline flex items-center gap-1">
                        <FaLink className="w-3 h-3" />
                        {currentBanner.link_url}
                      </a>
                    ) : 'Không có link'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${
                    currentBanner.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {currentBanner.status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Ngày tạo</div>
                  <div className="text-gray-900">
                    {currentBanner.created_at ? new Date(currentBanner.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <ModalButton
                  variant="secondary"
                  onClick={() => {
                    setShowViewModal(false);
                    setCurrentBanner(null);
                  }}
                >
                  Đóng
                </ModalButton>
                <ModalButton
                  variant={currentBanner.status === 'active' ? 'warning' : 'success'}
                  onClick={() => {
                    handleToggleStatus(currentBanner._id, currentBanner.status);
                    setShowViewModal(false);
                    setCurrentBanner(null);
                  }}
                >
                  {currentBanner.status === 'active' ? 'Ẩn banner' : 'Hiện banner'}
                </ModalButton>
              </div>
            </div>
          )}
        </AdminModal>
      </div>
    </AdminLayout>
  );
};

export default AdminBanner;
