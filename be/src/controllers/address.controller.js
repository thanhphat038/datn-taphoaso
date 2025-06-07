import { addressService } from '../services/index.js';
import { AppError, ERROR_CODES } from '../utils/error.js';

// Create new address
export const createAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.user._id, req.body);
    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
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
    const address = await addressService.findById(req.params.id);
    if (!address) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Address not found');
    }
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const address = await addressService.updateAddress(addressId, req.user._id, req.body);
    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    await addressService.deleteAddress(addressId, req.user._id);
    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
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