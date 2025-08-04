import DBService from './db.service.js';
import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class ReviewService extends DBService {
  constructor() {
    super(Review);
  }

  async createReview(userId, productId, data) {
    // Check if user has already reviewed this product
    const existingReview = await this.model.findOne({
      user_id: userId,
      product_id: productId
    });

    if (existingReview) {
      throw new AppError(ERROR_CODES.BUSINESS_DUPLICATE_REVIEW);
    }

    const review = await this.create({
      user_id: userId,
      product_id: productId,
      ...data
    });

    // Update product rating
    await this.updateProductRating(productId);

    return review;
  }

  async updateReview(reviewId, userId, data) {
    const review = await this.findById(reviewId);
    
    if (!review) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Review not found');
    }

    if (review.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    const updatedReview = await this.update(reviewId, data);

    // Update product rating
    await this.updateProductRating(review.product_id);

    return updatedReview;
  }

  async deleteReview(reviewId, userId) {
    const review = await this.findById(reviewId);
    
    if (!review) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Review not found');
    }

    if (review.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    await this.delete(reviewId);

    // Update product rating
    await this.updateProductRating(review.product_id);
  }

  async getProductReviews(productId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.model
        .find({ product_id: productId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'name email'),
      this.model.countDocuments({ product_id: productId })
    ]);

    return {
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserReviews(userId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ user_id: userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('product_id', 'name images');
  }

  async updateProductRating(productId) {
    const stats = await this.model.aggregate([
      { $match: { product_id: productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: {
          rate: Math.round(stats[0].averageRating * 10) / 10,
          count: stats[0].totalReviews
        }
      });
    }
  }
}

export default ReviewService; 