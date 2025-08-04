import { userService } from './index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class AuthService {
  async login(username, password) {
    try {
      // Find user by username
      const user = await userService.findOne({ username });
      if (!user) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Check if user is active
      if (user.status !== 'active') {
        return {
          success: false,
          message: 'Account is inactive'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role
        }
      };
    } catch (error) {
      throw new Error('Error during login: ' + error.message);
    }
  }

  async getProfile(userId) {
    try {
      const user = await userService.findById(userId, { select: '-password' });
      return user;
    } catch (error) {
      throw new Error('Error getting profile: ' + error.message);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const updatedUser = await userService.updateProfile(userId, updateData);
      if (!updatedUser) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found');
      }
      
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Error updating profile: ' + error.message);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user with password field
      const user = await userService.findById(userId, { select: '+password' });
      if (!user) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'User not found');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Account is inactive');
      }

      // Verify current password
      if (!user.password) {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'User has no password set');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Current password is incorrect');
      }

      // Validate new password
      if (!newPassword || typeof newPassword !== 'string') {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'New password is required and must be a string');
      }

      if (newPassword.length < 6) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'New password must be at least 6 characters long');
      }

      if (newPassword === currentPassword) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'New password must be different from current password');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await userService.update(userId, { password: hashedPassword });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Error in changePassword:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Error changing password');
    }
  }
}

export default AuthService; 