import { clearSecureTokens } from './secureAuth';

// API Error Handler Utility
export class ApiError extends Error {
  constructor(message, status, code, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Handle different types of API errors
export const handleApiError = (error, response = null) => {
  console.error('[ApiErrorHandler] Error:', error);
  console.error('[ApiErrorHandler] Response:', response);

  // If it's already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Handle fetch errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new ApiError(
      'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
      0,
      'NETWORK_ERROR'
    );
  }

  // Handle response errors
  if (response) {
    const status = response.status;
    
    switch (status) {
      case 400:
        return new ApiError(
          'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
          status,
          'BAD_REQUEST'
        );
      
      case 401:
        // Clear tokens for authentication errors
        clearSecureTokens();
        return new ApiError(
          'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          status,
          'UNAUTHORIZED'
        );
      
      case 403:
        return new ApiError(
          'Bạn không có quyền truy cập tài nguyên này.',
          status,
          'FORBIDDEN'
        );
      
      case 404:
        return new ApiError(
          'Tài nguyên không tồn tại.',
          status,
          'NOT_FOUND'
        );
      
      case 409:
        return new ApiError(
          'Xung đột dữ liệu. Vui lòng kiểm tra lại.',
          status,
          'CONFLICT'
        );
      
      case 422:
        return new ApiError(
          'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
          status,
          'UNPROCESSABLE_ENTITY'
        );
      
      case 429:
        return new ApiError(
          'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
          status,
          'TOO_MANY_REQUESTS'
        );
      
      case 500:
        return new ApiError(
          'Lỗi máy chủ. Vui lòng thử lại sau.',
          status,
          'INTERNAL_SERVER_ERROR'
        );
      
      case 502:
        return new ApiError(
          'Máy chủ không phản hồi. Vui lòng thử lại sau.',
          status,
          'BAD_GATEWAY'
        );
      
      case 503:
        return new ApiError(
          'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
          status,
          'SERVICE_UNAVAILABLE'
        );
      
      default:
        return new ApiError(
          `Lỗi không xác định (${status}). Vui lòng thử lại sau.`,
          status,
          'UNKNOWN_ERROR'
        );
    }
  }

  // Handle generic errors
  if (error.message) {
    return new ApiError(
      error.message,
      0,
      'GENERIC_ERROR'
    );
  }

  // Fallback error
  return new ApiError(
    'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
    0,
    'UNKNOWN_ERROR'
  );
};

// Parse error response from API
export const parseErrorResponse = async (response) => {
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return {
        message: errorData.message || errorData.error || 'Unknown error',
        code: errorData.code || errorData.error_code,
        details: errorData.details || errorData.errors || {}
      };
    } else {
      const errorText = await response.text();
      return {
        message: errorText || 'Unknown error',
        code: null,
        details: {}
      };
    }
  } catch (parseError) {
    console.error('[ApiErrorHandler] Error parsing error response:', parseError);
    return {
      message: 'Error parsing response',
      code: null,
      details: {}
    };
  }
};

// Create user-friendly error messages
export const getUserFriendlyMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error.message) {
    // Map common error messages to user-friendly ones
    const messageMap = {
      'Network Error': 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
      'Request timeout': 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',
      'Token expired': 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      'Authentication failed': 'Xác thực thất bại. Vui lòng đăng nhập lại.',
      'Access denied': 'Bạn không có quyền truy cập tài nguyên này.',
      'Resource not found': 'Tài nguyên không tồn tại.',
      'Validation failed': 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
      'Server error': 'Lỗi máy chủ. Vui lòng thử lại sau.',
      'Too many requests': 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
    };
    
    return messageMap[error.message] || error.message;
  }
  
  return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
};

// Log error for debugging
export const logError = (error, context = '') => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  };
  
  if (error instanceof ApiError) {
    errorInfo.status = error.status;
    errorInfo.code = error.code;
    errorInfo.details = error.details;
  }
  
  console.error('[ApiErrorHandler] Error logged:', errorInfo);
  
  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
  
  return errorInfo;
};

// Retry mechanism for transient errors
export const shouldRetry = (error, attempt = 0) => {
  const MAX_ATTEMPTS = 3;
  
  if (attempt >= MAX_ATTEMPTS) {
    return false;
  }
  
  // Retry on network errors and 5xx server errors
  if (error instanceof ApiError) {
    return error.status >= 500 || error.status === 0;
  }
  
  // Retry on network errors
  return error.name === 'TypeError' && error.message.includes('fetch');
};

// Delay function for retry
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
