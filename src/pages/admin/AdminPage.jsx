import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaTicketAlt, FaChartLine, FaCalendarAlt, FaComments, FaStar, FaEye } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { getAllComments, getAllReviews, getAllOrders } from '../../service/Admin.Service.jsx';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminPage = () => {
  const navigate = useNavigate();
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

  // Hàm đếm khách hàng
  const countUsers = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) return 0;
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return data.data?.length || 0;
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  };

  // Hàm đếm sản phẩm
  const countProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      return data.data?.length || 0;
    } catch (error) {
      console.error('Error counting products:', error);
      return 0;
    }
  };

  // Hàm đếm tổng đơn hàng
  const countOrders = async () => {
    try {
      const response = await getAllOrders();
      const ordersData = response.data.data.ordersWithItems || response.data.data || [];
      return Array.isArray(ordersData) ? ordersData.length : 0;
    } catch (error) {
      console.error('Error counting orders:', error);
      return 0;
    }
  };

  // Hàm đếm voucher
  const countVouchers = async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) return 0;
      
      const response = await fetch(`${API_BASE_URL}/vouchers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return data.data?.length || 0;
    } catch (error) {
      console.error('Error counting vouchers:', error);
      return 0;
    }
  };

  // Fetch dashboard stats với các hàm đếm riêng
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Kiểm tra token trước khi gọi API
        const token = Cookies.get('auth_token');
        if (!token) {
          console.error('No authentication token found, redirecting to login');
          navigate('/login');
          return;
        }
        // Gọi các hàm đếm riêng lẻ với error handling
        const [userCount, productCount, orderCount, voucherCount, commentsRes, reviewsRes, ordersRes] = await Promise.allSettled([
          countUsers(),
          countProducts(),
          countOrders(),
          countVouchers(),
          getAllComments(),
          getAllReviews(),
          getAllOrders()
        ]).then(results => results.map(result => 
          result.status === 'fulfilled' ? result.value : null
        ));
        
        console.log('All API responses:', {
          commentsRes,
          reviewsRes,
          ordersRes
        });
        
        // Xử lý dữ liệu comments - API trả về { success: true, data: [...] }
        let comments = [];
        if (commentsRes?.data?.data) {
          comments = Array.isArray(commentsRes.data.data) ? commentsRes.data.data : [];
        } else if (commentsRes?.data) {
          comments = Array.isArray(commentsRes.data) ? commentsRes.data : [];
        }
        console.log('Comments response:', commentsRes);
        console.log('Comments data:', comments);
        
        // Xử lý dữ liệu reviews - API trả về trực tiếp array
        let reviews = [];
        if (reviewsRes?.data) {
          reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
        } else if (reviewsRes?.data?.data) {
          reviews = Array.isArray(reviewsRes.data.data) ? reviewsRes.data.data : [];
        }
        console.log('Reviews response:', reviewsRes);
        console.log('Reviews data:', reviews);
        
        // Xử lý dữ liệu orders
        const orders = ordersRes?.data?.data?.ordersWithItems || ordersRes?.data?.data || [];
        
        // Tính tổng doanh thu - chỉ tính đơn hàng đã hoàn thành
        const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, o) => {
          const orderStatus = o.order_status || o.status;
          if (orderStatus === 'delivered') {
            return sum + (o.total_amount || 0);
          }
          return sum;
        }, 0) : 0;
        
        // Lấy 5 đơn hàng gần nhất (theo ngày tạo mới nhất)
        const sortedOrders = Array.isArray(orders) ? [...orders].sort((a, b) => new Date(b.create_at || b.created_at) - new Date(a.create_at || a.created_at)) : [];
        const recentOrders = sortedOrders.slice(0, 5);
        
        setStats({
          users: userCount,
          products: productCount,
          orders: orderCount,
          vouchers: voucherCount,
          comments: comments.length,
          reviews: reviews.length,
          totalRevenue,
          recentOrders
        });
        
        console.log('Final stats:', {
          users: userCount,
          products: productCount,
          orders: orderCount,
          vouchers: voucherCount,
          comments: comments.length,
          reviews: reviews.length,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

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

        {/* Main Stats - Chi tiết 4 mục chính */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Khách hàng */}
          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-transparent border border-blue-200 hover:border-blue-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
<svg className="w-8 h-8 text-blue-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.users}</div>
              <div className="text-sm text-gray-600 font-medium">Tổng khách hàng</div>
              <div className="text-xs text-gray-500 mt-1">Khách hàng đang hoạt động</div>
            </div>
          </AdminCard>

          {/* Sản phẩm */}
          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-transparent border border-green-200 hover:border-green-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <FaBox className="w-6 h-6 text-white" />
                </div>
                <svg className="w-8 h-8 text-green-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.products}</div>
              <div className="text-sm text-gray-600 font-medium">Tổng sản phẩm</div>
              <div className="text-xs text-gray-500 mt-1">Sản phẩm đang bán</div>
            </div>
          </AdminCard>

          {/* Đơn hàng */}
          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-transparent border border-purple-200 hover:border-purple-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <FaShoppingCart className="w-6 h-6 text-white" />
                </div>
<svg className="w-8 h-8 text-purple-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.orders}</div>
              <div className="text-sm text-gray-600 font-medium">Tổng đơn hàng</div>
              <div className="text-xs text-gray-500 mt-1">Đơn hàng đã đặt</div>
            </div>
          </AdminCard>

          {/* Voucher */}
          <AdminCard className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-transparent border border-orange-200 hover:border-orange-300 transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <FaTicketAlt className="w-6 h-6 text-white" />
                </div>
                <svg className="w-8 h-8 text-orange-400/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-1">{stats.vouchers}</div>
              <div className="text-sm text-gray-600 font-medium">Tổng voucher</div>
              <div className="text-xs text-gray-500 mt-1">Voucher khuyến mãi</div>
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
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06AEF4]"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : stats.recentOrders?.length > 0 ? (
              <div className="grid gap-3">
                {stats.recentOrders.map((order, index) => (
                  <div key={order._id} className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-[#06AEF4] transition-all duration-300">
                    {/* Order number badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        #{order._id.slice(-8)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Order icon with status color */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                          (order.order_status || order.status) === 'delivered' 
                            ? 'bg-green-100 text-green-600' 
                            : (order.order_status || order.status) === 'cancelled'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <FaShoppingCart className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {order.receiver || 'Khách hàng ẩn danh'}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              getOrderStatusInfo(order.order_status || order.status).color
                            }`}>
                              {getOrderStatusInfo(order.order_status || order.status).label}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="w-3 h-3" />
                              {order.create_at ? new Date(order.create_at).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'N/A'}
                            </span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/order?orderId=${order._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#06AEF4] text-white text-sm font-medium rounded-lg hover:bg-[#0590d8] transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                        >
                          <FaEye className="w-3 h-3" />
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#06AEF4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-500">Khi có đơn hàng mới, chúng sẽ xuất hiện ở đây</p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/admin/product" className="hover:shadow-md transition-shadow cursor-pointer no-underline">
            <AdminCard>
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
          </Link>
          <Link to="/admin/order" className="hover:shadow-md transition-shadow cursor-pointer no-underline">
            <AdminCard>
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
          </Link>
          <Link to="/admin/voucher" className="hover:shadow-md transition-shadow cursor-pointer no-underline">
            <AdminCard>
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
          </Link>
          <Link to="/admin/user" className="hover:shadow-md transition-shadow cursor-pointer no-underline">
            <AdminCard>
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
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;