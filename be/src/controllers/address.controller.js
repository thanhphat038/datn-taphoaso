import { addressService } from '../services/index.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import mongoose from 'mongoose';

// Create new address
export const createAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const addressData = req.body;

    // Validate required fields
    const requiredFields = [
      'receiver', 'phone', 'address_detail', 'city',
      'district', 'ward',
    ];
    const missingFields = requiredFields.filter(field =>
      !addressData[field] || typeof addressData[field] !== 'string' || addressData[field].trim() === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please fill in all required fields: ${missingFields.join(', ')}`
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(addressData.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ. Vui lòng nhập chính xác 10 chữ số.'
      });
    }

    const address = await addressService.createAddress(userId, {
      receiver: addressData.receiver,
      phone: addressData.phone,
      address_detail: addressData.address_detail,
      city: addressData.city,
      district: addressData.district,
      ward: addressData.ward,
      is_default: addressData.is_default || false
    });

    res.status(201).json({
      success: true,
      data: address,
      message: 'Thêm địa chỉ thành công'
    });
  } catch (error) {
    console.error('[Create Address Error]', error);
    res.status(500).json({
      success: false,
              message: 'Lỗi khi thêm địa chỉ',
      error: error.message
    });
  }
};

// Get all addresses
export const getAddresses = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const filters = {};
    if (user_id) filters.user_id = user_id;

    const addresses = await addressService.findAll(filters);
    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

// Get address by id
export const getAddressById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng ID không hợp lệ'
      });
    }

    const address = await addressService.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ này'
      });
    }

    res.json({
      success: true,
      data: address,
      message: 'Lấy thông tin địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thông tin địa chỉ',
      error: error.message
    });
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng ID địa chỉ không hợp lệ'
      });
    }

    // Check if address exists
    const existingAddress = await addressService.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Validate phone number if provided
    if (updateData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(updateData.phone)) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số'
        });
      }
    }

    // If setting as default, unset other default addresses
    if (updateData.is_default) {
      await addressService.updateMany(
        { _id: { $ne: id }, is_default: true },
        { is_default: false }
      );
    }

    const updatedAddress = await addressService.update(id, updateData);

    res.json({
      success: true,
      data: updatedAddress,
      message: 'Cập nhật địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
              message: 'Lỗi khi cập nhật địa chỉ',
      error: error.message
    });
  }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng ID địa chỉ không hợp lệ'
      });
    }

    // Check if address exists
    const existingAddress = await addressService.findById(id);
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ nây'
      });
    }

    // Delete address
    await addressService.delete(id);

    res.json({
      success: true,
      message: 'Xoá địa chỉ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xoá địa chỉ',
      error: error.message
    });
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const address = await addressService.setDefaultAddress(addressId, req.user.id);
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user.id);
    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

export const getDefaultAddress = async (req, res, next) => {
  try {
    const address = await addressService.getDefaultAddress(req.user.id);
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
}; 