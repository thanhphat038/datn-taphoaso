import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin';

const AdminCategory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const handleAddCategory = (e) => {
    e.preventDefault();
    // TODO: Add logic to save new category
    alert(`Danh mục "${newCategoryName}" đã được thêm.`);
    setNewCategoryName('');
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Mục</h1>
<button
  className="bg-[#06AEF4] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#0590d8] transition-colors duration-300"
  onClick={() => setShowModal(true)}
>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm danh mục
          </button>
          {showModal && (
            <>
              <div className="fixed inset-0  backdrop-combined backdrop-blur-xs z-40" onClick={() => setShowModal(false)}></div>
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowModal(false)}
                  >
                    &#x2715;
                  </button>
                  <h2 className="text-lg font-semibold mb-4">Thêm danh mục</h2>
                  <form onSubmit={handleAddCategory}>
                    <label className="block mb-2 font-medium" htmlFor="categoryName">Tên danh mục</label>
                    <input
                      id="categoryName"
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Tên danh mục bạn muốn đặt"
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#06AEF4]"
                      required
                    />
                    <div className="flex justify-end gap-4">
<button
  type="submit"
  className="bg-[#06AEF4] text-white px-4 py-2 rounded-full hover:bg-[#0590d8] transition-colors duration-300"
>
  Lưu thay đổi
</button>
<button
  type="button"
  className="bg-[#06AEF4] text-white px-4 py-2 rounded-full hover:bg-[#0590d8] transition-colors duration-300"
  onClick={() => setShowModal(false)}
>
  Hủy bỏ
</button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
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
