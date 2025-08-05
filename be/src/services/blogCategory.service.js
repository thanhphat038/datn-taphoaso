import DBService from './db.service.js';
import BlogCategory from '../models/blogCategory.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class BlogCategoryService extends DBService {
  constructor() {
    super(BlogCategory);
  }

  async findByName(name) {
    return await this.model.findOne({ name: { $regex: name, $options: 'i' } });
  }

  async create(data) {
    // Check if blog category name already exists
    const existingCategory = await this.findByName(data.name);
    if (existingCategory) {
      throw new AppError(ERROR_CODES.DB_DUPLICATE_KEY, 'Blog category name already exists');
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

export default BlogCategoryService; 