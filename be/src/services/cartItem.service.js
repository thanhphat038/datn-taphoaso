import DBService from './db.service.js';
import CartItem from '../models/cartItem.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

export default class CartItemService extends DBService {
  constructor() {
    super(CartItem);
  }

  async getCartItems(cartId) {
    return await this.model
      .find({ cart_id: cartId })
      .populate('product_id');
  }

  async addItem(cartId, productId, quantity) {
    // Check if item already exists in cart
    const existingItem = await this.model.findOne({
      cart_id: cartId,
      product_id: productId
    });

    if (existingItem) {
      // Update quantity if item exists
      return await this.update(existingItem._id, {
        quantity: existingItem.quantity + quantity
      });
    }

    // Create new item if not exists
    return await this.create({
      cart_id: cartId,
      product_id: productId,
      quantity
    });
  }

  async updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      return await this.delete(itemId);
    }
    return await this.update(itemId, { quantity });
  }

  async removeItem(itemId) {
    return await this.delete(itemId);
  }

  async clearCart(cartId) {
    return await this.model.deleteMany({ cart_id: cartId });
  }

  async calculateTotal(cartId) {
    const items = await this.model
      .find({ cart_id: cartId })
      .populate('product_id');

    return items.reduce((total, item) => {
      return total + (item.product_id.price * item.quantity);
    }, 0);
  }
} 