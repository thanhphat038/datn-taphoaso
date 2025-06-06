import express from 'express';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
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

export default router; 