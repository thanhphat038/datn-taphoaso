import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { MdDashboard, MdPeople, MdShoppingCart, MdCategory, MdSettings, MdReceipt } from 'react-icons/md';

const AdminCategory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { icon: MdDashboard, text: 'Tổng quát', path: '/admin/dashboard' },
    { icon: MdPeople, text: 'Khách hàng', path: '/admin/customers' },
    { icon: MdShoppingCart, text: 'Sản phẩm', path: '/admin/products' },
    { icon: MdCategory, text: 'Danh mục', path: '/admin/categories', active: true },
    { icon: MdSettings, text: 'Thuộc tính', path: '/admin/attributes' },
    { icon: MdReceipt, text: 'Đơn hàng', path: '/admin/orders' },
  ];

  const mockData = [
    {
      id: 1,
      name: 'Thịt gà, vịt, chim',
      date: 'Ngày 15 tháng 5 năm 2025',
      status: 'Hoạt động',
    },
    {
      id: 2,
      name: 'Thịt gà, vịt, chim',
      date: 'Ngày 15 tháng 5 năm 2025',
      status: 'Hoạt động',
    },
    {
      id: 3,
      name: 'Thịt gà, vịt, chim',
      date: 'Ngày 15 tháng 5 năm 2025',
      status: 'Hoạt động',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 flex justify-center">
          <img src="/images/logo_ngang.png" alt="Logo" className="h-8 mb-8" />
        </div>
        <nav className="px-4">
          {sidebarItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Mục</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tiềm kiếm"
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
                    Tên danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                        category.status === 'Hoạt động' ? 'text-green-700 bg-green-50' : 'text-gray-700 bg-gray-100'
                      }`}>
                        <span className={`w-2 h-2 rounded-full inline-block ${
                          category.status === 'Hoạt động' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {category.status}
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
              <span>1-5 trong 12 danh mục</span>
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

export default AdminCategory;
