import axios from 'axios';
import moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';
import { config } from '../../config/config.js';

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

function signData(data, secretKey) {
  const hmac = crypto.createHmac('sha512', secretKey);
  return hmac.update(Buffer.from(data, 'utf-8')).digest('hex');
}

export async function createPaymentUrl({ amount, bankCode, language, ipAddr }) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('DDHHmmss');
  const tmnCode = config.vnpay.tmnCode;
  const secretKey = config.vnpay.hashSecret;
  let vnpUrl = config.vnpay.url;
  const returnUrl = config.vnpay.returnUrl;
  let locale = language || 'vn';
  let currCode = 'VND';
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }
  vnp_Params = sortObject(vnp_Params);
  const signStr = qs.stringify(vnp_Params, { encode: false });
  vnp_Params['vnp_SecureHash'] = signData(signStr, secretKey);
  vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
  return vnpUrl;
}

export function verifyReturn(query) {
  const vnp_Params = { ...query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  const secretKey = config.vnpay.hashSecret;
  const signStr = qs.stringify(sortObject(vnp_Params), { encode: false });
  const signed = signData(signStr, secretKey);
  return secureHash === signed;
}

export function verifyIpn(query) {
  // Tương tự verifyReturn, có thể bổ sung logic kiểm tra orderId, amount, ...
  return verifyReturn(query);
}

export async function queryDr({ orderId, transDate, ipAddr }) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const vnp_TmnCode = config.vnpay.tmnCode;
  const secretKey = config.vnpay.hashSecret;
  const vnp_Api = config.vnpay.api;
  const vnp_RequestId = moment(date).format('HHmmss');
  const vnp_Version = '2.1.0';
  const vnp_Command = 'querydr';
  const vnp_OrderInfo = 'Truy van GD ma:' + orderId;
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${orderId}|${transDate}|${vnp_CreateDate}|${ipAddr}|${vnp_OrderInfo}`;
  const vnp_SecureHash = signData(data, secretKey);
  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo,
    vnp_TransactionDate: transDate,
    vnp_CreateDate,
    vnp_IpAddr: ipAddr,
    vnp_SecureHash
  };
  const response = await axios.post(vnp_Api, dataObj);
  return response.data;
}

export async function refund({ orderId, transDate, amount, transType, user, ipAddr }) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const vnp_TmnCode = config.vnpay.tmnCode;
  const secretKey = config.vnpay.hashSecret;
  const vnp_Api = config.vnpay.api;
  const vnp_RequestId = moment(date).format('HHmmss');
  const vnp_Version = '2.1.0';
  const vnp_Command = 'refund';
  const vnp_OrderInfo = 'Hoan tien GD ma:' + orderId;
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
  const vnp_TransactionNo = '0';
  const vnp_Amount = amount * 100;
  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${transType}|${orderId}|${vnp_Amount}|${vnp_TransactionNo}|${transDate}|${user}|${vnp_CreateDate}|${ipAddr}|${vnp_OrderInfo}`;
  const vnp_SecureHash = signData(data, secretKey);
  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType: transType,
    vnp_TxnRef: orderId,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_CreateBy: user,
    vnp_OrderInfo,
    vnp_TransactionDate: transDate,
    vnp_CreateDate,
    vnp_IpAddr: ipAddr,
    vnp_SecureHash
  };
  const response = await axios.post(vnp_Api, dataObj);
  return response.data;
} 