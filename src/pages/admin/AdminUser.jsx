import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin';

const AdminUser = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockData = [
    {
      id: 1,
      name: 'Thanh Phát',
      date: 'Ngày 15 tháng 5 năm 2025',
      orders: '15 đơn hàng',
      status: 'Hoạt động'
    },
    {
      id: 2,
      name: 'Thanh Phát',
      date: 'Ngày 15 tháng 5 năm 2025',
      orders: '15 đơn hàng',
      status: 'Hoạt động'
    },
    {
      id: 3,
      name: 'Thanh Phát',
      date: 'Ngày 15 tháng 5 năm 2025',
      orders: '15 đơn hàng',
      status: 'Hoạt động'
    },
    {
      id: 4,
      name: 'Thanh Phát',
      date: 'Ngày 15 tháng 5 năm 2025',
      orders: '15 đơn hàng',
      status: 'Hoạt động'
    },
    {
      id: 5,
      name: 'Thanh Phát',
      date: 'Ngày 15 tháng 5 năm 2025',
      orders: '15 đơn hàng',
      status: 'Hoạt động'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Sách Người Dùng</h1>
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
<button className="bg-[#06AEF4] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#0590d8] transition-colors duration-300">
  <FaSearch className="text-white" />
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
                    Tên khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src="/images/avata.jpg"
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.orders}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                        {user.status}
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
              <span>1-5 trong 12 sản phẩm</span>
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

export default AdminUser;
