import express from 'express';
import {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  getAllCommentOfProductId,
  toggleCommentHidden
} from '../controllers/comment.controller.js';

const router = express.Router();

// Create new comment
router.post('/', createComment);

// Get all comments
router.get('/', getComments);

// Get comment by id
router.get('/:id', getCommentById);

// Update comment
router.put('/:id', updateComment);

// Delete comment
router.delete('/:id', deleteComment);

// Toggle is_hidden của comment
router.patch('/:id/toggle-hidden', toggleCommentHidden);

router.get('/product/:productId/all-comments', getAllCommentOfProductId);

export default router; 