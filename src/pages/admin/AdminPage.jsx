import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaTicketAlt, FaChartLine, FaCalendarAlt, FaComments, FaStar } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';

const API_BASE_URL = 'http://localhost:3000/api';

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    vouchers: 0,
    comments: 0,
    reviews: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const result = await response.json();
        setStats(result.data || {});
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  // Get order status info
  const getOrderStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ xử lý', color: 'text-yellow-600 bg-yellow-100' };
      case 'processing':
        return { label: 'Đang xử lý', color: 'text-blue-600 bg-blue-100' };
      case 'shipped':
        return { label: 'Đã giao hàng', color: 'text-purple-600 bg-purple-100' };
      case 'delivered':
        return { label: 'Hoàn thành', color: 'text-green-600 bg-green-100' };
      case 'cancelled':
        return { label: 'Đã hủy', color: 'text-red-600 bg-red-100' };
      default:
        return { label: status, color: 'text-gray-600 bg-gray-100' };
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-1">Xem tổng quan về hoạt động của cửa hàng</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminCard className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaUsers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Khách hàng</div>
                <div className="text-2xl font-bold">{stats.users}</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaBox className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Sản phẩm</div>
                <div className="text-2xl font-bold">{stats.products}</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Đơn hàng</div>
                <div className="text-2xl font-bold">{stats.orders}</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaTicketAlt className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm opacity-90">Voucher</div>
                <div className="text-2xl font-bold">{stats.vouchers}</div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FaChartLine className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Doanh thu</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaComments className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bình luận</div>
                <div className="text-2xl font-bold text-gray-900">{stats.comments}</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <FaStar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đánh giá</div>
                <div className="text-2xl font-bold text-gray-900">{stats.reviews}</div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Recent Orders */}
        <AdminCard title="Đơn hàng gần đây">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Đang tải dữ liệu...</div>
            ) : stats.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">#{order._id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">{order.receiver || 'Không có tên'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(order.total)}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getOrderStatusInfo(order.status).color}`}>
                      {getOrderStatusInfo(order.status).label}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">Không có đơn hàng nào</div>
            )}
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminCard className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/product'}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FaBox className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Quản lý sản phẩm</div>
                <div className="text-sm text-gray-500">Thêm và quản lý sản phẩm</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/order'}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FaShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Quản lý đơn hàng</div>
                <div className="text-sm text-gray-500">Xem và xử lý đơn hàng</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/voucher'}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaTicketAlt className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Quản lý voucher</div>
                <div className="text-sm text-gray-500">Tạo và quản lý voucher</div>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/admin/user'}>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <FaUsers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Quản lý khách hàng</div>
                <div className="text-sm text-gray-500">Xem thông tin khách hàng</div>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
