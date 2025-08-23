import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaFileAlt, FaEye as FaEyeIcon, FaPencilAlt, FaTrashAlt, FaListAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';
import AdminSearchFilter from '../../components/admin/AdminSearchFilter';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Cookies from 'js-cookie';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('auth_token');
        if (!token) {
          console.error('No authentication token found');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/blogs?limit=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired');
            navigate('/login');
            return;
          }
          throw new Error("Failed to fetch blogs");
        }
        const result = await response.json();
        setBlogs(result.data || []);
      } catch (error) {
        setError("Không thể tải danh sách blog: " + error.message);
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [navigate]);

  // Calculate statistics
  const allBlogs = blogs.length;
  const publishedBlogs = blogs.filter(blog => blog.status === 'publish').length;
  const draftBlogs = blogs.filter(blog => blog.status === 'draft').length;

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Apply sorting on filtered result (like AdminProduct.jsx)
  const sortedBlogs = filteredBlogs.sort((a, b) => {
    const dateA = new Date(a.create_at || 0);
    const dateB = new Date(b.create_at || 0);
    return dateB - dateA; // Mặc định sắp xếp mới nhất
  });

  // Pagination calculations
  const totalBlogs = sortedBlogs.length;
  const totalPages = Math.ceil(totalBlogs / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBlogs = sortedBlogs.slice(
    startIndex,
    startIndex + pageSize
  );

  // Handle edit blog
  const handleEditBlog = (blogId) => {
    navigate(`/admin/addblog/${blogId}`);
  };

  // Handle view blog detail
  const handleViewBlogDetail = (blogId) => {
    navigate(`/admin/blog/detail/${blogId}`);
  };

  // Handle delete blog
  const handleDeleteBlog = (blogId, blogTitle) => {
    setPendingDelete({ blogId, blogTitle });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No authentication token found for deletion');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${pendingDelete.blogId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Unauthorized for deletion: Token may be invalid or expired');
          navigate('/login');
          return;
        }
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter(b => b._id !== pendingDelete.blogId));
      setMessage("Xóa blog thành công!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Lỗi khi xóa blog: " + error.message);
      setMessageType("error");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setLoading(false);
      setPendingDelete(null);
    }
  };

  // Filter options for search component
  const filterOptions = [
    {
      key: 'status',
      label: statusFilter === 'All' ? 'Tất cả trạng thái' : (statusFilter === 'publish' ? 'Đã xuất bản' : 'Nháp'),
      value: statusFilter,
      options: [
        { value: 'All', label: 'Tất cả trạng thái' },
        { value: 'publish', label: 'Đã xuất bản' },
        { value: 'draft', label: 'Nháp' }
      ]
    }
  ];

  const handleFilterChange = (key, value, label) => {
    if (key === 'status') {
      setStatusFilter(value);
      setCurrentPage(1);
    }
  };

  // Reset page when search query changes (like AdminProduct.jsx)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Table columns
  const columns = [
    {
      title: "Tiêu đề",
      key: "title",
      render: (blog) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
            <div className="w-full h-full flex items-center justify-center" style={{ display: blog.image ? 'none' : 'flex' }}>
              <FaFileAlt className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
              {blog.title}
            </div>
            <div className="text-sm text-gray-500 truncate">{blog.slug}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(blog.create_at).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      key: "author",
      render: (blog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {blog.author?.name?.charAt(0) || "?"}
            </span>
          </div>
          <div className="text-sm text-gray-600 truncate">
            {blog.author?.name || "Không rõ"}
          </div>
        </div>
      ),
    },
    {
      title: "Lượt xem",
      key: "views",
      render: (blog) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaEyeIcon className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{blog.views || 0}</div>
            <div className="text-xs text-gray-500">lượt xem</div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (blog) => (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${
            blog.status === 'publish' 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              blog.status === 'publish' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></span>
            {blog.status === 'publish' ? 'Đã xuất bản' : 'Nháp'}
          </span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (blog) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewBlogDetail(blog._id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditBlog(blog._id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteBlog(blog._id, blog.title)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Quản lý blog
            </h1>
            <p className="text-gray-600 mt-1">Quản lý danh sách bài viết blog</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600">Tổng bài viết</div>
              <div className="text-2xl font-bold text-[#06AEF4]">{totalBlogs}</div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-600">Đã xuất bản</div>
              <div className="text-2xl font-bold text-green-600">{publishedBlogs}</div>
            </div>
            <NavLink
              to="/admin/blogcategory"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaListAlt className="w-5 h-5" />
              Quản lý danh mục
            </NavLink>
            <NavLink
              to="/admin/addblog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaPlus className="w-5 h-5" />
              Thêm blog
            </NavLink>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard>
            <div className="flex items-center justify-between p-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Tổng bài viết</div>
                <div className="text-3xl font-bold text-gray-900">{allBlogs}</div>
                <div className="text-xs text-gray-500 mt-1">Tất cả bài viết</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                <FaFileAlt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </AdminCard>
          
          <AdminCard>
            <div className="flex items-center justify-between p-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Đã xuất bản</div>
                <div className="text-3xl font-bold text-green-600">{publishedBlogs}</div>
                <div className="text-xs text-gray-500 mt-1">Bài viết công khai</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors">
                <FaEye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </AdminCard>
          
          <AdminCard>
            <div className="flex items-center justify-between p-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Nháp</div>
                <div className="text-3xl font-bold text-yellow-600">{draftBlogs}</div>
                <div className="text-xs text-gray-500 mt-1">Bài viết chưa xuất bản</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center hover:bg-yellow-200 transition-colors">
                <FaPencilAlt className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Search and Filters */}
        <AdminCard>
          <AdminSearchFilter
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Tìm kiếm theo tiêu đề, nội dung hoặc slug..."
            filters={filterOptions}
            onFilterChange={handleFilterChange}
          />
        </AdminCard>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setStatusFilter('All')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'All'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFileAlt className="w-4 h-4" />
            Tất cả ({allBlogs})
          </button>
          <button
            onClick={() => setStatusFilter('publish')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'publish'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaEye className="w-4 h-4" />
            Đã xuất bản ({publishedBlogs})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              statusFilter === 'draft'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaPencilAlt className="w-4 h-4" />
            Nháp ({draftBlogs})
          </button>
        </div>

        {/* Blogs Table */}
        <AdminCard noPadding>
          <AdminTable
            columns={columns}
            data={paginatedBlogs}
            loading={loading}
            error={error}
            emptyMessage="Không có blog nào"
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={pendingDelete ? `Bạn có chắc chắn muốn xóa blog "${pendingDelete.blogTitle}"?` : ''}
        confirmText="Xóa blog"
        cancelText="Hủy bỏ"
        type="danger"
      />
    </AdminLayout>
  );
};

export default AdminBlogPage;
