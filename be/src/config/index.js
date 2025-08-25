import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ESLint: process is available in Node.js environment
/* global process */

// Function to require environment variables
function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

// Function to validate time format (e.g., '15m', '2h', '7d')
function validateTimeFormat(timeStr, name) {
  if (!timeStr || typeof timeStr !== 'string') {
    throw new Error(`Invalid ${name}: must be a string`);
  }
  
  const timeRegex = /^(\d+)(s|m|h|d)$/;
  if (!timeRegex.test(timeStr)) {
    throw new Error(`Invalid ${name} format: must be in format like '15m', '2h', '7d'`);
  }
  
  return timeStr;
}

// Function to validate number
function validateNumber(value, name, min = 0) {
  const num = parseInt(value);
  if (isNaN(num) || num < min) {
    throw new Error(`Invalid ${name}: must be a number >= ${min}`);
  }
  return num;
}

// Server Configuration
export const PORT = requireEnv('PORT');
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Database Configuration
export const MONGODB_URI = requireEnv('MONGODB_URI');

// JWT Configuration
export const JWT_SECRET = requireEnv('JWT_SECRET');

// JWT Token Configuration - All required from .env
export const ACCESS_TOKEN_EXPIRES_IN = validateTimeFormat(requireEnv('ACCESS_TOKEN_EXPIRES_IN'), 'ACCESS_TOKEN_EXPIRES_IN');
export const REFRESH_TOKEN_EXPIRES_IN = validateTimeFormat(requireEnv('REFRESH_TOKEN_EXPIRES_IN'), 'REFRESH_TOKEN_EXPIRES_IN');
export const RESET_PASSWORD_TOKEN_EXPIRES_IN = validateTimeFormat(requireEnv('RESET_PASSWORD_TOKEN_EXPIRES_IN'), 'RESET_PASSWORD_TOKEN_EXPIRES_IN');

// Token Refresh Configuration
export const TOKEN_REFRESH_THRESHOLD_MINUTES = validateNumber(requireEnv('TOKEN_REFRESH_THRESHOLD_MINUTES'), 'TOKEN_REFRESH_THRESHOLD_MINUTES', 1);

// Cookie Configuration
export const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Security Configuration
export const PASSWORD_MIN_LENGTH = validateNumber(requireEnv('PASSWORD_MIN_LENGTH'), 'PASSWORD_MIN_LENGTH', 6);
export const MAX_LOGIN_ATTEMPTS = validateNumber(requireEnv('MAX_LOGIN_ATTEMPTS'), 'MAX_LOGIN_ATTEMPTS', 1);
export const LOGIN_LOCKOUT_DURATION = validateNumber(requireEnv('LOGIN_LOCKOUT_DURATION'), 'LOGIN_LOCKOUT_DURATION', 1);

// Frontend URLs - All required from .env
export const FRONTEND_URL = requireEnv('FRONTEND_URL');
export const BASE_URL = requireEnv('BASE_URL');

// VNPay Configuration
export const VNP_TMN_CODE = requireEnv('VNP_TMN_CODE');
export const VNP_HASH_SECRET = requireEnv('VNP_HASH_SECRET');
export const VNP_URL = requireEnv('VNP_URL');
export const VNP_RETURN_URL = requireEnv('VNP_RETURN_URL');
export const VNP_API = requireEnv('VNP_API');

// Email Configuration (if using email service)
export const SMTP_HOST = requireEnv('SMTP_HOST');
export const SMTP_PORT = validateNumber(requireEnv('SMTP_PORT'), 'SMTP_PORT', 1);
export const SMTP_USER = requireEnv('SMTP_USER');
export const SMTP_PASS = requireEnv('SMTP_PASS');

// File Upload Configuration
export const MAX_FILE_SIZE = validateNumber(requireEnv('MAX_FILE_SIZE'), 'MAX_FILE_SIZE', 1024); // Minimum 1KB
export const UPLOAD_PATH = requireEnv('UPLOAD_PATH');

// ChromaDB Configuration (optional)
export const CHROMA_URL = 'http://localhost:8000';

// LLM Configuration (optional, OpenAI-compatible)
export const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://fleet-toucan-refined.ngrok-free.app/v1';
export const LLM_MODEL = process.env.LLM_MODEL || 'gpt-3.5-turbo';
export const LLM_API_KEY = process.env.LLM_API_KEY || ''; // optional for LM Studio

// Validate all configurations on startup
export function validateConfig() {
  try {
    // Validate time formats
    validateTimeFormat(ACCESS_TOKEN_EXPIRES_IN, 'ACCESS_TOKEN_EXPIRES_IN');
    validateTimeFormat(REFRESH_TOKEN_EXPIRES_IN, 'REFRESH_TOKEN_EXPIRES_IN');
    validateTimeFormat(RESET_PASSWORD_TOKEN_EXPIRES_IN, 'RESET_PASSWORD_TOKEN_EXPIRES_IN');
    
    // Validate numbers
    validateNumber(TOKEN_REFRESH_THRESHOLD_MINUTES, 'TOKEN_REFRESH_THRESHOLD_MINUTES', 1);
    validateNumber(PASSWORD_MIN_LENGTH, 'PASSWORD_MIN_LENGTH', 6);
    validateNumber(MAX_LOGIN_ATTEMPTS, 'MAX_LOGIN_ATTEMPTS', 1);
    validateNumber(LOGIN_LOCKOUT_DURATION, 'LOGIN_LOCKOUT_DURATION', 1);
    validateNumber(SMTP_PORT, 'SMTP_PORT', 1);
    validateNumber(MAX_FILE_SIZE, 'MAX_FILE_SIZE', 1024);
    
    // Validate URLs
    if (!FRONTEND_URL.startsWith('http')) {
      throw new Error('FRONTEND_URL must start with http:// or https://');
    }
    if (!BASE_URL.startsWith('http')) {
      throw new Error('BASE_URL must start with http:// or https://');
    }
    
    console.log('✅ All configuration validated successfully');
    return true;
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
    throw error;
  }
}

// Export config object for backward compatibility
export const config = {
  server: {
    port: PORT,
    nodeEnv: NODE_ENV,
  },
  database: {
    mongoUri: MONGODB_URI,
  },
  jwt: {
    secret: JWT_SECRET,
    accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
    resetPasswordTokenExpiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN,
    refreshThresholdMinutes: TOKEN_REFRESH_THRESHOLD_MINUTES,
  },
  security: {
    passwordMinLength: PASSWORD_MIN_LENGTH,
    maxLoginAttempts: MAX_LOGIN_ATTEMPTS,
    loginLockoutDuration: LOGIN_LOCKOUT_DURATION,
  },
  urls: {
    frontend: FRONTEND_URL,
    backend: BASE_URL,
  },
  vnpay: {
    tmnCode: VNP_TMN_CODE,
    hashSecret: VNP_HASH_SECRET,
    url: VNP_URL,
    returnUrl: VNP_RETURN_URL,
    api: VNP_API,
  },
  email: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  upload: {
    maxFileSize: MAX_FILE_SIZE,
    path: UPLOAD_PATH,
  },
  chroma: {
    url: CHROMA_URL,
  },
  llm: {
    baseUrl: LLM_BASE_URL,
    model: LLM_MODEL,
    apiKey: LLM_API_KEY,
  },
};
