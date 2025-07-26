import { favoriteService } from '../services/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Get all favorites
export const getFavorites = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;

    const favorites = await favoriteService.find(filters, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'product_id', select: 'name price images rating' }
      ]
    });
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

// Get favorite by id
export const getFavoriteById = async (req, res, next) => {
  try {
    const favorite = await favoriteService.findById(req.params.id, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'product_id', select: 'name price images' }
      ]
    });
    if (!favorite) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Favorite not found');
    }
    res.json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// Add Product to favorite
export const addToFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const favorite = await favoriteService.addToFavorites(userId, product_id);

    if (favorite) {
      return res.status(201).json({ success: true, data: favorite });
    } 

    return res.status(200).json({ success: true, message: 'Sản phẩm đã nằm trong mục yêu thích' });

  } catch (error) {
    next(error); 
  }
};

export const removeFromFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const deleted = await favoriteService.removeFromFavorites(userId, productId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm chưa nằm trong mục yêu thích'
      });
    }

    res.json({
      success: true,
      message: 'Sản phẩm đã được xóa khỏi mục yêu thích'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const favorites = await favoriteService.getUserFavorites(req.user.id, { page, limit, sort });
    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};

export const checkFavoriteStatus = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const isFavorite = await favoriteService.checkFavoriteStatus(req.user.id, product_id);
    res.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    next(error);
  }
}; 