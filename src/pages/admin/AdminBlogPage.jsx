import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import AdminTable from '../../components/admin/AdminTable';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminActionDropdown from '../../components/admin/AdminActionDropdown';

const API_BASE_URL = "http://localhost:3000/api";

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs`);
        if (!response.ok) {
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
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + pageSize
  );

  // Handle edit blog
  const handleEditBlog = (blogId) => {
    navigate(`/admin/addblog/${blogId}`);
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa blog "${blogTitle}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      alert("Lỗi khi xóa blog: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Tiêu đề",
      key: "title",
      render: (blog) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            {blog.image ? (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaEye className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{blog.title}</div>
            <div className="text-sm text-gray-500">{blog.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Tác giả",
      key: "author",
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {blog.author?.name || "Không rõ"}
        </div>
      ),
    },
    {
      title: "Lượt xem",
      key: "views",
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {blog.views || 0}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (blog) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          blog.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {blog.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      render: (blog) => (
        <div className="text-sm text-gray-600">
          {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (blog) => (
        <AdminActionDropdown
          actions={[
            {
              label: "Chỉnh sửa",
              icon: "FaEdit",
              onClick: () => handleEditBlog(blog._id),
            },
            {
              label: "Xóa",
              icon: "FaTrash",
              variant: "danger",
              onClick: () => handleDeleteBlog(blog._id, blog.title),
            },
          ]}
          onActionClick={(action) => action.onClick()}
        />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Quản lý blog
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Quản lý danh sách bài viết blog
            </p>
          </div>
          <NavLink
            to="/admin/addblog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="w-5 h-5" />
            Thêm blog
          </NavLink>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm blog..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
              </svg>
            </div>
          </div>
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
    </AdminLayout>
  );
};

export default AdminBlogPage;
