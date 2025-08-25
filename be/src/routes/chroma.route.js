import express from 'express';
import chromaController from '../controllers/chroma.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Health
router.get('/health', chromaController.health);

// Admin protected for mutating routes
router.post('/upsert', authMiddleware, isAdmin, chromaController.upsert);
router.post('/query', authMiddleware, chromaController.query);
router.post('/delete', authMiddleware, isAdmin, chromaController.remove);

// Sync products into Chroma (admin)
router.post('/sync/products', authMiddleware, isAdmin, chromaController.syncProducts);

export default router;
