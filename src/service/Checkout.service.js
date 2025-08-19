import axios from "axios";
import Cookies from "js-cookie";

// API Configuration
import { getApiUrl } from '../config/api.js';

const API_BASE_URL = getApiUrl('');
const API_ENDPOINTS = {
  CREATE_ORDER: "/orders",
  CREATE_VNPAY_PAYMENT: "/payment/create",
  VOUCHER_STATS: "/vouchers/stats",
  PAYMENT_RETURN: "/payment/return"
};

// Auth helper - sử dụng đúng token storage
const getAuthHeaders = () => {
  // Thử lấy token từ sessionStorage trước (hệ thống mới)
  let token = sessionStorage.getItem('access_token');
  
  // Fallback: thử từ localStorage
  if (!token) {
    token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
  }
  
  // Fallback: thử từ cookies (hệ thống cũ)
  if (!token) {
    token = Cookies.get('auth_token');
  }
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthHeaders().Authorization?.split(' ')[1];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo đơn hàng thường (COD)
export const createOrder = async (orderData) => {
  try {
    console.log('Creating order:', orderData);
    const response = await apiClient.post(API_ENDPOINTS.CREATE_ORDER, orderData);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

// Tạo thanh toán VNPAY
export const createVNPayPayment = async (orderData) => {
  try {
    // Format body theo API spec
    const paymentBody = {
      method: "vnpay",
      amount: orderData.total_amount,
      bankCode: "",
      language: "vn",
      orderId: orderData._id 
    };
    
    console.log('Creating VNPAY payment with orderId:', orderData._id);
    console.log('Payment body:', paymentBody);
    const response = await apiClient.post(API_ENDPOINTS.CREATE_VNPAY_PAYMENT, paymentBody);
    console.log('VNPAY API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create VNPAY payment error:', error);
    throw error;
  }
};

// Lấy thống kê voucher
export const getVoucherStats = async () => {
  try {
    console.log('Getting voucher stats');
    const response = await apiClient.get(API_ENDPOINTS.VOUCHER_STATS);
    return response.data;
  } catch (error) {
    console.error('Get voucher stats error:', error);
    throw error;
  }
};

// Xử lý payment return từ VNPAY
export const processPaymentReturn = async (queryParams) => {
  try {
    console.log('Processing payment return:', queryParams);
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_RETURN, {
      params: queryParams
    });
    return response.data;
  } catch (error) {
    console.error('Process payment return error:', error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const token = Cookies.get('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Cancelling order:', orderId);
    console.log('Token:', token);

    const response = await axios.patch(
      `${API_BASE_URL}/orders/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = Cookies.get('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Updating order status:', orderId, status);

    const response = await axios.put(
      `${API_BASE_URL}/orders/${orderId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Lấy thông tin đơn hàng theo ID hoặc VNPAY reference
export const getOrderInfo = async (orderId) => {
  try {
    const token = Cookies.get('auth_token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Kiểm tra xem orderId có phải là MongoDB ObjectId không
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    let apiUrl;
    
    if (objectIdPattern.test(orderId)) {
      // Nếu là MongoDB ObjectId, gọi API deadline
      apiUrl = `${API_BASE_URL}/orders/${orderId}/deadline`;
    } else {
      // Nếu không phải (có thể là vnp_TxnRef), tìm order theo vnpay_txn_ref
      apiUrl = `${API_BASE_URL}/orders/find-by-vnpay-ref/${orderId}`;
    }

    console.log('Getting order info from:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting order info:', error);
    throw error;
  }
};

// Tạo lại payment URL cho VNPAY
export const retryVNPayPayment = async (orderData) => {
  try {
    // Sử dụng getAuthHeaders() thay vì tự lấy token
    const authHeaders = getAuthHeaders();
    
    if (!authHeaders.Authorization) {
      throw new Error('No authentication token found');
    }

    console.log('Retrying VNPAY payment with order data:', orderData);

    const response = await axios.post(`${API_BASE_URL}/payment/create`, {
      method: 'vnpay',
      amount: orderData.total_amount,
      orderId: orderData.id,
      bankCode: '',
      language: 'vn'
    }, {
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json'
      }
    });

    console.log('VNPAY retry response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error retrying VNPAY payment:', error);
    throw error;
  }
}; 