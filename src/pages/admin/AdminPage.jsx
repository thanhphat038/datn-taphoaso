import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaTicketAlt, FaChartLine, FaCalendarAlt, FaComments, FaStar, FaEye, FaListAlt, FaCalendar, FaChartBar, FaCalendarCheck } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminCard from '../../components/admin/AdminCard';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { getAllComments, getAllReviews, getAllOrders } from '../../service/Admin.Service.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import { getApiUrl } from '../../config/api.js';

const API_BASE_URL = getApiUrl('');

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('week'); // 'day', 'week', 'month', 'year', 'custom'
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
  const [chartData, setChartData] = useState([]);
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0
  });
  const [allOrders, setAllOrders] = useState([]); // Thêm state để lưu tất cả orders
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 ngày trước
    endDate: new Date().toISOString().split('T')[0] // Hôm nay
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Hàm xử lý dữ liệu biểu đồ theo thời gian
  const processChartData = (orders, period) => {
    if (!Array.isArray(orders) || orders.length === 0) return [];

    const now = new Date();
    let data = [];

    switch (period) {
      case 'day':
        // Dữ liệu theo ngày trong tuần
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('vi-VN', { weekday: 'short' });
          
          const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.create_at || order.created_at);
            return orderDate.toDateString() === date.toDateString();
          });
          
          const dayRevenue = dayOrders.reduce((sum, order) => {
            const orderStatus = order.order_status || order.status;
            return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
          }, 0);
          
          data.push({
            name: dateStr,
            revenue: dayRevenue,
            orders: dayOrders.length
          });
        }
        break;

      case 'week':
        // Dữ liệu theo tuần trong tháng
        const weeksInMonth = Math.ceil(now.getDate() / 7);
        for (let i = 1; i <= weeksInMonth; i++) {
          const weekStart = new Date(now.getFullYear(), now.getMonth(), (i - 1) * 7 + 1);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          const weekOrders = orders.filter(order => {
            const orderDate = new Date(order.create_at || order.created_at);
            return orderDate >= weekStart && orderDate <= weekEnd;
          });
          
          const weekRevenue = weekOrders.reduce((sum, order) => {
            const orderStatus = order.order_status || order.status;
            return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
          }, 0);
          
          data.push({
            name: `Tuần ${i}`,
            revenue: weekRevenue,
            orders: weekOrders.length
          });
        }
        break;

      case 'month':
        // Dữ liệu theo tháng trong năm
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = month.toLocaleDateString('vi-VN', { month: 'short' });
          
          const monthOrders = orders.filter(order => {
            const orderDate = new Date(order.create_at || order.created_at);
            return orderDate.getMonth() === month.getMonth() && 
                   orderDate.getFullYear() === month.getFullYear();
          });
          
          const monthRevenue = monthOrders.reduce((sum, order) => {
            const orderStatus = order.order_status || order.status;
            return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
          }, 0);
          
          data.push({
            name: monthStr,
            revenue: monthRevenue,
            orders: monthOrders.length
          });
        }
        break;

      case 'year':
        // Dữ liệu theo năm (3 năm gần nhất)
        for (let i = 2; i >= 0; i--) {
          const year = now.getFullYear() - i;
          
          const yearOrders = orders.filter(order => {
            const orderDate = new Date(order.create_at || order.created_at);
            return orderDate.getFullYear() === year;
          });
          
          const yearRevenue = yearOrders.reduce((sum, order) => {
            const orderStatus = order.order_status || order.status;
            return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
          }, 0);
          
          data.push({
            name: year.toString(),
            revenue: yearRevenue,
            orders: yearOrders.length
          });
        }
        break;

      case 'custom':
        // Dữ liệu theo khoảng thời gian tùy chỉnh
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff <= 31) {
          // Nếu khoảng thời gian <= 31 ngày, hiển thị theo ngày
          for (let i = 0; i <= daysDiff; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toLocaleDateString('vi-VN', { 
              day: '2-digit', 
              month: '2-digit' 
            });
            
            const dayOrders = orders.filter(order => {
              const orderDate = new Date(order.create_at || order.created_at);
              return orderDate.toDateString() === currentDate.toDateString();
            });
            
            const dayRevenue = dayOrders.reduce((sum, order) => {
              const orderStatus = order.order_status || order.status;
              return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
            }, 0);
            
            data.push({
              name: dateStr,
              revenue: dayRevenue,
              orders: dayOrders.length
            });
          }
        } else if (daysDiff <= 365) {
          // Nếu khoảng thời gian <= 365 ngày, hiển thị theo tuần
          const weeksCount = Math.ceil(daysDiff / 7);
          for (let i = 0; i < weeksCount; i++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(startDate.getDate() + (i * 7));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            const weekOrders = orders.filter(order => {
              const orderDate = new Date(order.create_at || order.created_at);
              return orderDate >= weekStart && orderDate <= weekEnd;
            });
            
            const weekRevenue = weekOrders.reduce((sum, order) => {
              const orderStatus = order.order_status || order.status;
              return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
            }, 0);
            
            const weekLabel = `Tuần ${i + 1} (${weekStart.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })})`;
            
            data.push({
              name: weekLabel,
              revenue: weekRevenue,
              orders: weekOrders.length
            });
          }
        } else {
          // Nếu khoảng thời gian > 365 ngày, hiển thị theo tháng
          const monthsCount = Math.ceil(daysDiff / 30);
          for (let i = 0; i < monthsCount; i++) {
            const monthDate = new Date(startDate);
            monthDate.setMonth(startDate.getMonth() + i);
            const monthStr = monthDate.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
            
            const monthOrders = orders.filter(order => {
              const orderDate = new Date(order.create_at || order.created_at);
              return orderDate.getMonth() === monthDate.getMonth() && 
                     orderDate.getFullYear() === monthDate.getFullYear();
            });
            
            const monthRevenue = monthOrders.reduce((sum, order) => {
              const orderStatus = order.order_status || order.status;
              return orderStatus === 'delivered' ? sum + (order.total_amount || 0) : sum;
            }, 0);
            
            data.push({
              name: monthStr,
              revenue: monthRevenue,
              orders: monthOrders.length
            });
          }
        }
        break;

      default:
        break;
    }

    // Trả về tất cả dữ liệu để hiển thị đầy đủ thời gian
    return data;
  };

  // Hàm tính toán thống kê doanh thu
  const calculateRevenueStats = (orders) => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return { totalRevenue: 0, averageOrderValue: 0, totalOrders: 0 };
    }

    const deliveredOrders = orders.filter(order => 
      (order.order_status || order.status) === 'delivered'
    );

    const totalRevenue = deliveredOrders.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    );

    const totalOrders = deliveredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      averageOrderValue,
      totalOrders
    };
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
        

        
        // Xử lý dữ liệu reviews - API trả về { success: true, data: [...] }
        let reviews = [];
        if (reviewsRes?.data?.data) {
          reviews = Array.isArray(reviewsRes.data.data) ? reviewsRes.data.data : [];
        } else if (reviewsRes?.data) {
          reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];
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
        
        // Xử lý dữ liệu biểu đồ
        const chartDataProcessed = processChartData(orders, chartPeriod);
        const revenueStatsData = calculateRevenueStats(orders);
        
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
        
        setChartData(chartDataProcessed);
        setRevenueStats(revenueStatsData);
        setAllOrders(orders); // Lưu tất cả orders
        
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

  // Cập nhật biểu đồ khi thay đổi period
  useEffect(() => {
    // Cập nhật biểu đồ khi thay đổi period
    if (allOrders && allOrders.length > 0) {
      const chartDataProcessed = processChartData(allOrders, chartPeriod);
      setChartData(chartDataProcessed);
    }
  }, [chartPeriod, allOrders, customDateRange]);

  // Hàm xử lý thay đổi period
  const handlePeriodChange = (period) => {
    setChartPeriod(period);
    // Cập nhật biểu đồ ngay lập tức
    if (allOrders && allOrders.length > 0) {
      const chartDataProcessed = processChartData(allOrders, period);
      setChartData(chartDataProcessed);
    }
  };

  // Hàm xử lý thay đổi custom date range
  const handleCustomDateChange = (startDate, endDate) => {
    setCustomDateRange({ startDate, endDate });
    setChartPeriod('custom');
    // Cập nhật biểu đồ ngay lập tức
    if (allOrders && allOrders.length > 0) {
      const chartDataProcessed = processChartData(allOrders, 'custom');
      setChartData(chartDataProcessed);
    }
  };

  // Hàm xử lý áp dụng custom date range
  const applyCustomDateRange = () => {
    // Validation: kiểm tra startDate không lớn hơn endDate
    if (new Date(customDateRange.startDate) > new Date(customDateRange.endDate)) {
      alert('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
      return;
    }
    
    setShowDatePicker(false);
    setChartPeriod('custom');
    if (allOrders && allOrders.length > 0) {
      const chartDataProcessed = processChartData(allOrders, 'custom');
      setChartData(chartDataProcessed);
    }
  };

  // Hàm xử lý thay đổi startDate
  const handleStartDateChange = (startDate) => {
    setCustomDateRange(prev => ({ ...prev, startDate }));
    // Tự động cập nhật endDate nếu startDate > endDate
    if (new Date(startDate) > new Date(customDateRange.endDate)) {
      setCustomDateRange(prev => ({ ...prev, endDate: startDate }));
    }
  };

  // Hàm xử lý thay đổi endDate
  const handleEndDateChange = (endDate) => {
    setCustomDateRange(prev => ({ ...prev, endDate }));
  };

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-[#06AEF4] bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-lg text-gray-600 mt-2">Chào mừng bạn đến với bảng điều khiển quản trị</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Hôm nay</div>
                  <div className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Khách hàng */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 transform group-hover:scale-110 transition-transform duration-300">
                    <FaUsers className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.users}</div>
                    <div className="text-sm text-gray-500">Khách hàng</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">Tổng khách hàng</div>
                  <div className="text-sm text-gray-600">Khách hàng đang hoạt động</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: `${Math.min((stats.users / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 transform group-hover:scale-110 transition-transform duration-300">
                    <FaBox className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.products}</div>
                    <div className="text-sm text-gray-500">Sản phẩm</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">Tổng sản phẩm</div>
                  <div className="text-sm text-gray-600">Sản phẩm đang bán</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: `${Math.min((stats.products / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Đơn hàng */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 transform group-hover:scale-110 transition-transform duration-300">
                    <FaShoppingCart className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.orders}</div>
                    <div className="text-sm text-gray-500">Đơn hàng</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">Tổng đơn hàng</div>
                  <div className="text-sm text-gray-600">Đơn hàng đã đặt</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: `${Math.min((stats.orders / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher */}
            <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 transform group-hover:scale-110 transition-transform duration-300">
                    <FaTicketAlt className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stats.vouchers}</div>
                    <div className="text-sm text-gray-500">Voucher</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">Tổng voucher</div>
                  <div className="text-sm text-gray-600">Voucher khuyến mãi</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: `${Math.min((stats.vouchers / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaChartLine className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-blue-100">Tổng doanh thu</div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaComments className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-purple-100">Bình luận</div>
                  <div className="text-2xl font-bold">{stats.comments}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaStar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-yellow-100">Đánh giá</div>
                  <div className="text-2xl font-bold">{stats.reviews}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Biểu đồ doanh thu</h2>
                  <p className="text-gray-600 mt-1">Theo dõi hiệu suất kinh doanh theo thời gian</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-[#06AEF4] rounded-full"></div>
                  <span>Doanh thu</span>
                </div>
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-gray-700">Thời gian:</span>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {[
                    { key: 'day', label: 'Ngày', icon: FaCalendar },
                    { key: 'week', label: 'Tuần', icon: FaChartBar },
                    { key: 'month', label: 'Tháng', icon: FaChartLine },
                    { key: 'year', label: 'Năm', icon: FaChartLine }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handlePeriodChange(key)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        chartPeriod === key
                          ? 'bg-white text-[#06AEF4] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                  
                  {/* Custom Date Range Button */}
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      chartPeriod === 'custom'
                        ? 'bg-white text-[#06AEF4] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <FaCalendarCheck className="w-4 h-4" />
                    Tùy chỉnh
                  </button>
                </div>
              </div>

              {/* Custom Date Picker */}
              {showDatePicker && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Từ ngày:</label>
                      <input
                        type="date"
                        value={customDateRange.startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Đến ngày:</label>
                      <input
                        type="date"
                        value={customDateRange.endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#06AEF4] focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={applyCustomDateRange}
                        className="px-4 py-2 bg-[#06AEF4] text-white text-sm font-medium rounded-lg hover:bg-[#0590d8] transition-colors duration-200 shadow-sm"
                      >
                        Áp dụng
                      </button>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-white/50 p-3 rounded-lg">
                    <p>• Khoảng thời gian ≤ 31 ngày: Hiển thị theo ngày</p>
                    <p>• Khoảng thời gian ≤ 365 ngày: Hiển thị theo tuần</p>
                    <p>• Khoảng thời gian &gt; 365 ngày: Hiển thị theo tháng</p>
                  </div>
                </div>
              )}

              {/* Current Period Indicator */}
              {chartPeriod === 'custom' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <FaCalendarCheck className="w-4 h-4" />
                    <span className="font-medium">Khoảng thời gian đang xem:</span>
                    <span className="bg-white px-3 py-1 rounded-lg border border-blue-200">
                      {new Date(customDateRange.startDate).toLocaleDateString('vi-VN')} - {new Date(customDateRange.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              )}

              {/* Revenue Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      <FaChartLine className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">Tổng doanh thu</div>
                      <div className="text-xl font-bold text-blue-900">{formatCurrency(revenueStats.totalRevenue)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 text-white rounded-lg">
                      <FaShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-green-600 font-medium">Đơn hàng hoàn thành</div>
                      <div className="text-xl font-bold text-green-900">{revenueStats.totalOrders}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 text-white rounded-lg">
                      <FaChartBar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm text-purple-600 font-medium">Giá trị TB/đơn</div>
                      <div className="text-xl font-bold text-purple-900">{formatCurrency(revenueStats.averageOrderValue)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-6">
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06AEF4]"></div>
                    <span className="ml-4 text-gray-600 text-lg">Đang tải biểu đồ...</span>
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => formatCurrency(value).replace('₫', '')}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
                                <p className="font-medium text-gray-900 mb-2">{label}</p>
                                <p className="text-[#06AEF4] font-semibold text-lg">
                                  Doanh thu: {formatCurrency(payload[0].value)}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  Đơn hàng: {payload[0].payload.orders}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#06AEF4" 
                        strokeWidth={3}
                        dot={{ fill: '#06AEF4', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8, stroke: '#06AEF4', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaChartLine className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có dữ liệu</h3>
                      <p className="text-gray-500">Không có dữ liệu doanh thu để hiển thị</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Đơn hàng gần đây</h2>
              <p className="text-gray-600 mt-1">Theo dõi các đơn hàng mới nhất</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#06AEF4]"></div>
                    <span className="ml-4 text-gray-600 text-lg">Đang tải dữ liệu...</span>
                  </div>
                ) : stats.recentOrders?.length > 0 ? (
                  <div className="grid gap-4">
                    {stats.recentOrders.map((order, index) => (
                      <div key={order._id} className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-[#06AEF4] transition-all duration-300">
                        {/* Order number badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            #{order._id.slice(-8)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {/* Order icon with status color */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${
                              (order.order_status || order.status) === 'delivered' 
                                ? 'bg-green-100 text-green-600' 
                                : (order.order_status || order.status) === 'cancelled'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              <FaShoppingCart className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {order.receiver || 'Khách hàng ẩn danh'}
                                </h4>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  getOrderStatusInfo(order.order_status || order.status).color
                                }`}>
                                  {getOrderStatusInfo(order.order_status || order.status).label}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                  <FaCalendarAlt className="w-4 h-4" />
                                  {order.create_at ? new Date(order.create_at).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'N/A'}
                                </span>
                                <span className="font-semibold text-gray-900 text-lg">
                                  {formatCurrency(order.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action button */}
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/admin/order?orderId=${order._id}`}
                              className="inline-flex items-center gap-2 px-5 py-3 bg-[#06AEF4] text-white text-sm font-medium rounded-xl hover:bg-[#0590d8] transition-all duration-200 shadow-sm hover:shadow-md group-hover:scale-105"
                            >
                              <FaEye className="w-4 h-4" />
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
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaShoppingCart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 text-lg">Khi có đơn hàng mới, chúng sẽ xuất hiện ở đây</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/admin/product" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <FaBox className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">Quản lý sản phẩm</div>
                    <div className="text-sm text-gray-500">Thêm và quản lý sản phẩm</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/admin/order" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                    <FaShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">Quản lý đơn hàng</div>
                    <div className="text-sm text-gray-500">Xem và xử lý đơn hàng</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/admin/voucher" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <FaTicketAlt className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">Quản lý voucher</div>
                    <div className="text-sm text-gray-500">Tạo và quản lý voucher</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/admin/user" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                    <FaUsers className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">Quản lý khách hàng</div>
                    <div className="text-sm text-gray-500">Xem thông tin khách hàng</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;