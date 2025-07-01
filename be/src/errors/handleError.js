import { AppError } from './AppError.js';
import { ERROR_CODES, ERROR_MESSAGES, ERROR_DESCRIPTIONS, HTTP_STATUS } from './errorDefinitions.js';

export const handleError = (error) => {
  
  // Lỗi do chính bạn chủ động throw AppError
  if (error instanceof AppError) {
    return {
      success: false,
      status: error.status,
      code: error.code,
      message: error.message,
      description: error.description
    };
  }

  // Lỗi validate của Mongoose
  if (error.name === 'ValidationError') {
    return {
      success: false,
      status: HTTP_STATUS.BAD_REQUEST,
      code: ERROR_CODES.DB_VALIDATION_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.DB_VALIDATION_ERROR],
      description: ERROR_DESCRIPTIONS[ERROR_CODES.DB_VALIDATION_ERROR]
    };
  }

  // Lỗi trùng key trong MongoDB
  if (error.code === 11000) {
    return {
      success: false,
      status: HTTP_STATUS.CONFLICT,
      code: ERROR_CODES.DB_DUPLICATE_KEY,
      message: ERROR_MESSAGES[ERROR_CODES.DB_DUPLICATE_KEY],
      description: ERROR_DESCRIPTIONS[ERROR_CODES.DB_DUPLICATE_KEY]
    };
  }

  // Lỗi chưa kiểm soát - fallback
  return {
    success: false,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: ERROR_CODES.BUSINESS_INVALID_OPERATION,
    message: ERROR_MESSAGES[ERROR_CODES.BUSINESS_INVALID_OPERATION],
    description: ERROR_DESCRIPTIONS[ERROR_CODES.BUSINESS_INVALID_OPERATION]
  };
};
