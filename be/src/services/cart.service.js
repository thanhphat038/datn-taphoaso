import DBService from './db.service.js';
import Cart from '../models/cart.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
import productService from './product.service.js';

class CartService extends DBService {
  constructor() {
    super(Cart);
  }

  async getOrCreateCart(userId) {
    let cart = await this.model.findOne({ user_id: userId });
    
    if (!cart) {
      cart = await this.create({
        user_id: userId,
        items: []
      });
    }

    return cart;
  }

  async addToCart(userId, productId, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const product = await productService.findById(productId);

    if (!product) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Product not found');
    }

    if (product.stock < quantity) {
      throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);
    }

    const existingItem = cart.items.find(item => item.product_id.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product_id: productId,
        quantity,
        price: product.price
      });
    }

    return await cart.save();
  }

  async updateCartItem(userId, productId, quantity) {
    const cart = await this.getOrCreateCart(userId);
    const product = await productService.findById(productId);

    if (!product) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Product not found');
    }

    if (product.stock < quantity) {
      throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);
    }

    const item = cart.items.find(item => item.product_id.toString() === productId);
    
    if (!item) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Item not found in cart');
    }

    item.quantity = quantity;
    return await cart.save();
  }

  async removeFromCart(userId, productId) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter(item => item.product_id.toString() !== productId);
    return await cart.save();
  }

  async clearCart(userId) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    return await cart.save();
  }

  async calculateCartTotal(userId) {
    const cart = await this.getOrCreateCart(userId);
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export default CartService; 