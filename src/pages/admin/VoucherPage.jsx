import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';

const VoucherPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const vouchers = [
    { id: 1, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hoạt động' },
    { id: 2, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hết hạn' },
    { id: 3, code: 'M7777', startDate: 'Ngày 15 tháng 5 năm 2025', endDate: 'Ngày 15 tháng 5 năm 2025', status: 'Hoạt động' },
  ];

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVouchers = filteredVouchers.length;
  const totalPages = Math.ceil(totalVouchers / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalVouchers);
  const currentVouchers = filteredVouchers.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Sách Voucher</h1>
          <a
            href="/admin/addvoucher"
            className="bg-[#06AEF4] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700"
          >
            Thêm voucher
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
                    Mã Voucher
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentVouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{voucher.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{voucher.startDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{voucher.endDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                        voucher.status === 'Hoạt động' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {voucher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
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
              <select
                className="px-2 py-1 border border-gray-200 rounded"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <span>
                {startIndex + 1}-{endIndex} trong {totalVouchers} danh mục
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

export default VoucherPage;
