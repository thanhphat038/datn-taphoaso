import axios from 'axios';
import moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';
import { 
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  VNP_RETURN_URL,
  VNP_API
} from '../../config/index.js';

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

export async function createPaymentUrl({ amount, bankCode, language, ipAddr, orderId }) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const txnRef = moment(date).format('DDHHmmss'); // Luôn tạo txnRef ngắn từ timestamp
  const tmnCode = VNP_TMN_CODE;
  const secretKey = VNP_HASH_SECRET;
  let vnpUrl = VNP_URL;
  const returnUrl = VNP_RETURN_URL;
  let locale = language || 'vn';
  let currCode = 'VND';
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderId,
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
  return { url: vnpUrl, txnRef: txnRef }; // Trả về cả URL và txnRef
}

export function verifyReturn(query) {
  const vnp_Params = { ...query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  const secretKey = VNP_HASH_SECRET;
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
  const vnp_TmnCode = VNP_TMN_CODE;
  const secretKey = VNP_HASH_SECRET;
  const vnp_Api = VNP_API;
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
  const vnp_TmnCode = VNP_TMN_CODE;
  const secretKey = VNP_HASH_SECRET;
  const vnp_Api = VNP_API;
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

// Function để xử lý callback VNPAY và cập nhật trạng thái đơn hàng
export function processVNPayCallback(query) {
  // Verify signature
  const isValid = verifyReturn(query);
  
  if (!isValid) {
    return {
      success: false,
      message: 'Invalid signature'
    };
  }

  // Parse response code
  const responseCode = query.vnp_ResponseCode;
  const txnRef = query.vnp_TxnRef;
  const amount = query.vnp_Amount;
  const transactionStatus = query.vnp_TransactionStatus;
  const bankCode = query.vnp_BankCode;
  const cardType = query.vnp_CardType;
  const payDate = query.vnp_PayDate;
  const transactionNo = query.vnp_TransactionNo;

  // VNPAY response codes
  // 00: Giao dịch thành công
  // 24: Giao dịch thất bại
  // 51: Tài khoản không đủ số dư
  // 65: Tài khoản vượt quá hạn mức cho phép
  // 75: Ngân hàng thanh toán đang bảo trì
  // 79: Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định
  // 99: Các lỗi khác

  const isSuccess = responseCode === '00' && transactionStatus === '00';
  
  return {
    success: isSuccess,
    orderId: txnRef,
    responseCode,
    amount: amount ? parseInt(amount) / 100 : 0, // Convert from VNPAY format (x100)
    transactionStatus,
    bankCode,
    cardType,
    payDate,
    transactionNo,
    message: isSuccess ? 'Thanh toán thành công' : getErrorMessage(responseCode)
  };
}

// Function để lấy thông báo lỗi dựa trên response code
function getErrorMessage(responseCode) {
  const errorMessages = {
    '24': 'Giao dịch thất bại',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản vượt quá hạn mức cho phép',
    '75': 'Ngân hàng thanh toán đang bảo trì',
    '79': 'Khách hàng nhập sai mật khẩu thanh toán quá số lần quy định',
    '99': 'Các lỗi khác'
  };
  
  return errorMessages[responseCode] || 'Giao dịch thất bại';
} 