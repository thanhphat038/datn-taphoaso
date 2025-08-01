import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  resetPassword,
  forgotPassword
} from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);

router.put('/change-password', authMiddleware, changePassword);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router; 