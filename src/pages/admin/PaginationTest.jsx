import React, { useState } from 'react';

const PaginationTest = () => {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const data = [
    { id: 1, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hoạt động' },
    { id: 2, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hết hạn' },
    { id: 3, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hoạt động' },
    { id: 4, code: 'M7778', startDate: 'Ngày 16 tháng 5 năm 2025', endDate: 'Ngày 16 tháng 5 năm 2025', status: 'Hoạt động' },
    { id: 5, code: 'M7779', startDate: 'Ngày 17 tháng 5 năm 2025', endDate: 'Ngày 17 tháng 5 năm 2025', status: 'Hết hạn' },
    { id: 6, code: 'M7780', startDate: 'Ngày 18 tháng 5 năm 2025', endDate: 'Ngày 18 tháng 5 năm 2025', status: 'Hoạt động' },
  ];

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto mt-10">
      <table className="w-full border border-gray-200 rounded">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-2 text-left">Mã Voucher</th>
            <th className="px-4 py-2 text-left">Ngày bắt đầu</th>
            <th className="px-4 py-2 text-left">Ngày kết thúc</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-2 font-semibold">{item.code}</td>
              <td className="px-4 py-2">{item.startDate}</td>
              <td className="px-4 py-2">{item.endDate}</td>
              <td className={`px-4 py-2 font-semibold ${item.status === 'Hoạt động' ? 'text-green-600' : 'text-red-600'}`}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-end gap-4 mt-4 text-sm text-gray-600">
        <span>Số lượng hiển thị</span>
        <select
          className="border border-gray-300 rounded px-2 py-1"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <span>
          {startIndex + 1}-{endIndex} trong {totalItems} danh mục
        </span>
        <button
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        <button
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default PaginationTest;
