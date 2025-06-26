import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import data from '../../data/blog.json';

const AdminBlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const blogs = data;

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalBlogs);
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Sách Blog</h1>
          <a
            href="/admin/addblog"
            className="bg-[#06AEF4] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm bài viết
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaSearch className="text-gray-600" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tác giả
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tóm tắt
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">{blog.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(blog.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                        blog.status === 'published' ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-200'
                      }`}>
                        {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.summary}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => window.location.href = `/admin/blog/detail/${blog.id}`}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Số lượng hiển thị</span>
              <select
                className="px-2 py-1 border border-gray-200 rounded"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
              </select>
              <span>
                {startIndex + 1}-{endIndex} trong {totalBlogs} bài viết
              </span>
              <div className="flex gap-1">
                <button
                  className="p-2 hover:bg-gray-50 rounded"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  &#60;
                </button>
                <button
                  className="p-2 hover:bg-gray-50 rounded"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  &#62;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPage;
