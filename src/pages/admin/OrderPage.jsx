
import React, { useState } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';

const OrderPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const orders = [
    { id: '#12345', customer: 'John Doe', date: '2024-03-20', status: 'Hoàn thành', price: '99.99', details: [
      { name: 'Lốc 4 hộp sữa chua có đường Nutimilk 100g', price: 104500, quantity: 1 },
      { name: 'Lốc 4 hộp sữa chua có đường Nutimilk 100g', price: 104500, quantity: 1 },
      { name: 'Lốc 4 hộp sữa chua có đường Nutimilk 100g', price: 104500, quantity: 1 },
      { name: 'Lốc 4 hộp sữa chua có đường Nutimilk 100g', price: 104500, quantity: 1 },
    ], shippingFee: 'Miễn phí', discount: 4500, total: 100000, paid: 100000, paymentMethod: 'Tiền mặt' },
    { id: '#12346', customer: 'Jane Smith', date: '2024-03-19', status: 'Chưa giải quyết', price: '149.99', details: [], shippingFee: '', discount: 0, total: 0, paid: 0, paymentMethod: '' },
    { id: '#12347', customer: 'Bob Johnson', date: '2024-03-18', status: 'Đang xử lý', price: '79.99', details: [], shippingFee: '', discount: 0, total: 0, paid: 0, paymentMethod: '' },
  ];

  const canceledOrders = [
    { id: '#12348', customer: 'Alice Brown', date: '2024-03-17', status: 'Bị hủy', price: '$59.99' },
    { id: '#12349', customer: 'Tom White', date: '2024-03-16', status: 'Bị hủy', price: '$89.99' },
  ];

  const completedOrders = [
    { id: '#12350', customer: 'Emma Green', date: '2024-03-15', status: 'Hoàn thành', price: '$129.99' },
    { id: '#12351', customer: 'Liam Black', date: '2024-03-14', status: 'Hoàn thành', price: '$199.99' },
  ];

  const statusColors = {
    'Hoàn thành': 'bg-green-100 text-green-700',
    'Chưa giải quyết': 'bg-yellow-100 text-yellow-700',
    'Đang xử lý': 'bg-blue-100 text-blue-700',
    'Bị hủy': 'bg-red-100 text-red-700',
  };

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState('Hoàn thành');
  const [currentEditOrderId, setCurrentEditOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusUpdate = () => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === currentEditOrderId ? { ...order, status: editStatus } : order
      )
    );
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, orders.length);

  const paginatedOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Đơn Hàng</h1>
          {/* Add Order button can be added here if needed */}
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

        {/* Recent Orders Table */}
        <section className="bg-white rounded-lg shadow-sm mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID Đơn Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày Mua</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn Giá</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                          statusColors[order.status]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.price}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan="7" className="border border-gray-300 p-4 bg-gray-50">
                        <div className="flex gap-4">
                          <div className="flex-1 overflow-y-auto max-h-48 border border-gray-300 rounded p-2">
                            {order.details.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between border-b border-gray-200 py-1"
                              >
                                <span>{item.name}</span>
                                <span>{item.price.toLocaleString()}₫</span>
                                <span className="text-gray-500">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex-1 border border-gray-300 rounded p-4">
                            <div className="flex justify-between mb-2">
                              <span>Tiền hàng</span>
                              <span>
                                {order.details
                                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                                  .toLocaleString()}
                                ₫
                              </span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Phí giao hàng, phụ phí</span>
                              <span>{order.shippingFee}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Tiền được giảm</span>
                              <span>- {order.discount.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between mb-2 font-semibold">
                              <span>Tổng đơn</span>
                              <span>{order.total.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between mb-2 font-semibold">
                              <span>Đã thanh toán</span>
                              <span>{order.paid.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>Thanh toán</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Trạng thái</span>
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  statusColors[order.status]
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="mt-4 flex gap-4">
                              <button
                                className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-500"
                                onClick={() => {
                                  setCurrentEditOrderId(order.id);
                                  setEditStatus(order.status);
                                  setShowEditModal(true);
                                }}
                              >
                                Chỉnh đơn hàng
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {showEditModal && (
          <div className="fixed inset-0 backdrop-combined backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Chỉnh sửa trạng thái đơn hàng</h3>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Chưa giải quyết">Chưa giải quyết</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Bị hủy">Bị hủy</option>
              </select>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
                  onClick={() => {
                    handleStatusUpdate();
                    setShowEditModal(false);
                  }}
                >
                  Lưu
                </button>
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Đơn Hàng Bị Hủy</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID Đơn Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày Mua</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn Giá</th>
              </tr>
            </thead>
            <tbody>
              {canceledOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Đơn Hàng Thành Công</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID Đơn Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Khách Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày Mua</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Đơn Giá</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-700">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};


