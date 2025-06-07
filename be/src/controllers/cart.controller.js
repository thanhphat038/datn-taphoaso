import { cartService } from '../services/index.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

// Create new cart
export const createCart = async (req, res) => {
  try {
    const cart = await cartService.create(req.body);
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get cart by user id
export const getCartByUserId = async (req, res) => {
  try {
    const cart = await cartService.findOne({ user_id: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json({
      ...cart.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user._id);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, product_id, quantity);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item
export const updateCartItem = async (req, res, next) => {
  try {
    const { item_id } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItem(req.user._id, item_id, quantity);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { item_id } = req.params;
    const cart = await cartService.removeFromCart(req.user._id, item_id);
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user._id);
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get cart total
export const getCartTotal = async (req, res, next) => {
  try {
    const total = await cartService.calculateCartTotal(req.user._id);
    res.json({
      success: true,
      data: { total }
    });
  } catch (error) {
    next(error);
  }
}; 