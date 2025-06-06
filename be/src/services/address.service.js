import DBService from './db.service.js';
import Address from '../models/address.model.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

class AddressService extends DBService {
  constructor() {
    super(Address);
  }

  async createAddress(userId, data) {
    // If this is the first address, set it as default
    const addressCount = await this.model.countDocuments({ user_id: userId });
    if (addressCount === 0) {
      data.is_default = true;
    }

    return await this.create({
      user_id: userId,
      ...data
    });
  }

  async updateAddress(addressId, userId, data) {
    const address = await this.findById(addressId);
    
    if (!address) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Address not found');
    }

    if (address.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    return await this.update(addressId, data);
  }

  async deleteAddress(addressId, userId) {
    const address = await this.findById(addressId);
    
    if (!address) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Address not found');
    }

    if (address.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    // If deleting default address, set another address as default
    if (address.is_default) {
      const anotherAddress = await this.model.findOne({
        user_id: userId,
        _id: { $ne: addressId }
      });

      if (anotherAddress) {
        await this.update(anotherAddress._id, { is_default: true });
      }
    }

    return await this.delete(addressId);
  }

  async setDefaultAddress(addressId, userId) {
    const address = await this.findById(addressId);
    
    if (!address) {
      throw new AppError(ERROR_CODES.DB_NOT_FOUND, 'Address not found');
    }

    if (address.user_id.toString() !== userId) {
      throw new AppError(ERROR_CODES.AUTH_FORBIDDEN);
    }

    // Remove default status from all user's addresses
    await this.model.updateMany(
      { user_id: userId },
      { is_default: false }
    );

    // Set new default address
    return await this.update(addressId, { is_default: true });
  }

  async getUserAddresses(userId) {
    return await this.model
      .find({ user_id: userId })
      .sort({ is_default: -1, created_at: -1 });
  }

  async getDefaultAddress(userId) {
    return await this.model.findOne({
      user_id: userId,
      is_default: true
    });
  }
}

export default AddressService; 