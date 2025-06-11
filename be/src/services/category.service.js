import DBService from './db.service.js';
import Category from '../models/category.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

class CategoryService extends DBService {
  constructor() {
    super(Category);
  }

  async findByName(name) {
    return await this.model.findOne({ name: { $regex: name, $options: 'i' } });
  }

  async create(data) {
    // Check if category name already exists
    const existingCategory = await this.findByName(data.name);
    if (existingCategory) {
      throw new AppError(ERROR_CODES.DB_DUPLICATE_KEY, 'Category name already exists');
    }

    return await super.create(data);
  }

  async getActiveCategories() {
    return await this.model.find({ status: 'active' });
  }

  async updateStatus(id, status) {
    if (!['active', 'inactive'].includes(status)) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Invalid status');
    }
    return await this.update(id, { status });
  }
}

export default CategoryService; 