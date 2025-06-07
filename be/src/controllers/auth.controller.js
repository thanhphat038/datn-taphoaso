import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/index.js';
import { userService } from '../services/index.js';

export const register = async (req, res) => {
  try {
    const { username, password, email, full_name, phone } = req.body;

    // Check if user already exists
    const existingUser = await userService.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = await userService.create({
      username,
      password,
      email,
      full_name,
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

    res.status(201).json({
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await userService.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(400).json({
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(`Comparing password for user ${password}-${user.password} : ${isValidPassword}`, );
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await userService.findById(req.user.id, { select: '-password' });
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      data: user,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving profile',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    const user = await userService.update(req.user.id, { full_name, phone });

    res.json({
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userService.update(req.user.id, { password: hashedPassword });

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error changing password',
      error: error.message
    });
  }
}; 