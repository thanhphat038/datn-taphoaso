import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaCalendarAlt, FaUser, FaTag, FaClock } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const result = await response.json();
        setBlog(result.data);
      } catch (error) {
        setError('Không thể tải thông tin bài viết: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Handle delete blog
  const handleDeleteBlog = async () => {
    const confirmMessage = `Bạn có chắc chắn muốn xóa bài viết này?\n\nHành động này không thể hoàn tác!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      navigate('/admin/blog');
    } catch (error) {
      alert('Lỗi khi xóa bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle blog status
  const handleToggleStatus = async () => {
    if (!blog) return;

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    const actionText = blog.status === 'published' ? 'ẩn' : 'xuất bản';
    
    const confirmMessage = `Bạn có chắc chắn muốn ${actionText} bài viết này?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/blogs/${id}/status`, {
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

      setBlog(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      alert(`Lỗi khi ${actionText} bài viết: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-gray-500">Không tìm thấy bài viết</div>
        </div>
      </AdminLayout>
    );
  }

  const statusInfo = getBlogStatusInfo(blog.status);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết bài viết</h1>
            <p className="text-gray-600 mt-1">Xem thông tin chi tiết bài viết</p>
          </div>
          <div className="flex items-center gap-3">
            <ModalButton
              variant={blog.status === 'published' ? 'warning' : 'success'}
              onClick={handleToggleStatus}
              disabled={loading}
            >
              {blog.status === 'published' ? (
                <>
                  <FaEyeSlash className="w-4 h-4" />
                  <span>Chuyển về nháp</span>
                </>
              ) : (
                <>
                  <FaEye className="w-4 h-4" />
                  <span>Xuất bản</span>
                </>
              )}
            </ModalButton>
            <ModalButton
              onClick={() => navigate(`/admin/addblog/${id}`)}
              disabled={loading}
            >
              <FaEdit className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </ModalButton>
            <ModalButton
              variant="danger"
              onClick={handleDeleteBlog}
              disabled={loading}
            >
              <FaTrash className="w-4 h-4" />
              <span>Xóa bài viết</span>
            </ModalButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image */}
            {blog.image && (
              <AdminCard noPadding>
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </AdminCard>
            )}

            {/* Title and Excerpt */}
            <AdminCard>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{blog.title}</h2>
              {blog.excerpt && (
                <p className="text-gray-600 text-lg">{blog.excerpt}</p>
              )}
            </AdminCard>

            {/* Content */}
            <AdminCard>
              <div className="prose max-w-none">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <AdminCard>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600">Trạng thái</div>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                  <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
                  {statusInfo.label}
                </span>
              </div>
            </AdminCard>

            {/* Meta Information */}
            <AdminCard>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Ngày tạo</div>
                    <div className="font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaUser className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Tác giả</div>
                    <div className="font-medium">{blog.author || 'Admin'}</div>
                  </div>
                </div>

                {blog.category && (
                  <div className="flex items-center gap-3">
                    <FaTag className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Danh mục</div>
                      <div className="font-medium">{blog.category}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FaClock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Cập nhật lần cuối</div>
                    <div className="font-medium">
                      {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Statistics */}
            <AdminCard>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#06AEF4]">{blog.views || 0}</div>
                  <div className="text-sm text-gray-600">Lượt xem</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{blog.comments?.length || 0}</div>
                  <div className="text-sm text-gray-600">Bình luận</div>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogDetail;
