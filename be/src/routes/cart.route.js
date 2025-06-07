import express from 'express';
import {
  createCart,
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// Create new cart
router.post('/', createCart);

// Get cart by user id
router.get('/user/:userId', getCartByUserId);

// Add item to cart
router.post('/items', addToCart);

// Update cart item quantity
router.put('/items/:id', updateCartItem);

// Remove item from cart
router.delete('/items/:id', removeFromCart);

// Clear cart
router.delete('/:cartId/items', clearCart);

export default router; 