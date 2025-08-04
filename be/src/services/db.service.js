import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import { validateObjectId } from '../utils/validators.js';

import mongoose from 'mongoose';

class DBService {
  constructor(model) {
    this.model = model;
  }

  /**
   * Ép kiểu ObjectId an toàn
   * @param {string} id 
   * @returns {mongoose.Types.ObjectId}
   */
  toObjectId(id) {
  if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
    console.log('Check id:', id, typeof id);
    throw new AppError(ERROR_CODES.INVALID_ID, 'Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
}

  /**
   * Check ObjectId hợp lệ
   * @param {string} id 
   * @returns {boolean}
   */
  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async create(data) {
    try {
      const item = new this.model(data);
      return await item.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(ERROR_CODES.DB_VALIDATION_ERROR, error.message);
      }
      throw error;
    }
  }

  async findById(id, options = {}) {
    try {
      const validationError = validateObjectId(id, 'Resource ID');
      if (validationError) {
        throw new AppError(validationError.code, validationError.message);
      }

      let query = this.model.findById(id);
      
      // If select option is provided, use it
      if (options.select) {
        query = query.select(options.select);
      } else if (this.model.modelName === 'User') {
        query = query.select('-password');
      }

      const item = await query;
      if (!item) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Resource not found');
      }
      return item;
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.error('Database error in findById:', {
          error: error.message,
          code: error.code,
          stack: error.stack
        });
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.DB_ERROR, 'Database error occurred');
    }
  }

  async findOne(filter) {
    return await this.model.findOne(filter);
  }

  async find(filter = {}, options = {}) {
    const { sort = { created_at: -1 }, limit, skip, select, populate } = options;
    
    let query = this.model.find(filter);
    
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    
    return await query;
  }

  async update(id, data) {
    try {
      const validationError = validateObjectId(id, 'Resource ID');
      if (validationError) {
        throw new AppError(validationError.code, validationError.message);
      }

      const item = await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );
      
      if (!item) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Resource not found');
      }
      
      return item;
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.error('Database error in update:', {
          error: error.message,
          code: error.code,
          stack: error.stack
        });
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.DB_ERROR, 'Database error occurred');
    }
  }

  async delete(id) {
    try {
      const validationError = validateObjectId(id, 'Resource ID');
      if (validationError) {
        throw new AppError(validationError.code, validationError.message);
      }

      const item = await this.model.findByIdAndDelete(id);
      if (!item) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Resource not found');
      }
      return item;
    } catch (error) {
      if (!(error instanceof AppError)) {
        console.error('Database error in delete:', {
          error: error.message,
          code: error.code,
          stack: error.stack
        });
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.DB_ERROR, 'Database error occurred');
    }
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter) {
    return await this.model.exists(filter);
  }

  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async bulkWrite(operations) {
    try {
      return await this.model.bulkWrite(operations);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async distinct(field, filter = {}) {
    try {
      return await this.model.distinct(field, filter);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async findOneAndUpdate(filter, update, options = {}) {
    try {
      return await this.model.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
        ...options
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(ERROR_CODES.DB_VALIDATION_ERROR, error.message);
      }
      throw error;
    }
  }

  async findOneAndDelete(filter, options = {}) {
    try {
      return await this.model.findOneAndDelete(filter, options);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async updateMany(filter, update, options = {}) {
    try {
      return await this.model.updateMany(filter, update, {
        runValidators: true,
        ...options
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(ERROR_CODES.DB_VALIDATION_ERROR, error.message);
      }
      throw error;
    }
  }

  async deleteMany(filter) {
    try {
      return await this.model.deleteMany(filter);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async textSearch(searchText, options = {}) {
    try {
      const { filter = {}, ...otherOptions } = options;
      return await this.model.find(
        { $text: { $search: searchText }, ...filter },
        { score: { $meta: 'textScore' } },
        { sort: { score: { $meta: 'textScore' } }, ...otherOptions }
      );
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async createIndexes(indexes) {
    try {
      return await this.model.createIndexes(indexes);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async dropIndex(indexName) {
    try {
      return await this.model.dropIndex(indexName);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async listIndexes() {
    try {
      return await this.model.listIndexes();
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async startSession() {
    try {
      return await this.model.startSession();
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async watch(pipeline = []) {
    try {
      return await this.model.watch(pipeline);
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async findWithPagination(filter = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = { created_at: -1 },
      select,
      populate
    } = options;

    try {
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        this.find(filter, { skip, limit, sort, select, populate }),
        this.count(filter)
      ]);

      return {
        items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }

  async findAll(options = {}) {
    try {
      const { sort = { created_at: -1 }, select, populate } = options;
      
      let query = this.model.find({});
      
      if (sort) query = query.sort(sort);
      if (select) query = query.select(select);
      if (populate) query = query.populate(populate);
      
      return await query;
    } catch (error) {
      throw new AppError(ERROR_CODES.DB_ERROR, error.message);
    }
  }
}

export default DBService; 