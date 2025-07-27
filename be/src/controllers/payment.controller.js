import * as vnpayService from '../services/payment/vnpay.service.js';

export const createPayment = async (req, res, next) => {
  try {
    const { method, ...params } = req.body;
    let url;
    if (method === 'vnpay') {
      url = await vnpayService.createPaymentUrl({
        ...params,
        ipAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
    } else {
      return res.status(400).json({ message: 'Unsupported payment method' });
    }
    res.json({ success: true ,url });
  } catch (error) {
    next(error);
  }
};

export const paymentReturn = async (req, res, next) => {
  try {
    const { method = 'vnpay' } = req.query;
    let valid = false;
    if (method === 'vnpay') {
      valid = vnpayService.verifyReturn(req.query);
    }
    res.json({ valid });
  } catch (error) {
    next(error);
  }
};

export const paymentIpn = async (req, res, next) => {
  try {
    const { method = 'vnpay' } = req.query;
    let valid = false;
    if (method === 'vnpay') {
      valid = vnpayService.verifyIpn(req.query);
    }
    res.json({ valid });
  } catch (error) {
    next(error);
  }
};

export const paymentQuery = async (req, res, next) => {
  try {
    const { method = 'vnpay', ...params } = req.body;
    let result;
    if (method === 'vnpay') {
      result = await vnpayService.queryDr(params);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const paymentRefund = async (req, res, next) => {
  try {
    const { method = 'vnpay', ...params } = req.body;
    let result;
    if (method === 'vnpay') {
      result = await vnpayService.refund(params);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}; 