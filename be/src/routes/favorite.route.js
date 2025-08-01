import express from 'express';
import {
  addToFavorite,
  getFavorites,
  getFavoriteById,
  removeFromFavorite
} from '../controllers/favorite.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create new favorite
router.post('/', authMiddleware, addToFavorite);

// Get all favorites
router.get('/', authMiddleware, getFavorites);

// Get favorite by id
router.get('/:id', authMiddleware, getFavoriteById);

// Delete favorite
router.delete('/', authMiddleware, removeFromFavorite);

export default router; 