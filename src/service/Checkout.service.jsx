import axios from "axios";
import Cookies from "js-cookie";

// API Configuration
const API_BASE_URL = "http://localhost:3000/api";
const API_ENDPOINTS = {
  CREATE_ORDER: "/orders",
  CREATE_VNPAY_PAYMENT: "/payment/create",
  VOUCHER_STATS: "/vouchers/stats",
  PAYMENT_RETURN: "/payment/return"
};

// Auth helper
const getAuthHeaders = () => {
  const token = Cookies.get('auth_token');
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
  const token = Cookies.get('auth_token');
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
      orderId: orderData._id // Truyền orderId để sử dụng làm vnp_TxnRef
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