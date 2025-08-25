import express from 'express';
import chatController from '../controllers/chat.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware);

// Chat management
router.get('/init', chatController.getOrCreateChat);           // Khởi tạo/lấy chat
router.post('/send', chatController.sendMessage);             // Gửi tin nhắn
router.get('/history', chatController.getChatHistory);        // Lấy lịch sử chat
router.get('/stats', chatController.getChatStats);            // Lấy thống kê

// Chat operations
router.get('/:chatId', chatController.getChatById);           // Lấy chat cụ thể
router.put('/:chatId/close', chatController.closeChat);      // Đóng chat
router.delete('/:chatId', chatController.deleteChat);         // Xóa chat

// Real-time features
router.get('/:chatId/latest', chatController.getLatestMessages); // Lấy tin nhắn mới
router.get('/search', chatController.searchChatHistory);      // Tìm kiếm trong chat

export default router;
