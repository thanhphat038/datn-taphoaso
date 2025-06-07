import DBService from './db.service.js';
import User from '../models/user.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
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
    // Check if email or username already exists
    const existingUser = await this.model.findOne({
      $or: [
        { email: data.email },
        { username: data.username }
      ]
    });

    if (existingUser) {
      throw new AppError(ERROR_CODES.DB_DUPLICATE_KEY, 'Email or username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    return await super.create(data);
  }

  async update(id, data) {
    // If updating password, hash it
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    return await super.update(id, data);
  }

  async changePassword(id, oldPassword, newPassword) {
    const user = await this.findById(id);
    
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