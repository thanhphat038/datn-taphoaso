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