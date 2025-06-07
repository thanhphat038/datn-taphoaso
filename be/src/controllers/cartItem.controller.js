import { cartItemService } from '../services/index.js';

// Get all cart items
export const getCartItems = async (req, res) => {
  try {
    const { cart_id } = req.query;
    const filters = {};
    if (cart_id) filters.cart_id = cart_id;

    const cartItems = await cartItemService.findAll(filters, {
      populate: 'product_id'
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart item by id
export const getCartItemById = async (req, res) => {
  try {
    const cartItem = await cartItemService.findById(req.params.id, {
      populate: 'product_id'
    });
    res.json(cartItem);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Create new cart item
export const createCartItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity } = req.body;

    // Check if item already exists in cart
    const existingItem = await cartItemService.findOne({
      cart_id,
      product_id
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await cartItemService.update(existingItem._id, {
        quantity: existingItem.quantity + quantity
      });
      res.json(updatedItem);
    } else {
      // Create new cart item
      const newItem = await cartItemService.create({
        cart_id,
        product_id,
        quantity
      });
      res.status(201).json(newItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await cartItemService.update(req.params.id, { quantity });
    res.json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete cart item
export const deleteCartItem = async (req, res) => {
  try {
    await cartItemService.delete(req.params.id);
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete all items in a cart
export const deleteCartItems = async (req, res) => {
  try {
    await cartItemService.deleteMany({ cart_id: req.params.cartId });
    res.json({ message: 'All cart items deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 