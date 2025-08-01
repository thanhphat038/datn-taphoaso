import Reply from '../models/reply.model.js';

class ReplyService {
  async createReply(replyData) {
    try {
      console.log('=== DEBUG: ReplyService.createReply ===');
      console.log('Input data:', replyData);
      
      const reply = new Reply(replyData);
      console.log('Reply object created:', reply);
      
      const savedReply = await reply.save();
      console.log('Reply saved to database:', savedReply);
      
      const populatedReply = await savedReply.populate('user_id', 'full_name username avatar');
      console.log('Reply populated:', populatedReply);
      
      return populatedReply;
    } catch (error) {
      console.error('Error in createReply:', error);
      throw error;
    }
  }

  async getRepliesByCommentId(commentId, options = {}) {
    try {
      const { page = 1, limit = 10, sort = { create_at: -1 } } = options;
      const skip = (page - 1) * limit;

      const replies = await Reply.find({ comment_id: commentId, is_hidden: false })
        .populate('user_id', 'full_name username avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const total = await Reply.countDocuments({ comment_id: commentId, is_hidden: false });

      return {
        replies,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  async updateReply(replyId, updateData) {
    try {
      const reply = await Reply.findByIdAndUpdate(
        replyId,
        updateData,
        { new: true }
      ).populate('user_id', 'full_name username avatar');
      return reply;
    } catch (error) {
      throw error;
    }
  }

  async deleteReply(replyId) {
    try {
      return await Reply.findByIdAndDelete(replyId);
    } catch (error) {
      throw error;
    }
  }

  async toggleReplyHidden(replyId) {
    try {
      const reply = await Reply.findById(replyId);
      if (!reply) {
        throw new Error('Reply not found');
      }
      reply.is_hidden = !reply.is_hidden;
      return await reply.save();
    } catch (error) {
      throw error;
    }
  }
}

export default new ReplyService(); 