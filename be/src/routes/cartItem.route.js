import express from 'express';
import {
  getCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  deleteCartItems
} from '../controllers/cartItem.controller.js';

const router = express.Router();

// Get all cart items
router.get('/', getCartItems);

// Get cart item by id
router.get('/:id', getCartItemById);

// Create new cart item
router.post('/', createCartItem);

// Update cart item
router.put('/:id', updateCartItem);

// Delete cart item
router.delete('/:id', deleteCartItem);

// Delete all items in a cart
router.delete('/cart/:cartId', deleteCartItems);

export default router; 