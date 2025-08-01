import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';
import { userService, authService } from '../services/index.js';
import { sendForgotPasswordEmail } from '../services/mailler/emailService.js';

import { isValidFullName, isValidPhone, isValidEmail } from '../utils/validators.js';
import { hashPassword } from '../utils/hash.js'; 

import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

import { 
  created, 
  badRequest, 
  unauthorized, 
  notFound, 
  ok, 
  serverError,
  unprocessableEntity 
} from '../utils/response.js';

const BASE_URL = 'http://localhost:3000'; 
const FE_BASE_URL = 'http://localhost:5173 '; 

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
    const { username, full_name, phone, email, gender } = req.body;
    
    console.log('🔍 Debug - Update Profile Request:', {
      userId,
      body: req.body,
      username,
      full_name,
      phone,
      email,
      gender
    });
    
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

      const nameRegex = /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(trimmedName)) {
        return badRequest(res, 'Full name can only contain letters, numbers, spaces and Vietnamese characters');
      }

      if (/\s{2,}/.test(trimmedName)) {
        return badRequest(res, 'Full name cannot contain consecutive spaces');
      }

      updateData.full_name = trimmedName;
    }

    // Validate phone if provided
    if (phone) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phone)) {
        return badRequest(res, 'Invalid phone number. Please enter 10-11 digits');
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

    // Validate username if provided
    if (username) {
      const trimmedUsername = username.trim();
      
      if (!trimmedUsername) {
        return badRequest(res, 'Username cannot be empty');
      }

      if (trimmedUsername.length < 3) {
        return badRequest(res, 'Username must be at least 3 characters long');
      }

      if (trimmedUsername.length > 20) {
        return unprocessableEntity(res, 'Username must not exceed 20 characters');
      }

      // Check if username is already used by another user
      const existingUsername = await userService.findOne({ 
        username: trimmedUsername, 
        _id: { $ne: userId } 
      });
      
      if (existingUsername) {
        return badRequest(res, 'Username is already in use');
      }
      updateData.username = trimmedUsername;
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ['male', 'female', 'other'];
      if (!validGenders.includes(gender)) {
        return badRequest(res, 'Invalid gender value');
      }
      updateData.gender = gender;
    }

    console.log('🔍 Debug - Final updateData:', updateData);
    
    const updatedUser = await authService.updateProfile(userId, updateData);
    
    if (!updatedUser) {
      return notFound(res, 'User not found');
    }

    console.log('🔍 Debug - Updated user:', updatedUser);
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


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return badRequest(res, 'Token and new password are required');
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return badRequest(res, 'New password must be at least 6 characters long');
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return badRequest(res, 'Invalid or expired token');
    }

    const user = await userService.findById(payload.id);
    if (!user) {
      return notFound(res, 'User not found');
    }

    // Nếu lưu resetPasswordToken vào DB, kiểm tra khớp token:
    if (user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return badRequest(res, 'Token is invalid or expired');
    }

    const hashedPassword = hashPassword(newPassword);

    await userService.update(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined
    });

    return ok(res, null, 'Password has been reset successfully');

  } catch (error) {
    console.error('Error resetting password:', error);
    return serverError(res, 'Error resetting password', error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return badRequest(res, 'Email is required');
    }

    if (!isValidEmail(email)) {
      return badRequest(res, 'Invalid email format');
    }

    const user = await userService.findOne({ email });
    if (!user) {
      return notFound(res, 'No user found with this email');
    }

    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });

    // Lưu token vào DB (tuỳ hệ thống, có thể skip bước này nếu chỉ kiểm tra token trực tiếp)
    await userService.update(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: Date.now() + 15 * 60 * 1000 // 15 phút
    });

    // Tạo link reset
    const resetLink = `${FE_BASE_URL}/reset-password?token=${resetToken}`;

    // Gửi email
    await sendForgotPasswordEmail({
      to: email,
      name: user.name || '',
      resetLink
    });

    return ok(res, null, 'Password reset link has been sent to your email');
    
  } catch (error) {
    console.error('Forgot password error:', error);
    return serverError(res, 'Error processing forgot password', error);
  }
};