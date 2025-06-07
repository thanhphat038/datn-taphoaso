import express from 'express';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../controllers/address.controller.js';

const router = express.Router();

// Create new address
router.post('/', createAddress);

// Get all addresses
router.get('/', getAddresses);

// Get address by id
router.get('/:id', getAddressById);

// Update address
router.put('/:id', updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

export default router; 