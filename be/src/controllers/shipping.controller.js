import ShippingService from '../services/shipping/shipping.service.js';
import VietmapShippingService from '../services/shipping/vietmapShipping.service.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_CODES } from '../errors/errorDefinitions.js';
import { ok } from '../utils/response.js';

const STORE_COORDS = {
  lat: 10.782238,
  lon: 106.683384
};

const shippingService = new ShippingService();
const vietmapShippingService = new VietmapShippingService();

// Tính phí ship từ địa chỉ
export const calculateShippingFromAddress = async (req, res, next) => {
  try {
    console.log('🚀 [SHIPPING] Bắt đầu tính phí ship từ địa chỉ');
    
    const { deliveryAddress, service = 'default' } = req.body;
    console.log('📍 [SHIPPING] Địa chỉ giao hàng:', deliveryAddress);
    console.log('🔧 [SHIPPING] Service được chọn:', service);

    if (!deliveryAddress) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Địa chỉ giao hàng là bắt buộc');
    }

    let shippingInfo;

    switch (service) {
      case 'vietmap':
        console.log('🗺️ [SHIPPING] Sử dụng Vietmap service');
        
        // Lấy tọa độ từ địa chỉ
        console.log('📍 [SHIPPING] Đang lấy tọa độ từ địa chỉ...');
        const coordinates = await vietmapShippingService.getCoordinatesFromAddress(deliveryAddress);
        console.log('✅ [SHIPPING] Đã lấy được tọa độ:', coordinates);
        
        // Tính khoảng cách tự tính
        console.log('📏 [SHIPPING] Đang tính khoảng cách tự tính...');
        const calculatedDistance = vietmapShippingService.calculateDistance(STORE_COORDS, coordinates);
        console.log('📊 [SHIPPING] Khoảng cách tự tính:', calculatedDistance, 'km');
        
        // Lấy thông tin tuyến đường thực tế từ API
        console.log('🛣️ [SHIPPING] Đang lấy thông tin tuyến đường từ Vietmap API...');
        const routeInfo = await vietmapShippingService.getRouteInfo(STORE_COORDS, coordinates);
        const actualDistance = routeInfo.distance;
        console.log('📊 [SHIPPING] Khoảng cách thực tế:', actualDistance, 'km');
        console.log('⏱️ [SHIPPING] Thời gian di chuyển:', Math.round(routeInfo.time / 60), 'phút');
        
        // Kiểm tra xem có phải fallback không
        if (routeInfo.isFallback) {
          console.log('⚠️ [SHIPPING] Sử dụng khoảng cách đường chim bay (fallback)');
        }
        
        // Tính phí ship dựa trên khoảng cách thực tế
        console.log('💰 [SHIPPING] Đang tính phí ship...');
        const shippingFee = vietmapShippingService.calculateShippingFee(actualDistance);
        console.log('💵 [SHIPPING] Phí ship:', shippingFee, 'VND');
        
        shippingInfo = {
          shippingFee,
          distance: {
            calculated: Math.round(calculatedDistance * 100) / 100,
            actual: Math.round(actualDistance * 100) / 100,
            difference: Math.round(Math.abs(calculatedDistance - actualDistance) * 100) / 100,
            isFallback: routeInfo.isFallback || false
          },
          coordinates,
          address: deliveryAddress,
          routeInfo: {
            time: Math.round(routeInfo.time / 60), // Chuyển sang phút
            instructions: routeInfo.instructions,
            isFallback: routeInfo.isFallback || false
          }
        };
        
        console.log('✅ [SHIPPING] Hoàn thành tính phí ship với Vietmap service');
        break;
        
      case 'default':
      default:
        console.log('🔧 [SHIPPING] Sử dụng Default service');
        console.log('📍 [SHIPPING] Đang tính phí ship với Default service...');
        shippingInfo = await shippingService.calculateShippingFromAddress(deliveryAddress);
        console.log('✅ [SHIPPING] Hoàn thành tính phí ship với Default service');
        break;
    }

    console.log('🎉 [SHIPPING] Trả về kết quả thành công');
    return ok(res, shippingInfo, 'Tính phí vận chuyển thành công');
  } catch (error) {
    console.error('❌ [SHIPPING] Lỗi:', error.message);
    next(error);
  }
};

// Lấy thông tin cửa hàng
export const getStoreInfo = async (req, res, next) => {
  try {
    const storeInfo = {
      address: "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam",
      coordinates: {
        lat: 10.7829,
        lon: 106.7009
      }
    };

    return ok(res, storeInfo, 'Lấy thông tin cửa hàng thành công');
  } catch (error) {
    next(error);
  }
}; 