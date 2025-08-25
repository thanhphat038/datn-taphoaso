import secureApiService from './secureApi.service.js';

class ChatService {
  // Khởi tạo hoặc lấy chat hiện tại
  async initChat() {
    try {
      const response = await secureApiService.get('/chat/init');
      return response;
    } catch (error) {
      console.error('Error initializing chat:', error);
      throw error;
    }
  }

  // Gửi tin nhắn
  async sendMessage(message) {
    try {
      const response = await secureApiService.post('/chat/send', { message });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Lấy lịch sử chat
  async getChatHistory(page = 1, limit = 20) {
    try {
      const response = await secureApiService.get('/chat/history', { page, limit });
      return response;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  // Lấy thống kê chat
  async getChatStats() {
    try {
      const response = await secureApiService.get('/chat/stats');
      return response;
    } catch (error) {
      console.error('Error getting chat stats:', error);
      throw error;
    }
  }

  // Lấy chat cụ thể
  async getChatById(chatId) {
    try {
      const response = await secureApiService.get(`/chat/${chatId}`);
      return response;
    } catch (error) {
      console.error('Error getting chat:', error);
      throw error;
    }
  }

  // Đóng chat
  async closeChat(chatId) {
    try {
      const response = await secureApiService.put(`/chat/${chatId}/close`);
      return response;
    } catch (error) {
      console.error('Error closing chat:', error);
      throw error;
    }
  }

  // Xóa chat
  async deleteChat(chatId) {
    try {
      const response = await secureApiService.delete(`/chat/${chatId}`);
      return response;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  // Lấy tin nhắn mới nhất
  async getLatestMessages(chatId, lastMessageId) {
    try {
      const params = lastMessageId ? { lastMessageId } : {};
      const response = await secureApiService.get(`/chat/${chatId}/latest`, params);
      return response;
    } catch (error) {
      console.error('Error getting latest messages:', error);
      throw error;
    }
  }

  // Tìm kiếm trong chat history
  async searchChatHistory(query, page = 1, limit = 20) {
    try {
      const response = await secureApiService.get('/chat/search', { query, page, limit });
      return response;
    } catch (error) {
      console.error('Error searching chat history:', error);
      throw error;
    }
  }
}

export default new ChatService();
