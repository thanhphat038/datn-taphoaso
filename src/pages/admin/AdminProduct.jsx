import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import data from '../../data/db.json';

const AdminProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const products = data.products;

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProducts);
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}-
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Danh Sách Sản Phẩm</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-700">
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
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
                    Tên sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Giá
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-700">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(product.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.price.toLocaleString('vi-VN')} đ</td>
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
                {startIndex + 1}-{endIndex} trong {totalProducts} sản phẩm
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

export default AdminProduct;
