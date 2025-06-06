import { favoriteService } from '../services/index.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

// Create new favorite
export const createFavorite = async (req, res, next) => {
  try {
    const favorite = await favoriteService.create(req.body);
    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// Get all favorites
export const getFavorites = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;

    const favorites = await favoriteService.findAll(filters, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'product_id', select: 'name price images' }
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

// Delete favorite
export const deleteFavorite = async (req, res, next) => {
  try {
    await favoriteService.delete(req.params.id);
    res.json({
      success: true,
      message: 'Favorite deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const favorite = await favoriteService.addToFavorites(req.user._id, product_id);
    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { product_id } = req.params;
    await favoriteService.removeFromFavorites(req.user._id, product_id);
    res.json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const favorites = await favoriteService.getUserFavorites(req.user._id, { page, limit, sort });
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
    const isFavorite = await favoriteService.checkFavoriteStatus(req.user._id, product_id);
    res.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    next(error);
  }
}; 