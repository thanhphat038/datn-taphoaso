import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import secureApiService from '../service/SecureApi.service';

export const useSecureApi = () => {
  const { isAuthenticated, forceRefreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh token when it's about to expire
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiry = async () => {
      try {
        const isExpiringSoon = await secureApiService.checkTokenExpiry();
        if (isExpiringSoon) {
          console.log('[useSecureApi] Token expiring soon, refreshing...');
          await forceRefreshToken();
        }
      } catch (error) {
        console.error('[useSecureApi] Token expiry check error:', error);
      }
    };

    // Check every 2 minutes
    const interval = setInterval(checkTokenExpiry, 2 * 60 * 1000);
    
    // Also check when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTokenExpiry();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, forceRefreshToken]);

  // Enhanced API call with automatic retry and token refresh
  const makeSecureRequest = useCallback(async (apiCall, retryCount = 0) => {
    const MAX_RETRIES = 2;

    try {
      if (isRefreshing) {
        // Wait for current refresh to complete
        await new Promise(resolve => {
          const checkRefreshing = () => {
            if (!isRefreshing) {
              resolve();
            } else {
              setTimeout(checkRefreshing, 100);
            }
          };
          checkRefreshing();
        });
      }

      return await apiCall();
    } catch (error) {
      console.error(`[useSecureApi] Request failed (attempt ${retryCount + 1}):`, error);

      // Handle authentication errors
      if (error.message?.includes('Authentication') || 
          error.message?.includes('Token expired') ||
          error.message?.includes('401')) {
        
        if (retryCount < MAX_RETRIES) {
          try {
            setIsRefreshing(true);
            console.log('[useSecureApi] Attempting token refresh...');
            
            await forceRefreshToken();
            
            // Retry the request
            const result = await makeSecureRequest(apiCall, retryCount + 1);
            setIsRefreshing(false);
            return result;
          } catch (refreshError) {
            console.error('[useSecureApi] Token refresh failed:', refreshError);
            setIsRefreshing(false);
            throw new Error('Authentication failed. Please login again.');
          }
        } else {
          throw new Error('Authentication failed after multiple attempts.');
        }
      }

      throw error;
    }
  }, [isRefreshing, forceRefreshToken]);

  // Convenience methods for common HTTP operations
  const get = useCallback(async (endpoint, params = {}) => {
    return makeSecureRequest(() => secureApiService.get(endpoint, params));
  }, [makeSecureRequest]);

  const post = useCallback(async (endpoint, data = {}) => {
    return makeSecureRequest(() => secureApiService.post(endpoint, data));
  }, [makeSecureRequest]);

  const put = useCallback(async (endpoint, data = {}) => {
    return makeSecureRequest(() => secureApiService.put(endpoint, data));
  }, [makeSecureRequest]);

  const patch = useCallback(async (endpoint, data = {}) => {
    return makeSecureRequest(() => secureApiService.patch(endpoint, data));
  }, [makeSecureRequest]);

  const del = useCallback(async (endpoint) => {
    return makeSecureRequest(() => secureApiService.delete(endpoint));
  }, [makeSecureRequest]);

  const upload = useCallback(async (endpoint, formData) => {
    return makeSecureRequest(() => secureApiService.upload(endpoint, formData));
  }, [makeSecureRequest]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    isRefreshing,
    makeSecureRequest
  };
};
