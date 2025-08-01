import DBService from './db.service.js';
import Favorite from '../models/favorite.model.js';
import mongoose from 'mongoose';

class FavoriteService extends DBService {
  constructor() {
    super(Favorite);
  }
  async find(filters = {}, options = {}) {
    const { populate } = options;
    
    let query = this.model.find(filters);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(pop => {
          query = query.populate(pop);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return await query;
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
    if (existing) return null;
    return this.model.create({ user_id: userId, product_id: productId });
  }

  async removeFromFavorites(userId, productId) {
    const deleted = await this.model.findOneAndDelete({
      user_id: new mongoose.Types.ObjectId(userId),
      product_id: new mongoose.Types.ObjectId(productId)
    });

    if (!deleted) return null;

    return deleted;
  }

  async isFavorite(userId, productId) {
    const favorite = await this.model.findOne({ user_id: userId, product_id: productId });
    return !!favorite;
  }
  
}

export default FavoriteService; 