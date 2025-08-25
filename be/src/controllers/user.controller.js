import { userService } from '../services/index.js';
import mongoose from 'mongoose';
import { isValidUsername, isValidFullName, isValidPhone, isValidEmail } from '../utils/validators.js';
import {
  created,
  badRequest,
  notFound,
  ok,
  serverError,
  noContent,
  unprocessableEntity
} from '../utils/response.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import { validateObjectId } from '../utils/validators.js';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return badRequest(res, 'Tên đăng nhập và mật khẩu là bắt buộc');
    }

    if (username !== undefined && !isValidUsername(username)) {
      return badRequest(res, 'Tên đăng nhập không hợp lệ');
    }

    if (password !== undefined && !isValidPassword(password)) {
      return badRequest(res, 'Mật khẩu không hợp lệ, phải có ít nhất 6 ký tự, chỉ chứa chữ cái hoặc số');
    }

    const existingUser = await userService.findAll({ username });
    if (existingUser.length > 0) {
      return badRequest(res, 'Tên đăng nhập đã được sử dụng');
    }

    const user = await userService.create({
      username,
      password
    });

    return created(res, user);
  } catch (error) {
    return badRequest(res, error.message);
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await userService.findAll({}, { select: '-password' });
    
    if (!users || users.length === 0) {
      return ok(res, [], 'Không tìm thấy người dùng nào');
    }

    return ok(res, users, 'Lấy danh sách người dùng thành công');
  } catch (error) {
    return serverError(res, 'Lỗi khi lấy danh sách người dùng', error);
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateObjectId(id, 'User ID');
    if (validationError) {
      return badRequest(res, validationError.message);
    }

    const user = await userService.findById(id);
    return ok(res, user, 'Lấy thông tin người dùng thành công');
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error('Server error in getUserById:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
    }
    if (error instanceof AppError) {
      if (error.code === ERROR_CODES.RESOURCE_NOT_FOUND) {
        return notFound(res, error.message);
      }
      return badRequest(res, error.message);
    }
    return serverError(res, 'Lỗi khi lấy thông tin người dùng', error);
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateObjectId(id, 'User ID');
    if (validationError) {
      return badRequest(res, validationError.message);
    }

    const { username, full_name, phone, email, role, status } = req.body;

    if (username !== undefined && !isValidUsername(username)) {
      return badRequest(res, 'Tên đăng nhập không hợp lệ');
    }

    if (full_name !== undefined && !isValidFullName(full_name)) {
      return badRequest(res, 'Họ tên không hợp lệ, quá ngắn hoặc quá dài');
    }

    if (phone !== undefined && !isValidPhone(phone)) {
      return badRequest(res, 'Số điện thoại không hợp lệ');
    }

    if (email !== undefined && !isValidEmail(email)) {
      return badRequest(res, 'Địa chỉ email không hợp lệ');
    }

    // Validate role if provided
    if (role !== undefined && !['user', 'admin'].includes(role)) {
      return badRequest(res, 'Vai trò không hợp lệ. Vai trò phải là "user" hoặc "admin"');
    }

    // Validate status if provided
    if (status !== undefined && !['active', 'inactive'].includes(status)) {
      return badRequest(res, 'Trạng thái không hợp lệ. Trạng thái phải là "active" hoặc "inactive"');
    }

    const user = await userService.update(id, req.body);
    return ok(res, user, 'Cập nhật người dùng thành công');
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error('Server error in updateUser:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
    }
    if (error instanceof AppError) {
      if (error.code === ERROR_CODES.RESOURCE_NOT_FOUND) {
        return notFound(res, error.message);
      }
      return badRequest(res, error.message);
    }
    return serverError(res, 'Lỗi khi cập nhật người dùng', error);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateObjectId(id, 'User ID');
    if (validationError) {
      return badRequest(res, validationError.message);
    }

    await userService.delete(id);
    return noContent(res);
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error('Server error in deleteUser:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
    }
    if (error instanceof AppError) {
      if (error.code === ERROR_CODES.RESOURCE_NOT_FOUND) {
        return notFound(res, error.message);
      }
      return badRequest(res, error.message);
    }
    return serverError(res, 'Lỗi khi xóa người dùng', error);
  }
};

// Deactivate user
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const validationError = validateObjectId(id, 'User ID');
    if (validationError) {
      return badRequest(res, validationError.message);
    }

    const user = await userService.update(id, { status: 'inactive' });
    return ok(res, user, 'Vô hiệu hóa người dùng thành công');
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error('Server error in deactivateUser:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });
    }
    if (error instanceof AppError) {
      if (error.code === ERROR_CODES.RESOURCE_NOT_FOUND) {
        return notFound(res, error.message);
      }
      return badRequest(res, error.message);
    }
    return serverError(res, 'Lỗi khi vô hiệu hóa người dùng', error);
  }
};
