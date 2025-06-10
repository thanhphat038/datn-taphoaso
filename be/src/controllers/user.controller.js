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
import { AppError, ERROR_CODES } from '../utils/error.js';
import { validateObjectId } from '../utils/validators.js';

// Create new user
export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return badRequest(res, 'Username and password are required');
    }

    if (username !== undefined && !isValidUsername(username)) {
      return badRequest(res, 'Invalid username');
    }

    if (password !== undefined && !isValidPassword(password)) {
      return badRequest(res, 'Invalid password, must be at least 6 characters long, only letters or numbers');
    }

    const existingUser = await userService.findAll({ username });
    if (existingUser.length > 0) {
      return badRequest(res, 'Username already taken');
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
      return ok(res, [], 'No users found');
    }

    return ok(res, users, 'Users retrieved successfully');
  } catch (error) {
    return serverError(res, 'Error retrieving users', error);
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
    return ok(res, user, 'User retrieved successfully');
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
    return serverError(res, 'Error retrieving user', error);
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

    const { username, full_name, phone, email } = req.body;

    if (username !== undefined && !isValidUsername(username)) {
      return badRequest(res, 'Invalid username');
    }

    if (full_name !== undefined && !isValidFullName(full_name)) {
      return badRequest(res, 'Invalid full name, too short or too long');
    }

    if (phone !== undefined && !isValidPhone(phone)) {
      return badRequest(res, 'Invalid phone number');
    }

    if (email !== undefined && !isValidEmail(email)) {
      return badRequest(res, 'Invalid email address');
    }

    const user = await userService.update(id, req.body);
    return ok(res, user, 'User updated successfully');
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
    return serverError(res, 'Error updating user', error);
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
    return serverError(res, 'Error deleting user', error);
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
    return ok(res, user, 'User deactivated successfully');
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
    return serverError(res, 'Error deactivating user', error);
  }
};
