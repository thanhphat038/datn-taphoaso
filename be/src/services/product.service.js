import DBService from './db.service.js';
import Product from '../models/product.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

class ProductService extends DBService {
  constructor() {
    super(Product);
  }

  async findByCategory(categoryId, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = { created_at: -1 },
      excludeId = null 
    } = options;
    
    const skip = (page - 1) * limit;
    
    const query = { 
      category_id: categoryId, 
      status: 'active' 
    };

    // Exclude current product if specified
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await this.model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async searchProducts(query, options = {}) {
    const { page = 1, limit = 10, sort = { created_at: -1 } } = options;
    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      status: 'active'
    };

    return await this.model
      .find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async updateStock(productId, quantity, operation = 'decrease') {
    const product = await this.findById(productId);
    
    if (operation === 'decrease' && product.stock < quantity) {
      throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);
    }

    const newStock = operation === 'decrease' 
      ? product.stock - quantity 
      : product.stock + quantity;

    return await this.update(productId, { stock: newStock });
  }

  async getTopRated(limit = 10) {
    return await this.model
      .find({ status: 'active' })
      .sort({ 'rating.rate': -1 })
      .limit(limit);
  }

  async getNewArrivals(limit = 10) {
    return await this.model
      .find({ status: 'active' })
      .sort({ created_at: -1 })
      .limit(limit);
  }

  async getRelatedProducts(productId, limit = 4) {
    const product = await this.findById(productId);
    
    return await this.model
      .find({
        category_id: product.category_id,
        _id: { $ne: productId },
        status: 'active'
      })
      .limit(limit);
  }

  async updateStatus(id, status) {
    if (!['active', 'inactive'].includes(status)) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Invalid status');
    }
    return await this.update(id, { status });
  }
}

export default ProductService; 