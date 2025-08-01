import { commentService } from '../services/index.js';
import Reply from '../models/reply.model.js';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

// Create new comment
export const createComment = async (req, res, next) => {
  try {
    const { product_id, comment } = req.body;
    if (!product_id || !comment) {
      return res.status(400).json({ message: 'Thiếu product_id hoặc comment' });
    }
    const newComment = await commentService.createComment(req.user.id, product_id, { comment });
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments
export const getComments = async (req, res, next) => {
  try {
    const { user_id, product_id } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (product_id) filters.product_id = product_id;

    const comments = await commentService.model.find(filters)
      .populate('user_id', 'full_name avatar username');
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// Get comment by id
export const getCommentById = async (req, res, next) => {
  try {
    const comment = await commentService.findById(req.params.id, {
      populate: [
        { path: 'user_id', select: 'name email' },
        { path: 'product_id', select: 'name' }
      ]
    });
    if (!comment) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Comment not found');
    }
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// Update comment
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await commentService.updateComment(commentId, req.user.id, req.body);
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await commentService.deleteComment(id, req.user.id, req.user.role);
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getProductComments = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page, limit, sort } = req.query;
    const options = { page: parseInt(page) || 1, limit: parseInt(limit) || 10, sort: sort || { created_at: -1 } };
    const comments = await commentService.getProductComments(productId, options);
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

export const getUserComments = async (req, res, next) => {
  try {
    const { page, limit, sort } = req.query;
    const comments = await commentService.getUserComments(req.user.id, { page, limit, sort });
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentReplies = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { page, limit, sort } = req.query;
    const replies = await commentService.getCommentReplies(commentId, { page, limit, sort });
    res.json({
      success: true,
      data: replies
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả comment của một productId (không phân trang)
export const getAllCommentOfProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    
    console.log('=== DEBUG: getAllCommentOfProductId ===');
    console.log('Product ID:', productId);
    
    // Lấy comments
    const comments = await commentService.model.find({ product_id: productId })
      .populate('user_id', 'full_name avatar username')
      .sort({ create_at: -1 });
    
    console.log('Comments found:', comments.length);
    
    // Lấy replies cho mỗi comment
    const commentsWithReplies = [];
    
    for (let comment of comments) {
      try {
        console.log(`Processing comment: ${comment._id}`);
        
        // Tìm replies cho comment này
        const replies = await Reply.find({ 
          comment_id: comment._id,
          is_hidden: false 
        }).populate('user_id', 'full_name username avatar')
        .sort({ create_at: 1 });
        
        console.log(`Found ${replies.length} replies for comment ${comment._id}`);
        
        // Chuyển đổi thành plain object
        const commentObj = comment.toObject();
        commentObj.replies = replies.map(reply => reply.toObject());
        
        commentsWithReplies.push(commentObj);
      } catch (error) {
        console.error(`Error processing replies for comment ${comment._id}:`, error);
        const commentObj = comment.toObject();
        commentObj.replies = [];
        commentsWithReplies.push(commentObj);
      }
    }
    
    console.log('=== FINAL RESULT ===');
    console.log('Total comments with replies:', commentsWithReplies.length);
    commentsWithReplies.forEach((comment, index) => {
      console.log(`Comment ${index + 1}:`, {
        id: comment._id,
        content: comment.comment,
        repliesCount: comment.replies?.length || 0,
        replies: comment.replies?.map(r => ({ id: r._id, content: r.reply })) || []
      });
    });
    
    res.json({
      success: true,
      data: commentsWithReplies
    });
  } catch (error) {
    console.error('Error in getAllCommentOfProductId:', error);
    next(error);
  }
};

// Toggle is_hidden của comment
export const toggleCommentHidden = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await commentService.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newHiddenState = !comment.is_hidden;
    const updated = await commentService.update(id, { is_hidden: newHiddenState });

    res.json({
      message: `Comment visibility updated: now ${newHiddenState ? 'hidden' : 'visible'}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};