import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  getCart,
  getCartTotal,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getCart);
router.get('/total', getCartTotal);
router.post('/items', addItemToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/items', clearCart);

export default router;