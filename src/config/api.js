// API Configuration
const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Frontend URL for redirects
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout'
    },
    
    // Users
    USERS: {
      BASE: '/users',
      PROFILE: '/users/profile',
      UPDATE: '/users/update'
    },
    
    // Products
    PRODUCTS: {
      BASE: '/products',
      SEARCH: '/products/search',
      CATEGORY: '/products/category'
    },
    
    // Categories
    CATEGORIES: {
      BASE: '/categories'
    },
    
    // Orders
    ORDERS: {
      BASE: '/orders',
      DETAIL: (id) => `/orders/${id}`,
      USER_ORDERS: '/orders/user'
    },
    
    // Cart
    CART: {
      BASE: '/carts',
      ADD_ITEM: '/carts/add',
      UPDATE_ITEM: '/carts/update',
      REMOVE_ITEM: '/carts/remove',
      CLEAR: '/carts/clear'
    },
    
    // Addresses
    ADDRESSES: {
      BASE: '/addresses',
      DEFAULT: '/addresses/default'
    },
    
    // Reviews
    REVIEWS: {
      BASE: '/reviews',
      PRODUCT: (productId) => `/reviews/product/${productId}`
    },
    
    // Comments
    COMMENTS: {
      BASE: '/comments',
      PRODUCT: (productId) => `/comments/product/${productId}`
    },
    
    // Replies
    REPLIES: {
      BASE: '/replies'
    },
    
    // Favorites
    FAVORITES: {
      BASE: '/favorites',
      ADD: '/favorites/add',
      REMOVE: '/favorites/remove'
    },
    
    // Blogs
    BLOGS: {
      BASE: '/blogs',
      CATEGORIES: '/blogs_categories'
    },
    
    // Vouchers
    VOUCHERS: {
      BASE: '/vouchers',
      VALIDATE: '/vouchers/validate'
    },
    
    // Variants
    VARIANTS: {
      BASE: '/variants'
    },
    
    // Product Variants
    PRODUCT_VARIANTS: {
      BASE: '/product-variants'
    },
    
    // Upload
    UPLOAD: {
      BASE: '/upload',
      IMAGE: '/upload/image'
    },
    
    // Payment
    PAYMENT: {
      BASE: '/payment',
      VNPAY: '/payment/vnpay',
      CREATE: '/payment/create'
    },
    
    // Shipping
    SHIPPING: {
      BASE: '/shipping',
      CALCULATE: '/shipping/calculate'
    },
    
    // Recent Views
    RECENT_VIEWS: {
      BASE: '/recent-views'
    }
  }
};

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

export const getBaseUrl = () => {
  return API_CONFIG.BASE_URL;
};

export const getFrontendUrl = () => {
  return API_CONFIG.FRONTEND_URL;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('accessToken') || 
                '';
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Axios default configuration
import axios from 'axios';

// Set default axios config
axios.defaults.withCredentials = true; // Đảm bảo tất cả requests đều gửi cookies
axios.defaults.baseURL = API_CONFIG.BASE_URL;

export default API_CONFIG; 