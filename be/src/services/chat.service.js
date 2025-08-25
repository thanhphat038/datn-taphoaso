import mongoose from 'mongoose';
import Chat from '../models/chat.model.js';
import aiService from './ai.service.js';
import { AppError } from '../errors/AppError.js';

class ChatService {
  // Tạo chat mới hoặc lấy chat hiện tại
  async getOrCreateChat(userId) {
    try {
      let chat = await Chat.findOne({ 
        userId, 
        status: 'active' 
      }).sort({ createdAt: -1 });

      if (!chat) {
        chat = new Chat({
          userId,
          messages: [{
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý ảo của TapHoaSo. Tôi có thể giúp gì cho bạn hôm nay?',
            timestamp: new Date()
          }]
        });
        await chat.save();
      }

      return chat;
    } catch (error) {
      throw new AppError(5001, 'Không thể tạo hoặc lấy chat', 500);
    }
  }

  // Gửi tin nhắn và nhận phản hồi từ AI
  async sendMessage(userId, message) {
    try {
      if (!message || message.trim().length === 0) {
        throw new AppError(2001, 'Tin nhắn không được để trống', 400);
      }

      if (message.length > 1000) {
        throw new AppError(2002, 'Tin nhắn quá dài (tối đa 1000 ký tự)', 400);
      }

      // Lấy hoặc tạo chat
      const chat = await this.getOrCreateChat(userId);

      // Thêm tin nhắn của user
      chat.messages.push({
        role: 'user',
        content: message.trim(),
        timestamp: new Date()
      });

      // Lấy phản hồi từ AI
      const aiResponse = await aiService.generateResponse(
        message.trim(), 
        chat.messages.slice(-10) // Chỉ gửi 10 tin nhắn gần nhất để context
      );

      // Thêm phản hồi của AI
      chat.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      });

      chat.updatedAt = new Date();
      await chat.save();

      return {
        chatId: chat._id,
        messages: chat.messages,
        aiResponse
      };

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(5002, 'Không thể gửi tin nhắn', 500);
    }
  }

  // Lấy lịch sử chat
  async getChatHistory(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id messages status createdAt updatedAt');

      const total = await Chat.countDocuments({ userId });

      return {
        chats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      throw new AppError(5003, 'Không thể lấy lịch sử chat', 500);
    }
  }

  // Lấy chat cụ thể
  async getChatById(userId, chatId) {
    try {
      const chat = await Chat.findOne({ 
        _id: chatId, 
        userId 
      });

      if (!chat) {
        throw new AppError(4001, 'Không tìm thấy chat', 404);
      }

      return chat;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(5004, 'Không thể lấy thông tin chat', 500);
    }
  }

  // Đóng chat
  async closeChat(userId, chatId) {
    try {
      const chat = await Chat.findOne({ 
        _id: chatId, 
        userId 
      });

      if (!chat) {
        throw new AppError(4001, 'Không tìm thấy chat', 404);
      }

      chat.status = 'closed';
      chat.updatedAt = new Date();
      await chat.save();

      return { message: 'Chat đã được đóng thành công' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(5005, 'Không thể đóng chat', 500);
    }
  }

  // Xóa chat
  async deleteChat(userId, chatId) {
    try {
      const result = await Chat.deleteOne({ 
        _id: chatId, 
        userId 
      });

      if (result.deletedCount === 0) {
        throw new AppError(4001, 'Không tìm thấy chat để xóa', 404);
      }

      return { message: 'Chat đã được xóa thành công' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(5006, 'Không thể xóa chat', 500);
    }
  }

  // Lấy thống kê chat
  async getChatStats(userId) {
    try {
      const stats = await Chat.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalChats: { $sum: 1 },
            activeChats: { 
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            totalMessages: { $sum: { $size: '$messages' } }
          }
        }
      ]);

      return stats[0] || {
        totalChats: 0,
        activeChats: 0,
        totalMessages: 0
      };
    } catch (error) {
      throw new AppError(5007, 'Không thể lấy thống kê chat', 500);
    }
  }
}

export default new ChatService();
