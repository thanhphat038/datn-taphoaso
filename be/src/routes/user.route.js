import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Create new user (public)
router.post('/', createUser);

// Admin only routes
router.get('/', authMiddleware, isAdmin, getUsers);
router.get('/:id', authMiddleware, isAdmin, getUserById);
router.put('/:id', authMiddleware, isAdmin, updateUser);
router.delete('/:id', authMiddleware, isAdmin, deleteUser);

export default router;
