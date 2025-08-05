import express from 'express';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getUserAddresses,
  getDefaultAddress,
  setDefaultAddress
} from '../controllers/address.controller.js';

const router = express.Router();

// Create new address
router.post('/', createAddress);

// Get all addresses
router.get('/', getAddresses);

// Get user addresses (current user only)
router.get('/user/me', getUserAddresses);

// Get default address
router.get('/default', getDefaultAddress);

// Set default address
router.put('/default/:addressId', setDefaultAddress);

// Get address by id
router.get('/:id', getAddressById);

// Update address
router.put('/:id', updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

export default router; 