import express from 'express';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  toggleReviewHidden
} from '../controllers/review.controller.js';

const router = express.Router();

// Create new review
router.post('/', createReview);

// Get all reviews
router.get('/', getReviews);

// Get review by id
router.get('/:id', getReviewById);

// Update review
router.put('/:id', updateReview);

// Delete review
router.delete('/:id', deleteReview);

// Toggle is_hidden của review
router.patch('/:id/toggle-hidden', toggleReviewHidden);

export default router; 