import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import HeaderAdmin from '../../components/HeaderAdmin';

const AdminComment = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockComments = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      product: 'Sản phẩm 1',
      rating: 5,
      comment: 'Sản phẩm rất tốt, tôi rất hài lòng!',
      date: '2024-04-01',
      status: 'Hiển thị',
    },
    {
      id: 2,
      user: 'Trần Thị B',
      product: 'Sản phẩm 2',
      rating: 3,
      comment: 'Chất lượng trung bình, giao hàng chậm.',
      date: '2024-03-28',
      status: 'Ẩn',
    },
    {
      id: 3,
      user: 'Lê Văn C',
      product: 'Sản phẩm 3',
      rating: 4,
      comment: 'Tốt, nhưng đóng gói chưa chắc chắn.',
      date: '2024-03-25',
      status: 'Hiển thị',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar can be added here if needed */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Quản Lý Bình Luận & Đánh Giá</h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người dùng, sản phẩm hoặc nội dung"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <FaSearch className="text-gray-600" />
          </button>
        </div>

        {/* Comments Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Người Dùng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sản Phẩm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đánh Giá</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bình Luận</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockComments
                  .filter(
                    (comment) =>
                      comment.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      comment.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      comment.comment.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((comment) => (
                    <tr key={comment.id} className="border-b border-gray-200">
                      <td className="px-6 py-4 text-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{comment.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{comment.product}</td>
                      <td className="px-6 py-4 text-sm text-yellow-500">
                        {'★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{comment.comment}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{comment.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            comment.status === 'Hiển thị'
                              ? 'text-green-700 bg-green-50'
                              : 'text-red-700 bg-red-50'
                          }`}
                        >
                          {comment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <FaEllipsisV />
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
              <select className="px-2 py-1 border border-gray-200 rounded">
                <option>5</option>
                <option>10</option>
                <option>15</option>
              </select>
              <span>1-5 trong 12 bình luận</span>
              <div className="flex gap-1">
                <button className="p-2 hover:bg-gray-50 rounded">
                  <span className="sr-only">Previous</span>
                  &#60;
                </button>
                <button className="p-2 hover:bg-gray-50 rounded">
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

export default AdminComment;
