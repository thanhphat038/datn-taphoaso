import axios from "axios";
import Cookies from "js-cookie";
import { getApiUrl } from '../config/api.js';

const API_BASE_URL = getApiUrl('');
const API_ENDPOINTS = {
  CALCULATE_SHIPPING: "/shipping/calculate-from-address",
  STORE_INFO: "/shipping/store-info"
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

// Tính phí vận chuyển từ địa chỉ
export const calculateShippingFee = async (deliveryAddress, service = 'default') => {
  try {
    console.log('Calculating shipping fee for:', deliveryAddress, 'service:', service);
    const response = await apiClient.post(API_ENDPOINTS.CALCULATE_SHIPPING, {
      deliveryAddress,
      service
    });
    return response.data;
  } catch (error) {
    console.error('Calculate shipping fee error:', error);
    // Trả về phí mặc định nếu có lỗi
    return {
      success: false,
      shippingFee: 0,
      message: 'Không thể tính phí vận chuyển, áp dụng miễn phí'
    };
  }
};

// Lấy thông tin cửa hàng
export const getStoreInfo = async () => {
  try {
    console.log('Getting store info');
    const response = await apiClient.get(API_ENDPOINTS.STORE_INFO);
    return response.data;
  } catch (error) {
    console.error('Get store info error:', error);
    throw error;
  }
};
