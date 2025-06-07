import express from 'express';
import {
  createFavorite,
  getFavorites,
  getFavoriteById,
  deleteFavorite
} from '../controllers/favorite.controller.js';

const router = express.Router();

// Create new favorite
router.post('/', createFavorite);

// Get all favorites
router.get('/', getFavorites);

// Get favorite by id
router.get('/:id', getFavoriteById);

// Delete favorite
router.delete('/:id', deleteFavorite);

export default router; 