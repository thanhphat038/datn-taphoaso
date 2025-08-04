import VietmapShippingService from '../services/shipping/vietmapShipping.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import { ok } from '../utils/response.js';

const vietmapShippingService = new VietmapShippingService();

class VietmapShippingController {
  // Tính phí ship từ địa chỉ
  async calculateShippingFromAddress(req, res, next) {
    try {
      const { deliveryAddress } = req.body;

      if (!deliveryAddress) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Địa chỉ giao hàng là bắt buộc');
      }

      const shippingInfo = await vietmapShippingService.calculateShippingFromAddress(deliveryAddress);

      return ok(res, shippingInfo, 'Tính phí vận chuyển thành công');
    } catch (error) {
      next(error);
    }
  }

  // Tính phí ship từ tọa độ
  async calculateShippingFromCoordinates(req, res, next) {
    try {
      const { lat, lon } = req.body;

      if (!lat || !lon) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Tọa độ lat và lon là bắt buộc');
      }

      // Validate tọa độ
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Tọa độ không hợp lệ');
      }

      if (latitude < -90 || latitude > 90) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Latitude phải nằm trong khoảng -90 đến 90');
      }

      if (longitude < -180 || longitude > 180) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Longitude phải nằm trong khoảng -180 đến 180');
      }

      const shippingInfo = await vietmapShippingService.calculateShippingFromCoordinates(latitude, longitude);

      return ok(res, shippingInfo, 'Tính phí vận chuyển thành công');
    } catch (error) {
      next(error);
    }
  }

  // Tìm kiếm địa chỉ (autocomplete)
  async searchAddresses(req, res, next) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự');
      }

      const addresses = await vietmapShippingService.searchAddresses(query.trim());

      return ok(res, addresses, 'Tìm kiếm địa chỉ thành công');
    } catch (error) {
      next(error);
    }
  }

  // Lấy địa chỉ từ tọa độ (reverse geocoding)
  async getAddressFromCoordinates(req, res, next) {
    try {
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Tọa độ lat và lon là bắt buộc');
      }

      // Validate tọa độ
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Tọa độ không hợp lệ');
      }

      if (latitude < -90 || latitude > 90) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Latitude phải nằm trong khoảng -90 đến 90');
      }

      if (longitude < -180 || longitude > 180) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Longitude phải nằm trong khoảng -180 đến 180');
      }

      const addressInfo = await vietmapShippingService.getAddressFromCoordinates(latitude, longitude);

      return ok(res, addressInfo, 'Lấy thông tin địa chỉ thành công');
    } catch (error) {
      next(error);
    }
  }

  // Kiểm tra trạng thái API
  async checkApiStatus(req, res, next) {
    try {
      const status = await vietmapShippingService.checkApiStatus();

      return ok(res, status, 'Kiểm tra trạng thái API thành công');
    } catch (error) {
      next(error);
    }
  }

  // Tính phí ship với thông tin chi tiết tuyến đường
  async calculateShippingWithRouteDetails(req, res, next) {
    try {
      const { deliveryAddress } = req.body;

      if (!deliveryAddress) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Địa chỉ giao hàng là bắt buộc');
      }

      // Lấy thông tin tuyến đường
      const routeInfo = await vietmapShippingService.getRouteInfo(
        "200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh",
        deliveryAddress
      );

      // Tính phí ship
      const shippingFee = vietmapShippingService.calculateShippingFee(routeInfo.distance, routeInfo.duration);

      const result = {
        ...routeInfo,
        shippingFee,
        estimatedTime: `${Math.round(routeInfo.duration)} phút`,
        distanceFormatted: `${Math.round(routeInfo.distance * 100) / 100} km`
      };

      return ok(res, result, 'Tính phí vận chuyển với thông tin tuyến đường thành công');
    } catch (error) {
      next(error);
    }
  }

  // Hàm calculateShippingFee theo yêu cầu
  async calculateShippingFee(req, res, next) {
    try {
      const { customerAddress } = req.body;

      if (!customerAddress) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Địa chỉ khách hàng là bắt buộc');
      }

      const result = await vietmapShippingService.calculateShippingFee(customerAddress);

      return ok(res, result, 'Tính phí vận chuyển thành công');
    } catch (error) {
      next(error);
    }
  }
}

export default VietmapShippingController; 