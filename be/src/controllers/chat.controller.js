import chatService from '../services/chat.service.js';
import { AppError } from '../errors/AppError.js';
import { ok, created } from '../utils/response.js';

class ChatController {
  // Khởi tạo chat mới hoặc lấy chat hiện tại
  async getOrCreateChat(req, res, next) {
    try {
      const userId = req.user.id;
      const chat = await chatService.getOrCreateChat(userId);
      
      ok(res, {
        chatId: chat._id,
        messages: chat.messages,
        status: chat.status
      }, 'Lấy chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Gửi tin nhắn
  async sendMessage(req, res, next) {
    try {
      const userId = req.user.id;
      const { message } = req.body;

      if (!message) {
        throw new AppError(2001, 'Tin nhắn không được để trống', 400);
      }

      const result = await chatService.sendMessage(userId, message);
      
      ok(res, {
        chatId: result.chatId,
        aiResponse: result.aiResponse,
        messages: result.messages
      }, 'Gửi tin nhắn thành công');
    } catch (error) {
      next(error);
    }
  }

  // Lấy lịch sử chat
  async getChatHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const result = await chatService.getChatHistory(
        userId, 
        parseInt(page), 
        parseInt(limit)
      );
      
      ok(res, result, 'Lấy lịch sử chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Lấy chat cụ thể
  async getChatById(req, res, next) {
    try {
      const userId = req.user.id;
      const { chatId } = req.params;

      const chat = await chatService.getChatById(userId, chatId);
      
      ok(res, chat, 'Lấy thông tin chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Đóng chat
  async closeChat(req, res, next) {
    try {
      const userId = req.user.id;
      const { chatId } = req.params;

      const result = await chatService.closeChat(userId, chatId);
      
      ok(res, result, 'Đóng chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Xóa chat
  async deleteChat(req, res, next) {
    try {
      const userId = req.user.id;
      const { chatId } = req.params;

      const result = await chatService.deleteChat(userId, chatId);
      
      ok(res, result, 'Xóa chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Lấy thống kê chat
  async getChatStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await chatService.getChatStats(userId);
      
      ok(res, stats, 'Lấy thống kê chat thành công');
    } catch (error) {
      next(error);
    }
  }

  // Lấy tin nhắn mới nhất (cho real-time updates)
  async getLatestMessages(req, res, next) {
    try {
      const userId = req.user.id;
      const { chatId } = req.params;
      const { lastMessageId } = req.query;

      const chat = await chatService.getChatById(userId, chatId);
      
      let newMessages = chat.messages;
      if (lastMessageId) {
        const lastMessageIndex = chat.messages.findIndex(
          msg => msg._id.toString() === lastMessageId
        );
        if (lastMessageIndex !== -1) {
          newMessages = chat.messages.slice(lastMessageIndex + 1);
        }
      }
      
      ok(res, {
        chatId: chat._id,
        newMessages,
        hasNewMessages: newMessages.length > 0
      }, 'Lấy tin nhắn mới thành công');
    } catch (error) {
      next(error);
    }
  }

  // Tìm kiếm trong chat history
  async searchChatHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const { query, page = 1, limit = 20 } = req.query;

      if (!query || query.trim().length === 0) {
        throw new AppError(2003, 'Từ khóa tìm kiếm không được để trống', 400);
      }

      // TODO: Implement search functionality
      // const searchResults = await chatService.searchChatHistory(userId, query, page, limit);
      
      ok(res, {
        message: 'Tính năng tìm kiếm đang được phát triển',
        query,
        results: []
      }, 'Tìm kiếm thành công');
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
