import express from 'express';
import {
  createReply,
  getRepliesByCommentId,
  getAllReplies,
  updateReply,
  deleteReply,
  toggleReplyHidden,
  testReplies,
  testRepliesCollection
} from '../controllers/reply.controller.js';

const router = express.Router();

// Tạo trả lời mới (cần đăng nhập)
router.post('/', createReply);

// Lấy danh sách trả lời theo comment ID
router.get('/comment/:commentId', getRepliesByCommentId);

// Test endpoint - lấy tất cả replies
router.get('/all', getAllReplies);

// Test endpoint - kiểm tra replies trong database
router.get('/test', testReplies);

// Test endpoint - kiểm tra collection replies
router.get('/test-collection', testRepliesCollection);

// Cập nhật trả lời (cần đăng nhập)
router.put('/:id', updateReply);

// Xóa trả lời (cần đăng nhập)
router.delete('/:id', deleteReply);

// Toggle ẩn/hiện trả lời (cần đăng nhập)
router.patch('/:id/toggle-hidden', toggleReplyHidden);

export default router; 