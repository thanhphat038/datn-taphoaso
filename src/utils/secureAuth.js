import Cookies from 'js-cookie';

// Token storage configuration
const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_DATA_KEY: 'user_data',
  TOKEN_EXPIRY_KEY: 'token_expiry',
  COOKIE_OPTIONS: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: 7, // 7 days
    httpOnly: false // js-cookie doesn't support httpOnly, we'll use secure cookies in production
  }
};

// Token refresh configuration - should match backend config
const REFRESH_CONFIG = {
  THRESHOLD_MINUTES: 15, // Should match TOKEN_REFRESH_THRESHOLD_MINUTES from backend
  BUFFER_SECONDS: 300,   // 5 minutes buffer for edge cases
  CHECK_INTERVAL: 2 * 60 * 1000 // Check every 2 minutes
};

// Token validation
export const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Check if token has correct format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired with buffer time
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    // Add buffer time to prevent edge cases
    return payload.exp > (currentTime + REFRESH_CONFIG.BUFFER_SECONDS);
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

// Get token expiry time
export const getTokenExpiry = (token) => {
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
};

// Check if token is about to expire (using backend config)
export const isTokenExpiringSoon = (token) => {
  if (!token) return false;
  
  const expiry = getTokenExpiry(token);
  if (!expiry) return false;
  
  const currentTime = Date.now();
  const thresholdMs = REFRESH_CONFIG.THRESHOLD_MINUTES * 60 * 1000;
  
  return (expiry - currentTime) < thresholdMs;
};

// Secure token storage
export const setSecureTokens = (accessToken, _refreshToken = null, userData = null) => {
  console.log('[setSecureTokens] called with:', { accessToken, userData });
  
  // Nếu accessToken là null, chỉ clear tokens
  if (!accessToken) {
    console.log('[setSecureTokens] accessToken is null, clearing tokens');
    clearSecureTokens();
    return false;
  }
  
  try {
    sessionStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    
    // Không lưu refresh token ở cookie từ phía frontend
    if (userData) {
      const sanitizedUserData = {
        id: userData.id || userData._id,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        phone: userData.phone,
        gender: userData.gender,
        avatar: userData.avatar
      };
      
      sessionStorage.setItem(TOKEN_CONFIG.USER_DATA_KEY, JSON.stringify(sanitizedUserData));
    }
    console.log('[setSecureTokens] sessionStorage after set:', {
      access_token: sessionStorage.getItem('access_token'),
      user_data: sessionStorage.getItem('user_data')
    });
    
    // Store token expiry
    const expiry = getTokenExpiry(accessToken);
    if (expiry) {
      sessionStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString());
    }
    
    return true;
  } catch (error) {
    console.error('Error setting secure tokens:', error);
    return false;
  }
};

// Get access token securely
export const getAccessToken = async () => {
  try {
    const token = sessionStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    
    if (!token) {
      return null;
    }
    
    // Check if token is valid
    if (!isTokenValid(token)) {
      // Token is expired, try to refresh
      console.log('[getAccessToken] Token expired, attempting refresh');
      return await refreshAccessToken();
    }
    
    // Check if token is expiring soon
    if (isTokenExpiringSoon(token)) {
      console.log('[getAccessToken] Token expiring soon, refreshing proactively');
      return await refreshAccessToken();
    }
    
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = () => {
  try {
    return Cookies.get(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

// Refresh access token with retry mechanism
export const refreshAccessToken = async (retryCount = 0) => {
  const MAX_RETRIES = 2;
  
  try {
    console.log(`[refreshAccessToken] Attempt ${retryCount + 1}/${MAX_RETRIES + 1}`);
    
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Đảm bảo gửi cookie
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('[refreshAccessToken] Success:', data);
      
      const token = data.data?.token;
      const user = data.data?.user;
      
      if (token) {
        console.log('[refreshAccessToken] Setting new tokens');
        setSecureTokens(token, null, user);
        return token;
      } else {
        throw new Error('No token received from refresh endpoint');
      }
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Refresh failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`[refreshAccessToken] Attempt ${retryCount + 1} failed:`, error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`[refreshAccessToken] Retrying in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return refreshAccessToken(retryCount + 1);
    }
    
    // All retries failed
    console.error('[refreshAccessToken] All retry attempts failed');
    clearSecureTokens();
    return null;
  }
};

// Get user data securely
export const getSecureUserData = () => {
  try {
    const userData = sessionStorage.getItem(TOKEN_CONFIG.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Clear all secure tokens
export const clearSecureTokens = () => {
  try {
    // Clear sessionStorage
    sessionStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_CONFIG.USER_DATA_KEY);
    sessionStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Clear cookies
    Cookies.remove(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    Cookies.remove('auth_token');
    
    // Clear all sessionStorage và localStorage nếu cần
    sessionStorage.clear();
    localStorage.clear();
    
    console.log('[clearSecureTokens] All tokens and storage cleared');
  } catch (error) {
    console.error('Error clearing secure tokens:', error);
  }
};

// Check if user is authenticated (sync version for backward compatibility)
export const isAuthenticated = () => {
  try {
    const token = sessionStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    return !!token && isTokenValid(token);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Async version for new implementations
export const isAuthenticatedAsync = async () => {
  const token = await getAccessToken();
  return !!token && isTokenValid(token);
};

// Get auth headers for API calls (sync version for backward compatibility)
export const getSecureAuthHeaders = () => {
  try {
    const token = sessionStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    return token && isTokenValid(token) ? { Authorization: `Bearer ${token}` } : {};
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {};
  }
};

// Async version for new implementations
export const getSecureAuthHeadersAsync = async () => {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auto-refresh token before expiry with improved logic
export const setupTokenRefresh = () => {
  let refreshInterval;
  let focusHandler;
  
  const checkAndRefreshToken = async () => {
    try {
      const token = sessionStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) return;
      
      const expiry = getTokenExpiry(token);
      if (!expiry) return;
      
      const currentTime = Date.now();
      const thresholdMs = REFRESH_CONFIG.THRESHOLD_MINUTES * 60 * 1000;
      
      // Refresh token based on backend config threshold
      if ((expiry - currentTime) < thresholdMs) {
        console.log(`[setupTokenRefresh] Token expiring soon (within ${REFRESH_CONFIG.THRESHOLD_MINUTES} minutes), refreshing...`);
        await refreshAccessToken();
      }
    } catch (error) {
      console.error('[setupTokenRefresh] Error in token refresh check:', error);
    }
  };
  
  const startRefreshInterval = () => {
    // Check based on backend config interval
    refreshInterval = setInterval(checkAndRefreshToken, REFRESH_CONFIG.CHECK_INTERVAL);
  };
  
  const stopRefreshInterval = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  };
  
  const handleFocus = () => {
    // Check token when page gains focus
    checkAndRefreshToken();
  };
  
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Page became visible, check token
      checkAndRefreshToken();
    }
  };
  
  // Start the refresh mechanism
  startRefreshInterval();
  
  // Add event listeners
  focusHandler = handleFocus;
  window.addEventListener('focus', focusHandler);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Return cleanup function
  return () => {
    stopRefreshInterval();
    if (focusHandler) {
      window.removeEventListener('focus', focusHandler);
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

// Validate and sanitize user input
export const sanitizeUserInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 100); // Limit length
};

// Rate limiting for auth attempts
const authAttempts = new Map();
const MAX_ATTEMPTS = 100;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

export const checkAuthRateLimit = (identifier) => {
  const now = Date.now();
  const attempts = authAttempts.get(identifier) || { count: 0, firstAttempt: now };
  
  // Reset if lockout period has passed
  if (now - attempts.firstAttempt > LOCKOUT_TIME) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }
  
  if (attempts.count >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }
  
  attempts.count++;
  authAttempts.set(identifier, attempts);
  return true;
};

export const clearAuthRateLimit = (identifier) => {
  authAttempts.delete(identifier);
}; 