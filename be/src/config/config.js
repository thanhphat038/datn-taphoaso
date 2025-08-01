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
    tmnCode: process.env.VNP_TMN_CODE || 'test',
    hashSecret: process.env.VNP_HASH_SECRET || 'test',
    url: process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNP_RETURN_URL || 'http://localhost:5173/payment/return',
    api: process.env.VNP_API || 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',
  },
  // Thêm các vùng khác nếu cần
};
