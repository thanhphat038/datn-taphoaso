import express from 'express';
import VietmapShippingController from '../controllers/vietmapShipping.controller.js';

const router = express.Router();
const vietmapShippingController = new VietmapShippingController();

// Tính phí ship từ địa chỉ
router.post('/calculate-from-address', vietmapShippingController.calculateShippingFromAddress);

// Tính phí ship từ tọa độ
router.post('/calculate-from-coordinates', vietmapShippingController.calculateShippingFromCoordinates);

// Tìm kiếm địa chỉ (autocomplete)
router.get('/search-addresses', vietmapShippingController.searchAddresses);

// Lấy địa chỉ từ tọa độ (reverse geocoding)
router.get('/get-address-from-coordinates', vietmapShippingController.getAddressFromCoordinates);

// Kiểm tra trạng thái API
router.get('/api-status', vietmapShippingController.checkApiStatus);

// Tính phí ship với thông tin chi tiết tuyến đường
router.post('/calculate-with-route-details', vietmapShippingController.calculateShippingWithRouteDetails);

// Hàm calculateShippingFee theo yêu cầu
router.post('/calculate-shipping-fee', vietmapShippingController.calculateShippingFee);

export default router; 