import DBService from './db.service.js';
import Cart from '../models/cart.model.js';
import ProductService from './product.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

import '../models/product.model.js'; // Đảm bảo đã đăng ký model Product

const productService = new ProductService();

class CartService extends DBService {
  constructor() {
    super(Cart);
  }

  async getCart(userId) {
    const items = await this.model.find({ user_id: userId }).populate('product_id');

    if (!items.length) return null;

    return { user_id: userId, items };
  }

  async addToCart(userId, productId, qty = 1) {
    if (!productId) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing product_id');
    const product = await productService.findById(productId);
    if (!product) throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Product not found');
    if (product.stock < qty) throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);

    const existingItem = await this.model.findOne({ user_id: userId, product_id: productId });

    if (existingItem) {
      if (product.stock < existingItem.qty + qty) throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);
      existingItem.qty += qty;
      return await existingItem.save();
    }

    return await this.model.create({
      user_id: userId,
      product_id: productId,
      qty,
      price: product.price
    });
  }

  async updateCartItem(userId, productId, qty) {
    if (!productId) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing productId');
    if (qty <= 0) return await this.removeFromCart(userId, productId);

    const product = await productService.findById(productId);
    if (!product) throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Product not found');
    if (product.stock < qty) throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);

    const item = await this.model.findOne({ user_id: userId, product_id: productId });
    if (!item) throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Item not found in cart');

    item.qty = qty;
    return await item.save();
  }

  async removeFromCart(userId, productId) {
    if (!productId) throw new AppError(ERROR_CODES.BAD_REQUEST, 'Missing productId');
    const item = await this.model.findOneAndDelete({ user_id: userId, product_id: productId });
    if (!item) throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Item not found');
    return item;
  }

  async clearCart(userId) {
    return await this.model.deleteMany({ user_id: userId });
  }

  async calculateCartTotal(userId) {
    const items = await this.model.find({ user_id: userId }).populate('product_id');
    return items.reduce((total, item) => {
      const price = item.product_id?.price || item.price;
      return total + (price * item.qty);
    }, 0);
  }
}

export default CartService;