import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/index.js';
import { userService } from '../services/index.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is not a refresh token
    if (decoded.type === 'refresh') {
      return res.status(401).json({
        message: 'Invalid token type.'
      });
    }
    
    // Check if user exists and is active
    const user = await userService.findById(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        message: 'User not found or inactive.'
      });
    }

    req.user = {
      id: user._id,
      role: user.role
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      message: 'Invalid token.'
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: 'Access denied. Admin role required.'
    });
  }
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      message: 'Access denied. User role required.'
    });
  }
};
