import mongoose from 'mongoose';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return typeof username === 'string' && usernameRegex.test(username);
}

export const isValidPassword = (password) => {
  const passwordRegex = /^[a-zA-Z\d]{6,}$/;
  return typeof password === 'string' && passwordRegex.test(password);
};

export const isValidFullName = (fullName) => {
  return typeof fullName === 'string' && fullName.length >= 5 && fullName.length <= 50;
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return typeof phone === 'string' && phoneRegex.test(phone);
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate MongoDB ObjectId and return error response if invalid
 * @param {string} id - ID to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object|null} Error response object if invalid, null if valid
 */
export const validateObjectId = (id, fieldName = 'ID') => {
  if (!id) {
    return {
      status: 400,
      message: `${fieldName} is required`,
      code: ERROR_CODES.VALIDATION_ERROR
    };
  }
  
  if (!isValidObjectId(id)) {
    return {
      status: 400,
      message: `Invalid ${fieldName} format`,
      code: ERROR_CODES.VALIDATION_ERROR
    };
  }
  
  return null;
};