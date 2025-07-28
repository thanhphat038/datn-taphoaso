import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

export const config = {
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    mongoUri: requireEnv('MONGODB_URI'),
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
  },
  vnpay: {
    tmnCode: requireEnv('VNP_TMN_CODE'),
    hashSecret: requireEnv('VNP_HASH_SECRET'),
    url: requireEnv('VNP_URL'),
    returnUrl: requireEnv('VNP_RETURN_URL'),
    api: requireEnv('VNP_API'),
  },
  // Thêm các vùng khác nếu cần
};
