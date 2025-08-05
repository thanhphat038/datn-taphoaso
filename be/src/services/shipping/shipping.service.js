import axios from 'axios';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorDefinitions.js';

// Địa chỉ cửa hàng (origin)
const STORE_ADDRESS = "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam";
const STORE_COORDS = {
  lat: 10.7829,
  lon: 106.7009
};

class ShippingService {
  constructor() {
    this.baseUrl = 'https://nominatim.openstreetmap.org';
    this.addressCache = new Map(); // Cache đơn giản cho địa chỉ
  }

  // Tính khoảng cách giữa 2 điểm sử dụng công thức Haversine
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Khoảng cách tính bằng km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Lấy tọa độ từ địa chỉ sử dụng Nominatim
  async getCoordinatesFromAddress(address) {
    try {
      // Kiểm tra cache trước
      const normalizedAddress = address.toLowerCase().trim();
      if (this.addressCache.has(normalizedAddress)) {
        return this.addressCache.get(normalizedAddress);
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          countrycodes: 'vn', // Chỉ tìm trong Việt Nam
          addressdetails: 1, // Lấy chi tiết địa chỉ
          extratags: 1 // Lấy thêm thông tin
        },
        headers: {
          'User-Agent': 'TAPHOASO-APP/1.0'
        },
        timeout: 2000 // Giảm timeout xuống 2 giây
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const result = {
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
          display_name: location.display_name
        };
        
        // Lưu vào cache
        this.addressCache.set(normalizedAddress, result);
        
        return result;
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ');
    }
  }

  // Tính phí ship dựa trên khoảng cách
  calculateShippingFee(distance) {
    // Bảng giá ship theo khoảng cách (đơn vị: km, phí: VND)
    if (distance <= 1) {
      return 8000; // 8k VND cho khoảng cách <= 1km
    } else if (distance <= 3) {
      return 12000; // 12k VND cho khoảng cách 1-3km
    } else if (distance <= 5) {
      return 18000; // 18k VND cho khoảng cách 3-5km
    } else if (distance <= 10) {
      return 25000; // 25k VND cho khoảng cách 5-10km
    } else if (distance <= 15) {
      return 35000; // 35k VND cho khoảng cách 10-15km
    } else if (distance <= 20) {
      return 45000; // 45k VND cho khoảng cách 15-20km
    } else {
      return 55000; // 55k VND cho khoảng cách > 20km
    }
  }

  // Tính phí ship từ địa chỉ
  async calculateShippingFromAddress(deliveryAddress) {
    try {
      // Lấy tọa độ của địa chỉ giao hàng
      const deliveryCoords = await this.getCoordinatesFromAddress(deliveryAddress);
      
      // Tính khoảng cách
      const distance = this.calculateDistance(
        STORE_COORDS.lat, 
        STORE_COORDS.lon, 
        deliveryCoords.lat, 
        deliveryCoords.lon
      );

      // Tính phí ship
      const shippingFee = this.calculateShippingFee(distance);

      return {
        distance: Math.round(distance * 100) / 100, // Làm tròn đến 2 chữ số thập phân
        shippingFee,
        deliveryAddress: deliveryCoords.display_name,
        storeAddress: STORE_ADDRESS,
        storeCoordinates: STORE_COORDS,
        deliveryCoordinates: {
          lat: deliveryCoords.lat,
          lon: deliveryCoords.lon
        }
      };
    } catch (error) {
      console.error('Error calculating shipping:', error);
      throw error;
    }
  }

  // Tính phí ship từ tọa độ
  calculateShippingFromCoordinates(lat, lon) {
    try {
      const distance = this.calculateDistance(
        STORE_COORDS.lat, 
        STORE_COORDS.lon, 
        lat, 
        lon
      );

      const shippingFee = this.calculateShippingFee(distance);

      return {
        distance: Math.round(distance * 100) / 100,
        shippingFee,
        storeAddress: STORE_ADDRESS,
        storeCoordinates: STORE_COORDS,
        deliveryCoordinates: {
          lat: lat,
          lon: lon
        }
      };
    } catch (error) {
      console.error('Error calculating shipping from coordinates:', error);
      throw error;
    }
  }

  // Lấy thông tin địa chỉ từ tọa độ (reverse geocoding)
  async getAddressFromCoordinates(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          lat: lat,
          lon: lon,
          format: 'json',
          zoom: 18
        },
        headers: {
          'User-Agent': 'TAPHOASO-APP/1.0'
        }
      });

      if (response.data && response.data.display_name) {
        return {
          address: response.data.display_name,
          lat: parseFloat(lat),
          lon: parseFloat(lon)
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ');
    }
  }
}

export default ShippingService; 