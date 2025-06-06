import DBService from './db.service.js';
import Voucher from '../models/voucher.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

class VoucherService extends DBService {
  constructor() {
    super(Voucher);
  }

  async validateVoucher(code, userId, orderAmount) {
    const voucher = await this.model.findOne({ code });
    
    if (!voucher) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Voucher not found');
    }

    const now = new Date();
    if (now < voucher.start_date || now > voucher.end_date) {
      throw new AppError(ERROR_CODES.BUSINESS_VOUCHER_EXPIRED);
    }

    if (voucher.quantity <= 0) {
      throw new AppError(ERROR_CODES.BUSINESS_VOUCHER_OUT_OF_STOCK);
    }

    if (orderAmount < voucher.min_order_value) {
      throw new AppError(ERROR_CODES.BUSINESS_VOUCHER_MIN_ORDER_NOT_MET);
    }

    // Check if user has used this voucher before
    const userUsage = await this.model.findOne({
      _id: voucher._id,
      'usage_history.user_id': userId
    });

    if (userUsage && voucher.max_uses_per_user <= userUsage.usage_history.filter(
      usage => usage.user_id.toString() === userId
    ).length) {
      throw new AppError(ERROR_CODES.BUSINESS_VOUCHER_MAX_USES_EXCEEDED);
    }

    return voucher;
  }

  async applyVoucher(code, userId, orderAmount) {
    const voucher = await this.validateVoucher(code, userId, orderAmount);
    
    let discountAmount = 0;
    if (voucher.type === 'percentage') {
      discountAmount = (orderAmount * voucher.value) / 100;
      if (discountAmount > voucher.max_discount) {
        discountAmount = voucher.max_discount;
      }
    } else {
      discountAmount = voucher.value;
    }

    // Update voucher usage
    await this.model.findByIdAndUpdate(voucher._id, {
      $inc: { quantity: -1 },
      $push: {
        usage_history: {
          user_id: userId,
          order_amount: orderAmount,
          discount_amount: discountAmount,
          used_at: new Date()
        }
      }
    });

    return {
      voucher,
      discountAmount
    };
  }

  async getActiveVouchers() {
    const now = new Date();
    return await this.model.find({
      start_date: { $lte: now },
      end_date: { $gte: now },
      quantity: { $gt: 0 }
    });
  }

  async getVoucherStats() {
    return await this.model.aggregate([
      {
        $project: {
          code: 1,
          total_uses: { $size: '$usage_history' },
          total_discount: {
            $sum: '$usage_history.discount_amount'
          },
          unique_users: {
            $size: {
              $setUnion: ['$usage_history.user_id']
            }
          }
        }
      }
    ]);
  }
}

export default VoucherService; 