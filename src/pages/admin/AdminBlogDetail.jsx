import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaCalendarAlt, FaUser, FaTag, FaClock, FaImage } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import { ModalButton } from '../../components/admin/AdminModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Cookies from 'js-cookie';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminBlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('auth_token');
        if (!token) {
          console.error('No authentication token found');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
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
  }, [id, navigate]);

  // Handle delete blog
  const handleDeleteBlog = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No authentication token found for deletion');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      setMessage('Xóa bài viết thành công!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
      navigate('/admin/blog');
    } catch (error) {
      setMessage('Lỗi khi xóa bài viết: ' + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle blog status
  const handleToggleStatus = () => {
    if (!blog) return;

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    const actionText = blog.status === 'published' ? 'ẩn' : 'xuất bản';
    
    setPendingAction({ newStatus, actionText });
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingAction) return;

    try {
      setLoading(true);
      const token = Cookies.get('auth_token');
      if (!token) {
        console.error('No authentication token found for status change');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: pendingAction.newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog status');
      }

      setBlog(prev => ({ ...prev, status: pendingAction.newStatus }));
      setMessage(`Đã ${pendingAction.actionText} bài viết thành công!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage(`Lỗi khi ${pendingAction.actionText} bài viết: ` + error.message);
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  // Get blog status info
  const getBlogStatusInfo = (status) => {
    if (status === 'published') {
      return {
        label: 'Đã xuất bản',
        color: 'bg-green-100 text-green-800 border-green-200',
        dotColor: 'bg-green-500',
        icon: '🌐'
      };
    } else if (status === 'draft') {
      return {
        label: 'Bản nháp',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-500',
        icon: '📝'
      };
    } else {
      return {
        label: 'Không xác định',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        dotColor: 'bg-gray-500',
        icon: '❓'
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/blog')}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                title="Quay lại danh sách"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Quay lại</span>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Chi tiết bài viết
                </h1>
                <p className="text-gray-600 mt-1">Xem thông tin chi tiết bài viết</p>
              </div>
            </div>
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
                <div className="relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-[400px] object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image load error:', e.target.src);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="hidden w-full h-[400px] bg-gray-200 rounded-lg items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center text-gray-500">
                      <FaImage className="w-16 h-16 mx-auto mb-2" />
                      <p>Không thể tải hình ảnh</p>
                    </div>
                  </div>
                </div>
              </AdminCard>
            )}

            {/* Title and Excerpt */}
            <AdminCard>
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                  {blog.description && (
                    <p className="text-gray-600 text-lg leading-relaxed">{blog.description}</p>
                  )}
                </div>
                
                {/* Blog Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>
                      {new Date(blog.create_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  {blog.category && (
                    <div className="flex items-center gap-2">
                      <FaTag className="w-4 h-4" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {blog.category}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    <span>{blog.author || 'Admin'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    <span>{blog.views || 0} lượt xem</span>
                  </div>
                </div>
              </div>
            </AdminCard>

            {/* Content */}
            <AdminCard>
              <div className="prose max-w-none">
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </AdminCard>

            {/* SEO Information */}
            <AdminCard title="Thông tin SEO">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {blog.title || 'Chưa có'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {blog.description || 'Chưa có'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono">
                    /blog/{blog._id}
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <AdminCard>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">Trạng thái</div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border ${statusInfo.color}`}>
                    <span className="text-sm">{statusInfo.icon}</span>
                    <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}></span>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500">
                  {blog.status === 'published' 
                    ? 'Bài viết này đang được hiển thị công khai trên website'
                    : 'Bài viết này đang ở chế độ bản nháp, chỉ admin mới thấy được'
                  }
                </div>
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
                      {new Date(blog.create_at).toLocaleDateString('vi-VN', {
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
                      {new Date(blog.updatedAt || blog.create_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Blog ID */}
                <div className="flex items-center gap-3">
                  <FaTag className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">ID Bài viết</div>
                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {blog._id}
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
              
              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium text-gray-700 mb-3">Thao tác nhanh</div>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                    className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    👁️ Xem bài viết công khai
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${blog._id}`)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    📋 Copy link bài viết
                  </button>
                </div>
              </div>
            </AdminCard>
                     </div>
         </div>
       </div>

       {/* Delete Confirmation Modal */}
       <ConfirmModal
         isOpen={showDeleteModal}
         onClose={() => setShowDeleteModal(false)}
         onConfirm={handleConfirmDelete}
         title="Xác nhận xóa"
         message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác!"
         confirmText="Xóa bài viết"
         cancelText="Hủy bỏ"
         type="danger"
       />

       {/* Status Change Confirmation Modal */}
       <ConfirmModal
         isOpen={showStatusModal}
         onClose={() => {
           setShowStatusModal(false);
           setPendingAction(null);
         }}
         onConfirm={handleConfirmStatusChange}
         title="Xác nhận thay đổi trạng thái"
         message={pendingAction ? `Bạn có chắc chắn muốn ${pendingAction.actionText} bài viết này?` : ''}
         confirmText="Xác nhận"
         cancelText="Hủy bỏ"
         type="warning"
       />
     </AdminLayout>
   );
 };

export default AdminBlogDetail;
