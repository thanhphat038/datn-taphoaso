import { addressService } from '../services/index.js';
import { AppError, ERROR_CODES } from '../utils/error.js';
import mongoose from 'mongoose';

// Create new address
export const createAddress = async (req, res, next) => {
  try {
    const addressData = req.body;

    // Validate required fields
    const requiredFields = ['full_name', 'phone', 'address', 'city', 'district', 'ward'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please fill in all required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(addressData.phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Please enter 10 digits'
      });
    }

    const address = await addressService.create({
      full_name: addressData.full_name,
      phone: addressData.phone,
      address: addressData.address,
      city: addressData.city,
      district: addressData.district,
      ward: addressData.ward,
      is_default: addressData.is_default || false
    });

    res.status(201).json({
      success: true,
      data: address,
      message: 'Address added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding address',
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
        message: 'Invalid address ID format'
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
          message: 'Invalid phone number. Please enter 10 digits'
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
      message: 'Address updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address',
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
        message: 'Invalid address ID format'
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

    // Delete address
    await addressService.delete(id);

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const address = await addressService.setDefaultAddress(addressId, req.user._id);
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
    const addresses = await addressService.getUserAddresses(req.user._id);
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
    const address = await addressService.getDefaultAddress(req.user._id);
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
}; 