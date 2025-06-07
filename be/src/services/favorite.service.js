import DBService from './db.service.js';
import Favorite from '../models/favorite.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

class FavoriteService extends DBService {
  constructor() {
    super(Favorite);
  }

  async getUserFavorites(userId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('product_id');
  }

  async addToFavorites(userId, productId) {
    const existing = await this.model.findOne({ user_id: userId, product_id: productId });
    if (existing) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Product already in favorites');
    }
    return await this.create({ user_id: userId, product_id: productId });
  }

  async removeFromFavorites(userId, productId) {
    return await this.model.findOneAndDelete({ user_id: userId, product_id: productId });
  }

  async isFavorite(userId, productId) {
    const favorite = await this.model.findOne({ user_id: userId, product_id: productId });
    return !!favorite;
  }
}

export default FavoriteService; 