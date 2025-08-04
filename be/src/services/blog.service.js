import DBService from './db.service.js';
import Blog from '../models/blog.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class BlogService extends DBService {
  constructor() {
    super(Blog);
  }

  async createBlog(data) {
    return await this.create(data);
  }

  async updateBlog(blogId, data) {
    const blog = await this.findById(blogId);
    if (!blog) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Blog not found');
    }
    return await this.update(blogId, data);
  }

  async deleteBlog(blogId) {
    const blog = await this.findById(blogId);
    if (!blog) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Blog not found');
    }
    return await this.delete(blogId);
  }

  async getAllBlogs(options = {}) {
    const { page = 1, limit = 10, sort = { create_at: -1 } } = options;
    const skip = (page - 1) * limit;
    return await this.model
      .find({})
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getBlogById(blogId) {
    const blog = await this.findById(blogId);
    if (!blog) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Blog not found');
    }
    return blog;
  }

  async getBlogsByCategory(categoryId, options = {}) {
    const { page = 1, limit = 10, sort = { create_at: -1 } } = options;
    const skip = (page - 1) * limit;
    return await this.model
      .find({ blog_category_id: categoryId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }
}

export default BlogService; 