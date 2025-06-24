import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';
import { userService, authService } from '../services/index.js';

import { isValidFullName, isValidPhone, isValidEmail } from '../utils/validators.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

import { 
  created, 
  badRequest, 
  unauthorized, 
  notFound, 
  ok, 
  serverError,
  unprocessableEntity 
} from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { username, password, full_name, email, phone } = req.body;

    // Check if username already exists
    const existingUser = await userService.findOne({ username });
    if (existingUser) {
      return badRequest(res, 'User already exists with this username');
    }

    // Validate full_name if provided
    if (full_name) {
      const trimmedName = full_name.trim();

      if (!trimmedName) {
        return badRequest(res, 'Full name cannot be empty');
      }

      const fullNameValidation = isValidFullName(trimmedName);
      if (fullNameValidation !== true) {
        // `isValidFullName` returns error message string if invalid
        return unprocessableEntity(res, fullNameValidation);
      }

      req.body.full_name = trimmedName;
    }

    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      return badRequest(res, 'Invalid phone number. Please enter 10 digits');
    }

    // Validate email if provided
    if (email) {
      if (!isValidEmail(email)) {
        return badRequest(res, 'Invalid email format');
      }

      const existingEmail = await userService.findOne({ email });
      if (existingEmail) {
        return badRequest(res, 'Email is already in use');
      }
    }

    // Create new user
    const user = await userService.create({
      username,
      password,
      full_name: req.body.full_name,
      email,
      phone,
      role: 'user',
      status: 'active'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return created(res, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
      },
      token
    }, 'User registered successfully');
  } catch (error) {
    return serverError(res, 'Error registering user', error);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return badRequest(res, 'Username and password are required');
    }

    const result = await authService.login(username, password);
    
    if (!result.success) {
      return unauthorized(res, result.message);
    }

    return ok(res, {
      token: result.token,
      user: result.user
    }, 'Login successful');
  } catch (error) {
    return serverError(res, 'Error during login', error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    
    if (!user) {
      return notFound(res, 'User profile not found');
    }

    return ok(res, user, 'Profile retrieved successfully');
  } catch (error) {
    return serverError(res, 'Error retrieving profile', error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, email } = req.body;
    const updateData = {};

    // Validate full_name if provided
    if (full_name) {
      const trimmedName = full_name.trim();
      
      if (!trimmedName) {
        return badRequest(res, 'Full name cannot be empty');
      }

      if (trimmedName.length < 2) {
        return badRequest(res, 'Full name must be at least 2 characters long');
      }

      if (trimmedName.length > 50) {
        return unprocessableEntity(res, 'Full name must not exceed 50 characters', {
          currentLength: trimmedName.length,
          maxLength: 50
        });
      }

      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(trimmedName)) {
        return badRequest(res, 'Full name can only contain letters, spaces and Vietnamese characters');
      }

      if (/\s{2,}/.test(trimmedName)) {
        return badRequest(res, 'Full name cannot contain consecutive spaces');
      }

      updateData.full_name = trimmedName;
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return badRequest(res, 'Invalid phone number. Please enter 10 digits');
      }
      updateData.phone = phone;
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return badRequest(res, 'Invalid email format');
      }

      // Check if email is already used by another user
      const existingEmail = await userService.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingEmail) {
        return badRequest(res, 'Email is already in use');
      }
      updateData.email = email;
    }

    const updatedUser = await authService.updateProfile(userId, updateData);
    
    if (!updatedUser) {
      return notFound(res, 'User not found');
    }

    return ok(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    return serverError(res, 'Error updating profile', error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return unauthorized(res, 'User not authenticated');
    }

    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return badRequest(res, 'Current password and new password are required');
    }

    // Validate password types
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return badRequest(res, 'Passwords must be strings');
    }

    // Validate password lengths
    if (currentPassword.length < 6 || newPassword.length < 6) {
      return badRequest(res, 'Passwords must be at least 6 characters long');
    }

    // Validate that passwords are different
    if (currentPassword === newPassword) {
      return badRequest(res, 'New password must be different from current password');
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);
    return ok(res, null, result.message);
  } catch (error) {
    console.error('Error in changePassword controller:', error);
    if (error instanceof AppError) {
      return badRequest(res, error.message);
    }
    return serverError(res, 'Error changing password', error);
  }
}; 