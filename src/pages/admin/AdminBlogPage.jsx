import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBlog, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs`);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const result = await response.json();
        setBlogs(result.data || []);
      } catch (error) {
        setError('Không thể tải danh sách blog: ' + error.message);
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handle delete blog
  const handleDeleteBlog = async (blogId, blogTitle) => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa bài viết "${blogTitle}"?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      alert('Lỗi khi xóa bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle blog status
  const handleToggleStatus = async (blogId, currentStatus, blogTitle) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const actionText = currentStatus === 'published' ? 'ẩn' : 'xuất bản';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} bài viết "${blogTitle}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/status`, {
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
        throw new Error(errorData.message || 'Failed to update blog status');
      }

      setBlogs(blogs.map(b => 
        b._id === blogId ? { ...b, status: newStatus } : b
      ));
    } catch (error) {
      alert(`Lỗi khi ${actionText} bài viết: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + pageSize);

  // Get blog status info
  const getBlogStatusInfo = (status) => {
    if (status === 'published') {
      return {
        label: 'Đã xuất bản',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500'
      };
    } else {
      return {
        label: 'Bản nháp',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-500'
      };
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Bài viết',
      key: 'blog',
      render: (blog) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: blog.image ? 'none' : 'flex' }}>
              <FaImage className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate">{blog.title}</div>
            <div className="text-sm text-gray-500 truncate">{blog.excerpt || 'Không có mô tả ngắn'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Tác giả',
      key: 'author',
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {blog.author || 'Admin'}
        </div>
      )
    },
    {
      title: 'Danh mục',
      key: 'category',
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {blog.category || 'Chưa phân loại'}
        </div>
      )
    },
    {
      title: 'Lượt xem',
      key: 'views',
      render: (blog) => (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{blog.views || 0}</div>
          <div className="text-xs text-gray-500">lượt xem</div>
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('vi-VN', {
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
      render: (blog) => {
        const statusInfo = getBlogStatusInfo(blog.status);
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
      render: (blog) => (
        <AdminActionDropdown
          actions={[
            {
              label: 'Xem chi tiết',
              icon: FaEye,
              onClick: () => window.open(`/admin/blog/detail/${blog._id}`, '_blank')
            },
            {
              label: 'Chỉnh sửa',
              icon: FaEdit,
              onClick: () => window.location.href = `/admin/addblog/${blog._id}`
            },
            {
              label: blog.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản',
              icon: blog.status === 'published' ? FaEyeSlash : FaEye,
              variant: blog.status === 'published' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(blog._id, blog.status, blog.title)
            },
            {
              label: 'Xóa bài viết',
              icon: FaTrash,
              variant: 'danger',
              onClick: () => handleDeleteBlog(blog._id, blog.title)
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
             statusFilter === 'published' ? 'Đã xuất bản' : 'Bản nháp',
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'published', label: 'Đã xuất bản' },
        { value: 'draft', label: 'Bản nháp' }
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
  const publishedBlogs = blogs.filter(b => b.status === 'published').length;
  const draftBlogs = blogs.filter(b => b.status === 'draft').length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const todayBlogs = blogs.filter(b => 
    b.createdAt && new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý blog</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các bài viết blog</p>
          </div>
          <NavLink 
            to="/admin/addblog" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white rounded-xl hover:bg-[#0590d8] transition-colors shadow-sm"
          >
            <FaPlus className="w-4 h-4" />
            Thêm bài viết
          </NavLink>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-[#06AEF4]">{totalBlogs}</div>
            <div className="text-sm text-gray-600">Tổng bài viết</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-green-600">{publishedBlogs}</div>
            <div className="text-sm text-gray-600">Đã xuất bản</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{draftBlogs}</div>
            <div className="text-sm text-gray-600">Bản nháp</div>
          </AdminCard>
          <AdminCard className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalViews}</div>
            <div className="text-sm text-gray-600">Tổng lượt xem</div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tiêu đề bài viết..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Blogs Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedBlogs}
            loading={loading}
            error={error}
            emptyMessage="Không có bài viết nào"
            selectable={true}
            selectedIds={selectedIds}
            onSelectAll={(checked) => {
              setSelectedIds(checked ? paginatedBlogs.map(blog => blog._id) : []);
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
            totalItems={totalBlogs}
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

export default AdminBlogPage;
