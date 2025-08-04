import { AppError } from '../errors/AppError.js';
import { handleError } from '../errors/handleError.js';

export const globalErrorHandler = (err, req, res, next) => {
  // Log nội bộ (nên log kỹ hơn ở prod)
  console.error(err);

  // Nếu là AppError đã kiểm soát, format theo hệ thống
  if (err instanceof AppError) {
    const formatted = handleError(err);
    return res.status(formatted.status).json({
      message: formatted.message,
      error: formatted
    });
  }

  // Nếu là lỗi Mongo duplicate key (11000)
  if (err.code === 11000) {
    const formatted = handleError(err);
    return res.status(formatted.status).json({
      message: formatted.message,
      error: formatted
    });
  }

  // Các lỗi validation của Mongoose
  if (err.name === 'ValidationError') {
    const formatted = handleError(err);
    return res.status(formatted.status).json({
      message: formatted.message,
      error: formatted
    });
  }

  // Các lỗi khác chưa kiểm soát (500)
  return res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : (err.message || 'Internal Server Error'),
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};
