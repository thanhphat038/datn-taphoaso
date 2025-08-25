#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Validating environment configuration...\n');

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

// Function to validate URL format
function validateUrl(value, name) {
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    throw new Error(`Invalid ${name}: must start with http:// or https://`);
  }
  return value;
}

try {
  console.log('📋 Checking required environment variables...\n');

  // Server Configuration
  console.log('✅ PORT:', requireEnv('PORT'));
  console.log('✅ NODE_ENV:', process.env.NODE_ENV || 'development');

  // Database Configuration
  console.log('✅ MONGODB_URI:', requireEnv('MONGODB_URI'));

  // JWT Configuration
  console.log('✅ JWT_SECRET:', requireEnv('JWT_SECRET') ? '***configured***' : '❌ missing');

  // JWT Token Configuration
  console.log('✅ ACCESS_TOKEN_EXPIRES_IN:', validateTimeFormat(requireEnv('ACCESS_TOKEN_EXPIRES_IN'), 'ACCESS_TOKEN_EXPIRES_IN'));
  console.log('✅ REFRESH_TOKEN_EXPIRES_IN:', validateTimeFormat(requireEnv('REFRESH_TOKEN_EXPIRES_IN'), 'REFRESH_TOKEN_EXPIRES_IN'));
  console.log('✅ RESET_PASSWORD_TOKEN_EXPIRES_IN:', validateTimeFormat(requireEnv('RESET_PASSWORD_TOKEN_EXPIRES_IN'), 'RESET_PASSWORD_TOKEN_EXPIRES_IN'));

  // Token Refresh Configuration
  console.log('✅ TOKEN_REFRESH_THRESHOLD_MINUTES:', validateNumber(requireEnv('TOKEN_REFRESH_THRESHOLD_MINUTES'), 'TOKEN_REFRESH_THRESHOLD_MINUTES', 1));

  // Security Configuration
  console.log('✅ PASSWORD_MIN_LENGTH:', validateNumber(requireEnv('PASSWORD_MIN_LENGTH'), 'PASSWORD_MIN_LENGTH', 6));
  console.log('✅ MAX_LOGIN_ATTEMPTS:', validateNumber(requireEnv('MAX_LOGIN_ATTEMPTS'), 'MAX_LOGIN_ATTEMPTS', 1));
  console.log('✅ LOGIN_LOCKOUT_DURATION:', validateNumber(requireEnv('LOGIN_LOCKOUT_DURATION'), 'LOGIN_LOCKOUT_DURATION', 1));

  // URL Configuration
  console.log('✅ FRONTEND_URL:', validateUrl(requireEnv('FRONTEND_URL'), 'FRONTEND_URL'));
  console.log('✅ BASE_URL:', validateUrl(requireEnv('BASE_URL'), 'BASE_URL'));

  // VNPay Configuration
  console.log('✅ VNP_TMN_CODE:', requireEnv('VNP_TMN_CODE') ? '***configured***' : '❌ missing');
  console.log('✅ VNP_HASH_SECRET:', requireEnv('VNP_HASH_SECRET') ? '***configured***' : '❌ missing');
  console.log('✅ VNP_URL:', validateUrl(requireEnv('VNP_URL'), 'VNP_URL'));
  console.log('✅ VNP_RETURN_URL:', validateUrl(requireEnv('VNP_RETURN_URL'), 'VNP_RETURN_URL'));
  console.log('✅ VNP_API:', validateUrl(requireEnv('VNP_API'), 'VNP_API'));

  // Email Configuration
  console.log('✅ SMTP_HOST:', requireEnv('SMTP_HOST'));
  console.log('✅ SMTP_PORT:', validateNumber(requireEnv('SMTP_PORT'), 'SMTP_PORT', 1));
  console.log('✅ SMTP_USER:', requireEnv('SMTP_USER'));
  console.log('✅ SMTP_PASS:', requireEnv('SMTP_PASS') ? '***configured***' : '❌ missing');

  // File Upload Configuration
  console.log('✅ MAX_FILE_SIZE:', validateNumber(requireEnv('MAX_FILE_SIZE'), 'MAX_FILE_SIZE', 1024));
  console.log('✅ UPLOAD_PATH:', requireEnv('UPLOAD_PATH'));

  console.log('\n🎉 All configuration validated successfully!');
  console.log('🚀 Server can start safely.');
  
  process.exit(0);

} catch (error) {
  console.error('\n❌ Configuration validation failed:');
  console.error(`   ${error.message}`);
  console.error('\n📝 Please check your .env file and ensure all required variables are set.');
  console.error('   See env.example for a complete list of required variables.');
  
  process.exit(1);
}
