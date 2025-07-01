import DBService from './db.service.js';
import User from '../models/user.model.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import bcrypt from 'bcrypt';

class UserService extends DBService {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async findByUsername(username) {
    return await this.model.findOne({ username });
  }

  async create(data) {
    // Check if username already exists
    const existingUser = await this.model.findOne({ username: data.username });

    if (existingUser) {
      throw new AppError(ERROR_CODES.DB_DUPLICATE_KEY, 'Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    return await super.create(data);
  }

  async update(id, data) {
    // If updating password and it's not already hashed (no $2b$ prefix)
    if (data.password && !data.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    // Use Mongoose's findByIdAndUpdate to update and exclude password
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async changePassword(id, oldPassword, newPassword) {
    const user = await this.findById(id, { select: '+password' });
    
    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Invalid old password');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    return await this.update(id, { password: hashedPassword });
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  async getProfile(id) {
    return await this.model.findById(id).select('-password');
  }

  async updateProfile(id, data) {
    // Don't allow updating email or username through profile update
    delete data.email;
    delete data.username;
    delete data.password;

    return await this.update(id, data);
  }
}

export default UserService; 