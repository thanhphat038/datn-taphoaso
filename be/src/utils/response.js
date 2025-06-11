/**
 * RESTful API Response Handler
 * Follows REST API best practices and standard HTTP status codes
 */

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sanitize error message for production
 * @param {Error} error - Error object
 * @returns {string} Sanitized error message
 */
const sanitizeError = (error) => {
  if (isProduction) {
    if (error instanceof Error) {
      return 'An error occurred';
    }
    return 'Invalid request';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    return error.message || 'Invalid request data';
  }
  
  return 'Invalid request';
};

/**
 * Base response structure
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {*} meta - Additional metadata
 * @returns {Object} Formatted response
 */
const formatResponse = (res, status, data = null, message = null, meta = null) => {
  const response = {
    status,
    timestamp: new Date().toISOString()
  };

  // Add request tracking
  if (res.locals.requestId) {
    response.requestId = res.locals.requestId;
  }

  // Add message if provided
  if (message) {
    response.message = message;
  }

  // Add data if provided
  if (data !== null) {
    response.data = data;
  }

  // Add metadata if provided
  if (meta) {
    response.meta = meta;
  }

  return response;
};

/**
 * 200 OK - Success
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {*} meta - Additional metadata
 */
export const ok = (res, data = null, message = 'Success', meta = null) => {
  const response = formatResponse(res, 200, data, message, meta);
  return res.status(200).json(response);
};

/**
 * 201 Created - Resource created
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
export const created = (res, data, message = 'Resource created successfully') => {
  const response = formatResponse(res, 201, data, message);
  return res.status(201).json(response);
};

/**
 * 204 No Content - Success without response body
 * @param {Object} res - Express response object
 */
export const noContent = (res) => {
  return res.status(204).end();
};

/**
 * 400 Bad Request - Invalid request
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Validation errors
 */
export const badRequest = (res, message = 'Bad request', errors = null) => {
  const response = formatResponse(res, 400, null, isProduction ? 'Invalid request' : message);
  
  if (!isProduction && errors) {
    response.errors = errors;
  }

  return res.status(400).json(response);
};

/**
 * 401 Unauthorized - Authentication required
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const unauthorized = (res, message = 'Unauthorized') => {
  const response = formatResponse(res, 401, null, isProduction ? 'Authentication required' : message);
  return res.status(401).json(response);
};

/**
 * 403 Forbidden - Permission denied
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const forbidden = (res, message = 'Forbidden') => {
  const response = formatResponse(res, 403, null, isProduction ? 'Permission denied' : message);
  return res.status(403).json(response);
};

/**
 * 404 Not Found
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const notFound = (res, message = 'Resource not found') => {
  const response = formatResponse(res, 404, null, isProduction ? 'Resource not found' : message);
  return res.status(404).json(response);
};

/**
 * 409 Conflict - Resource conflict
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} data - Conflict details
 */
export const conflict = (res, message = 'Resource conflict', data = null) => {
  const response = formatResponse(res, 409, data, message);
  return res.status(409).json(response);
};

/**
 * 422 Unprocessable Entity - Validation error
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Validation errors
 */
export const unprocessableEntity = (res, message = 'Validation failed', errors = null) => {
  const response = formatResponse(res, 422, null, isProduction ? 'Validation failed' : message);
  
  if (!isProduction && errors) {
    response.errors = errors;
  }

  return res.status(422).json(response);
};

/**
 * 429 Too Many Requests - Rate limit exceeded
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const tooManyRequests = (res, message = 'Too many requests') => {
  const response = formatResponse(res, 429, null, message);
  return res.status(429).json(response);
};

/**
 * 500 Internal Server Error
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} error - Error object
 */
export const serverError = (res, message = 'Internal server error', error = null) => {
  const response = formatResponse(res, 500, null, isProduction ? 'Internal server error' : message);

  if (!isProduction && error) {
    response.error = {
      message: error.message,
      stack: error.stack,
      code: error.code
    };
  }

  if (isProduction && error) {
    // Log error in production
    console.error({
      message: error.message,
      stack: error.stack,
      code: error.code,
      requestId: res.locals.requestId
    });
  }

  return res.status(500).json(response);
};

/**
 * 503 Service Unavailable
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const serviceUnavailable = (res, message = 'Service temporarily unavailable') => {
  const response = formatResponse(res, 503, null, message);
  return res.status(503).json(response);
}; 