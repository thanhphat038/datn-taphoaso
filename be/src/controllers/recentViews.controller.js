import RecentViewsService from '../services/recentViews.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

const recentViewsService = new RecentViewsService();

// Thêm sản phẩm vào danh sách xem gần đây
export const addView = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // Lấy từ middleware auth

    if (!productId) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'ID sản phẩm là bắt buộc');
    }

    const result = await recentViewsService.addView(userId, productId);
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// Lấy danh sách sản phẩm xem gần đây
export const getRecentViews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const recentViews = await recentViewsService.getRecentViewsWithDetails(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: recentViews
    });
  } catch (err) {
    next(err);
  }
};

// Xóa một sản phẩm khỏi danh sách xem gần đây
export const removeView = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const result = await recentViewsService.removeView(userId, productId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

// Xóa tất cả sản phẩm khỏi danh sách xem gần đây
export const clearAllViews = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await recentViewsService.clearAllViews(userId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

// Lấy số lượng sản phẩm xem gần đây
export const getViewCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const count = await recentViewsService.getViewCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (err) {
    next(err);
  }
};

// Lấy sản phẩm tương tự
export const getSimilarProducts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { limit = 5 } = req.query;

    if (!productId) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'ID sản phẩm là bắt buộc');
    }

    const similarProducts = await recentViewsService.getSimilarProducts(
      userId, 
      productId, 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: similarProducts
    });
  } catch (err) {
    next(err);
  }
}; 