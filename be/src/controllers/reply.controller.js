import replyService from '../services/reply.service.js';
import { AppError } from '../errors/AppError.js';
import { handleError } from '../errors/handleError.js';

export const createReply = async (req, res, next) => {
  try {
    const { comment_id, reply } = req.body;
    const user_id = req.user.id;

    console.log('=== DEBUG: Creating reply ===');
    console.log('Comment ID:', comment_id);
    console.log('Reply content:', reply);
    console.log('User ID:', user_id);

    if (!comment_id || !reply) {
      throw new AppError('Comment ID và nội dung trả lời là bắt buộc', 400);
    }

    const replyData = {
      user_id,
      comment_id,
      reply
    };

    console.log('Reply data to save:', replyData);

    const newReply = await replyService.createReply(replyData);
    
    console.log('Reply saved successfully:', newReply);
    
    res.status(201).json({
      success: true,
      message: 'Trả lời đã được tạo thành công',
      data: newReply
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    handleError(error, req, res, next);
  }
};

export const getRepliesByCommentId = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { page, limit, sort } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sort || { created_at: -1 }
    };

    const result = await replyService.getRepliesByCommentId(commentId, options);
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách trả lời thành công',
      data: result
    });
  } catch (error) {
    handleError(error, req, res, next);
  }
};

// Test endpoint để kiểm tra tất cả replies trong database
export const getAllReplies = async (req, res, next) => {
  try {
    const Reply = (await import('../models/reply.model.js')).default;
    const allReplies = await Reply.find({}).populate('user_id', 'full_name username avatar');
    
    console.log('All replies in database:', allReplies);
    
    res.status(200).json({
      success: true,
      message: 'Tất cả replies trong database',
      data: allReplies
    });
  } catch (error) {
    console.error('Error getting all replies:', error);
    handleError(error, req, res, next);
  }
};

export const updateReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const user_id = req.user.id;

    if (!reply) {
      throw new AppError('Nội dung trả lời là bắt buộc', 400);
    }

    const updatedReply = await replyService.updateReply(id, { reply });
    
    if (!updatedReply) {
      throw new AppError('Không tìm thấy trả lời', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trả lời thành công',
      data: updatedReply
    });
  } catch (error) {
    handleError(error, req, res, next);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedReply = await replyService.deleteReply(id);
    
    if (!deletedReply) {
      throw new AppError('Không tìm thấy trả lời', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Xóa trả lời thành công'
    });
  } catch (error) {
    handleError(error, req, res, next);
  }
};

export const toggleReplyHidden = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedReply = await replyService.toggleReplyHidden(id);
    
    if (!updatedReply) {
      throw new AppError('Không tìm thấy trả lời', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái ẩn/hiện trả lời thành công',
      data: updatedReply
    });
  } catch (error) {
    handleError(error, req, res, next);
  }
}; 

// Thêm endpoint test này vào reply.controller.js
export const testReplies = async (req, res, next) => {
  try {
    console.log('=== TEST REPLIES ENDPOINT ===');
    
    const Reply = (await import('../models/reply.model.js')).default;
    const allReplies = await Reply.find({})
      .populate('user_id', 'full_name username avatar')
      .populate('comment_id', 'comment');
    
    console.log('Total replies in database:', allReplies.length);
    allReplies.forEach((reply, index) => {
      console.log(`Reply ${index + 1}:`, {
        id: reply._id,
        comment_id: reply.comment_id?._id,
        comment_content: reply.comment_id?.comment,
        reply_content: reply.reply,
        user: reply.user_id?.full_name,
        created: reply.created_at
      });
    });
    
    res.status(200).json({
      success: true,
      message: 'Test replies endpoint',
      data: allReplies
    });
  } catch (error) {
    console.error('Error in testReplies:', error);
    handleError(error, req, res, next);
  }
}; 

// Thêm function này
export const testRepliesCollection = async (req, res, next) => {
  try {
    console.log('=== TEST REPLIES COLLECTION ===');
    
    const Reply = (await import('../models/reply.model.js')).default;
    
    // Kiểm tra collection có tồn tại không
    const collections = await Reply.db.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Đếm số documents trong collection replies
    const count = await Reply.countDocuments({});
    console.log('Total replies in collection:', count);
    
    // Lấy tất cả replies
    const allReplies = await Reply.find({});
    console.log('All replies:', allReplies);
    
    // Kiểm tra replies có comment_id không
    allReplies.forEach((reply, index) => {
      console.log(`Reply ${index + 1}:`, {
        id: reply._id,
        comment_id: reply.comment_id,
        reply: reply.reply,
        user_id: reply.user_id,
        created: reply.created_at
      });
    });
    
    res.status(200).json({
      success: true,
      message: 'Test replies collection',
      data: {
        collectionExists: collections.some(c => c.name === 'replies'),
        totalReplies: count,
        replies: allReplies
      }
    });
  } catch (error) {
    console.error('Error in testRepliesCollection:', error);
    handleError(error, req, res, next);
  }
}; 