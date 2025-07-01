import express from 'express';
import {
  addToFavorite,
  getFavorites,
  getFavoriteById,
  removeFromFavorite
} from '../controllers/favorite.controller.js';

const router = express.Router();

// Create new favorite
router.post('/', addToFavorite);

// Get all favorites
router.get('/', getFavorites);

// Get favorite by id
router.get('/:id', getFavoriteById);

// Delete favorite
router.delete('/:id', removeFromFavorite);

export default router; 