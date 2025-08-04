import { reviewService } from '../services/index.js';

// Create new review
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, content } = req.body;
    const review = await reviewService.create({
      user_id: req.user.id,
      product_id,
      rating,
      user_review: content
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const { user_id, product_id } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;
    if (product_id) filters.product_id = product_id;

    const reviews = await reviewService.findAll(filters, {
      populate: [
        { path: 'user_id', select: 'username email full_name' },
        { path: 'product_id', select: 'name price images' }
      ]
    });
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get review by id
export const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.findById(req.params.id, {
      populate: [
        { path: 'user_id', select: 'username email full_name' },
        { path: 'product_id', select: 'name price images' }
      ]
    });
    res.json(review);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { content, ...rest } = req.body;
    const review = await reviewService.update(req.params.id, {
      ...rest,
      ...(content && { user_review: content })
    });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    await reviewService.delete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy review theo productId (hỗ trợ phân trang)
export const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await reviewService.getProductReviews(productId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle is_hidden của review
export const toggleReviewHidden = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await reviewService.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const newHiddenState = !review.is_hidden;
    const updated = await reviewService.update(id, { is_hidden: newHiddenState });

    res.json({
      message: `Review visibility updated: now ${newHiddenState ? 'hidden' : 'visible'}.`,
      data: updated
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
