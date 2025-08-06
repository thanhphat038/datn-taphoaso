import { getSecureAuthHeaders, getSecureAuthHeadersAsync, refreshAccessToken } from '../utils/secureAuth';
import { getApiUrl } from '../config/api.js';

class SecureApiService {
  constructor() {
    this.baseURL = getApiUrl('');
  }

  // Helper method to handle API calls with automatic token refresh
  async makeRequest(url, options = {}) {
    try {
      // Get auth headers
      const authHeaders = getSecureAuthHeaders();
      
      const config = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers
        }
      };

      const response = await fetch(url, config);

      // If token expired, try to refresh and retry
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const newAuthHeaders = getSecureAuthHeaders();
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
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Handle response and parse JSON
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
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
    const authHeaders = getSecureAuthHeaders();
    
    return this.makeRequest(url, {
      method: 'POST',
      headers: {
        ...authHeaders
        // Don't set Content-Type for FormData
      },
      body: formData
    });
  }
}

// Create singleton instance
const secureApiService = new SecureApiService();

export default secureApiService; 