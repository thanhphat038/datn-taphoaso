import { HTTP_STATUS, ERROR_MESSAGES, ERROR_DESCRIPTIONS, ERROR_CODES } from './errorDefinitions.js';

export class AppError extends Error {
  constructor(code, message = null, status = null) {
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = message || ERROR_MESSAGES[code] || 'Có lỗi xảy ra';

    super(isProduction ? 'An error occurred' : errorMessage);

    this.code = code;

    // Tự xác định status nếu chưa truyền
    this.status = status || this.mapStatusFromCode(code);

    this.name = 'AppError';
    this.description = ERROR_DESCRIPTIONS[code] || 'Có lỗi xảy ra, vui lòng thử lại sau';
    this.internalMessage = errorMessage;
  }

  mapStatusFromCode(code) {
    if (code >= 1000 && code < 2000) return HTTP_STATUS.UNAUTHORIZED;       // Lỗi xác thực
    if (code >= 2000 && code < 3000) return HTTP_STATUS.BAD_REQUEST;       // Lỗi validate
    if (code >= 3000 && code < 4000) return HTTP_STATUS.CONFLICT;          // Lỗi tài nguyên
    if (code >= 4000 && code < 5000) return HTTP_STATUS.BAD_REQUEST;       // Lỗi nghiệp vụ
    if (code >= 5000 && code < 6000) return HTTP_STATUS.INTERNAL_SERVER_ERROR; // Lỗi DB
    return HTTP_STATUS.INTERNAL_SERVER_ERROR;                              // Mặc định fallback
  }
}
