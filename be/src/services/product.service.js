import DBService from './db.service.js';
import Product from '../models/product.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class ProductService extends DBService {
  constructor() {
    super(Product);
  }

  async findById(productId, options = {}) {
    const objectId = this.toObjectId(productId);
    const item = await this.model.findById(objectId);

    if (!item) {
      throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Product not found');
    }

    return item;
  }

  async findByCategory(categoryId, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      sort = { created_at: -1 },
      excludeId = null 
    } = options;
    
    const skip = (page - 1) * limit;
    
    // Convert categoryId to ObjectId if it's a string
    let categoryObjectId;
    try {
      categoryObjectId = this.toObjectId(categoryId);
    } catch (error) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid category ID format');
    }
    
    const query = { 
      category_id: categoryObjectId, 
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

  async updateStock(productId, qty, operation = 'decrease') {
    const product = await this.findById(productId);
    
    if (operation === 'decrease' && product.in_stock < qty) {
      throw new AppError(ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK);
    }

    const newStock = operation === 'decrease' 
      ? product.in_stock - qty 
      : product.in_stock + qty;

    return await this.update(productId, { in_stock: newStock });
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