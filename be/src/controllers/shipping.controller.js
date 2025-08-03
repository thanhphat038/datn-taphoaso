import ShippingService from '../services/shipping/shipping.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';

const shippingService = new ShippingService();

// Tính phí ship từ địa chỉ
export const calculateShippingFromAddress = async (req, res, next) => {
  try {
    const { address } = req.body;

    if (!address) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Địa chỉ giao hàng là bắt buộc');
    }

    const shippingInfo = await shippingService.calculateShippingFromAddress(address);
    
    res.json({
      success: true,
      data: shippingInfo
    });
  } catch (err) {
    next(err);
  }
};

// Tính phí ship từ tọa độ
export const calculateShippingFromCoordinates = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Tọa độ là bắt buộc');
    }

    // Validate tọa độ
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Tọa độ không hợp lệ');
    }

    if (latNum < -90 || latNum > 90) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Vĩ độ phải từ -90 đến 90');
    }

    if (lonNum < -180 || lonNum > 180) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Kinh độ phải từ -180 đến 180');
    }

    const shippingInfo = shippingService.calculateShippingFromCoordinates(latNum, lonNum);
    
    res.json({
      success: true,
      data: shippingInfo
    });
  } catch (err) {
    next(err);
  }
};

// Lấy địa chỉ từ tọa độ
export const getAddressFromCoordinates = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Tọa độ là bắt buộc');
    }

    // Validate tọa độ
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Tọa độ không hợp lệ');
    }

    const addressInfo = await shippingService.getAddressFromCoordinates(latNum, lonNum);
    
    res.json({
      success: true,
      data: addressInfo
    });
  } catch (err) {
    next(err);
  }
};

// Lấy thông tin cửa hàng
export const getStoreInfo = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        address: "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam",
        coordinates: {
          lat: 10.7829,
          lon: 106.7009
        }
      }
    });
  } catch (err) {
    next(err);
  }
}; 