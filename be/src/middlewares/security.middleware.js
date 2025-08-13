import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sanitizeUserInput } from '../utils/validators.js';

// Global rate limit configuration
const RATE_LIMIT_MAX = 1000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Rate limiting configuration
export const createRateLimiter = (windowMs = RATE_LIMIT_WINDOW_MS, max = RATE_LIMIT_MAX) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limiters
export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: RATE_LIMIT_MAX, // 1000 attempts per window
  message: {
    message: 'Too many authentication attempts, please try again later.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true,
});

export const apiRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: RATE_LIMIT_MAX, // 1000 requests per window
  message: {
    message: 'Too many API requests, please try again later.',
    code: 'API_RATE_LIMIT_EXCEEDED'
  },
});

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeUserInput(req.body[key]);
        }
      });
    }

    // Sanitize query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeUserInput(req.query[key]);
        }
      });
    }

    // Sanitize URL parameters
    if (req.params) {
      Object.keys(req.params).forEach(key => {
        if (typeof req.params[key] === 'string') {
          req.params[key] = sanitizeUserInput(req.params[key]);
        }
      });
    }

    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    next();
  }
};

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  frameguard: { action: 'deny' }
});

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate key error'
    });
  }
  
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};

// Authentication check middleware
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }
  next();
};

// Role-based access control
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Request size limiting
export const requestSizeLimit = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'], 10);
    const maxSize = parseInt(limit.replace('mb', '')) * 1024 * 1024;
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        message: 'Request entity too large'
      });
    }
    
    next();
  };
}; 