import DBService from './db.service.js';
import Comment from '../models/comment.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';


class CommentService extends DBService {
  constructor() {
    super(Comment);
  }

  async createComment(userId, productId, data) {
    return await this.create({
      user_id: userId,
      product_id: productId,
      ...data
    });
  }

  async updateComment(commentId, userId, data) {
    const comment = await this.findById(commentId);
    
    if (!comment) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Comment not found');
    }

    if (comment.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    return await this.update(commentId, data);
  }

  async deleteComment(commentId, userId) {
    const comment = await this.findById(commentId);
    
    if (!comment) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Comment not found');
    }

    if (comment.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    return await this.delete(commentId);
  }

  async getProductComments(productId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ product_id: productId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username');
  }

  async getUserComments(userId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ user_id: userId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('product_id', 'name images');
  }

  async getCommentReplies(commentId, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: 1 } } = options;
    const skip = (page - 1) * limit;

    return await this.model
      .find({ parent_id: commentId })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'username');
  }
}

export default CommentService; 