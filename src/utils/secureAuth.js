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

// Token validation
export const isTokenValid = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Check if token has correct format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp > currentTime;
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

// Secure token storage
export const setSecureTokens = (accessToken, refreshToken = null, userData = null) => {
  if (!accessToken) return false;
  
  try {
    // Store access token in memory (sessionStorage) for better security
    sessionStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    
    // Store refresh token in httpOnly cookie if available
    if (refreshToken) {
      Cookies.set(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken, TOKEN_CONFIG.COOKIE_OPTIONS);
    }
    
    // Store user data securely
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
    if (!token || !isTokenValid(token)) {
      // Token is invalid or expired, try to refresh
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

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSecureTokens();
      return null;
    }
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setSecureTokens(data.token, data.refreshToken, data.user);
        return data.token;
      }
    }
    
    // Refresh failed, clear tokens
    clearSecureTokens();
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
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
    sessionStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_CONFIG.USER_DATA_KEY);
    sessionStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    Cookies.remove(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    
    // Also clear legacy tokens for backward compatibility
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    Cookies.remove('auth_token');
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

// Auto-refresh token before expiry
export const setupTokenRefresh = () => {
  const checkAndRefreshToken = async () => {
    const token = sessionStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    if (token) {
      const expiry = getTokenExpiry(token);
      const currentTime = Date.now();
      
      // Refresh token 5 minutes before expiry
      if (expiry && (expiry - currentTime) < 5 * 60 * 1000) {
        await refreshAccessToken();
      }
    }
  };
  
  // Check every minute
  setInterval(checkAndRefreshToken, 60 * 1000);
  
  // Also check on page focus
  window.addEventListener('focus', checkAndRefreshToken);
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
const MAX_ATTEMPTS = 5;
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