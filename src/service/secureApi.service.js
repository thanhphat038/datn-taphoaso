import { getSecureAuthHeaders, getSecureAuthHeadersAsync, refreshAccessToken, clearSecureTokens } from '../utils/secureAuth.js';
import { getApiUrl } from '../config/api.js';

class SecureApiService {
  constructor() {
    this.baseURL = getApiUrl('');
    this.isRefreshing = false;
    this.failedQueue = [];
    
    // Process failed queue
    this.processQueue = (error, token = null) => {
      this.failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
      this.failedQueue = [];
    };
  }

  // Helper method to handle API calls with automatic token refresh
  async makeRequest(url, options = {}) {
    try {
      // Get auth headers
      const authHeaders = await getSecureAuthHeadersAsync();
      
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers
        }
      };

      const response = await fetch(url, config);

      // If token expired, handle refresh logic
      if (response.status === 401) {
        return this.handleTokenExpired(url, options, response);
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Handle token expired with queue mechanism
  async handleTokenExpired(url, options, originalResponse) {
    // If already refreshing, add to queue
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => {
        return this.makeRequest(url, options);
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        // Process queue with success
        this.processQueue(null, newToken);
        
        // Retry original request with new token
        const newAuthHeaders = await getSecureAuthHeadersAsync();
        const retryConfig = {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...newAuthHeaders,
            ...options.headers
          }
        };
        
        const retryResponse = await fetch(url, retryConfig);
        return this.handleResponse(retryResponse);
      } else {
        // Refresh failed, process queue with error
        this.processQueue(new Error('Token refresh failed'));
        
        // Clear tokens and redirect to login
        clearSecureTokens();
        this.redirectToLogin();
        
        throw new Error('Authentication failed. Please login again.');
      }
    } catch (error) {
      // Process queue with error
      this.processQueue(error);
      
      // Clear tokens and redirect to login
      clearSecureTokens();
      this.redirectToLogin();
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Redirect to login page
  redirectToLogin() {
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('auth:token-expired', {
      detail: { message: 'Session expired. Please login again.' }
    }));
    
    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Handle response and parse JSON
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication required');
        } else if (response.status === 403) {
          throw new Error('Access denied');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      return data;
    } else {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.text();
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(this.baseURL + endpoint);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.makeRequest(url.toString());
  }

  // POST request
  async post(endpoint, data = {}) {
    const url = this.baseURL + endpoint;
    
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    const url = this.baseURL + endpoint;
    
    return this.makeRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    const url = this.baseURL + endpoint;
    
    return this.makeRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    const url = this.baseURL + endpoint;
    
    return this.makeRequest(url, {
      method: 'DELETE'
    });
  }

  // Upload file
  async upload(endpoint, formData) {
    const url = this.baseURL + endpoint;
    const authHeaders = await getSecureAuthHeadersAsync();
    
    return this.makeRequest(url, {
      method: 'POST',
      headers: {
        ...authHeaders
        // Don't set Content-Type for FormData
      },
      body: formData
    });
  }

  // Check if token is about to expire
  async checkTokenExpiry() {
    try {
      const token = await getSecureAuthHeadersAsync();
      if (token && token.Authorization) {
        const tokenValue = token.Authorization.replace('Bearer ', '');
        const expiry = this.getTokenExpiry(tokenValue);
        const currentTime = Date.now();
        
        // Return true if token expires in less than 5 minutes
        return expiry && (expiry - currentTime) < 5 * 60 * 1000;
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return false;
    }
  }

  // Get token expiry time
  getTokenExpiry(token) {
    if (!token || typeof token !== 'string') return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  }
}

// Create singleton instance
const secureApiService = new SecureApiService();

export default secureApiService; 