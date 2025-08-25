import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../config/index.js';
import { userService } from './index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

class AuthService {
  async login(username, password) {
    try {
      // Find user with password field
      const user = await userService.findOne({ username }, { select: '+password' });
      if (!user) {
        return {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
        };
      }

      // Check if user is active
      if (user.status !== 'active') {
        return {
          success: false,
          message: 'Tài khoản không hoạt động'
        };
      }

      // Verify password
      if (!user.password) {
        return {
          success: false,
          message: 'Người dùng chưa thiết lập mật khẩu'
        };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
        };
      }

      // Generate JWT tokens using global config
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );
      
      const refreshToken = jwt.sign(
        { id: user._id, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      return {
        success: true,
        accessToken,
        refreshToken,
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
      throw new Error('Lỗi khi đăng nhập: ' + error.message);
    }
  }

  async getProfile(userId) {
    try {
      const user = await userService.findById(userId, { select: '-password' });
      return user;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin hồ sơ: ' + error.message);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const updatedUser = await userService.updateProfile(userId, updateData);
      if (!updatedUser) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Không tìm thấy người dùng');
      }
      
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new Error('Lỗi khi cập nhật hồ sơ: ' + error.message);
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user with password field
      const user = await userService.findById(userId, { select: '+password' });
      if (!user) {
        throw new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, 'Không tìm thấy người dùng');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Tài khoản không hoạt động');
      }

      // Verify current password
      if (!user.password) {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Người dùng chưa thiết lập mật khẩu');
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        throw new AppError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 'Mật khẩu hiện tại không chính xác');
      }

      // Validate new password
      if (!newPassword || typeof newPassword !== 'string') {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Mật khẩu mới là bắt buộc và phải là chuỗi ký tự');
      }

      if (newPassword.length < 6) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Mật khẩu mới phải có ít nhất 6 ký tự');
      }

      if (newPassword === currentPassword) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Mật khẩu mới phải khác với mật khẩu hiện tại');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await userService.changePassword(userId, currentPassword, newPassword);

      return {
        success: true,
        message: 'Thay đổi mật khẩu thành công'
      };
    } catch (error) {
      console.error('Error in changePassword:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Lỗi khi thay đổi mật khẩu');
    }
  }
}

export default AuthService; 