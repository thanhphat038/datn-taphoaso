import axios from 'axios';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorDefinitions.js';

// Địa chỉ cửa hàng (origin)
const STORE_ADDRESS = "200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh";
const STORE_COORDS = {
  lat: 10.7829,
  lon: 106.7009
};

class VietmapShippingService {
  constructor() {
    this.baseUrl = 'https://maps.vietmap.vn/api';
    this.apiKey = process.env.VIETMAP_API_KEY;
    this.addressCache = new Map(); // Cache đơn giản cho địa chỉ
    
    if (!this.apiKey) {
      console.warn('VIETMAP_API_KEY not found in environment variables');
    }
  }

  // Lấy tọa độ từ địa chỉ sử dụng Vietmap Geocoding API
  async getCoordinatesFromAddress(address) {
    try {
      // Kiểm tra cache trước
      const normalizedAddress = address.toLowerCase().trim();
      if (this.addressCache.has(normalizedAddress)) {
        return this.addressCache.get(normalizedAddress);
      }

      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          apikey: this.apiKey,
          text: address,
          limit: 1
        },
        timeout: 5000
      });

      if (response.data && response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        const coordinates = feature.geometry.coordinates;
        const result = {
          lat: coordinates[1], // Vietmap returns [lon, lat]
          lon: coordinates[0],
          display_name: feature.properties.display_name || address,
          address: feature.properties.address || {}
        };
        
        // Lưu vào cache
        this.addressCache.set(normalizedAddress, result);
        
        return result;
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error getting coordinates from Vietmap:', error);
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response && error.response.status === 401) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key không hợp lệ');
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ từ Vietmap');
    }
  }

  // Tính khoảng cách và thời gian di chuyển sử dụng Vietmap Route API
  async getRouteInfo(fromAddress, toAddress) {
    try {
      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      // Lấy tọa độ của địa chỉ nguồn và đích
      const [fromCoords, toCoords] = await Promise.all([
        this.getCoordinatesFromAddress(fromAddress),
        this.getCoordinatesFromAddress(toAddress)
      ]);

      const response = await axios.get(`${this.baseUrl}/route`, {
        params: {
          apikey: this.apiKey,
          points: `${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}`,
          type: 'car'
        },
        timeout: 10000
      });

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        return {
          distance: route.distance / 1000, // Chuyển từ mét sang km
          duration: route.duration / 60, // Chuyển từ giây sang phút
          fromAddress: fromCoords.display_name,
          toAddress: toCoords.display_name,
          fromCoordinates: {
            lat: fromCoords.lat,
            lon: fromCoords.lon
          },
          toCoordinates: {
            lat: toCoords.lat,
            lon: toCoords.lon
          }
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tính toán tuyến đường');
      }
    } catch (error) {
      console.error('Error getting route info from Vietmap:', error);
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response && error.response.status === 401) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key không hợp lệ');
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tính toán tuyến đường từ Vietmap');
    }
  }

  // Tính phí ship dựa trên khoảng cách và thời gian
  calculateShippingFee(distance, duration = null) {
    // Công thức tính phí ship theo yêu cầu
    let shippingFee = 0;
    
    if (distance <= 3) {
      shippingFee = 15000; // 15.000đ cho khoảng cách 0-3km
    } else if (distance <= 7) {
      shippingFee = 25000; // 25.000đ cho khoảng cách 3-7km
    } else {
      // Trên 7km: 35.000đ + 5.000đ cho mỗi km vượt quá
      const extraKm = distance - 7;
      shippingFee = 35000 + (extraKm * 5000);
    }

    return shippingFee;
  }

  // Tính phí ship từ địa chỉ khách hàng
  async calculateShippingFromAddress(deliveryAddress) {
    try {
      // Lấy thông tin tuyến đường từ cửa hàng đến địa chỉ khách hàng
      const routeInfo = await this.getRouteInfo(STORE_ADDRESS, deliveryAddress);
      
      // Tính phí ship
      const shippingFee = this.calculateShippingFee(routeInfo.distance, routeInfo.duration);

      return {
        distanceInKm: Math.round(routeInfo.distance * 100) / 100, // Làm tròn đến 2 chữ số thập phân
        durationInMin: Math.round(routeInfo.duration), // Thời gian di chuyển (phút)
        shippingFee,
        deliveryAddress: routeInfo.toAddress,
        storeAddress: routeInfo.fromAddress,
        storeCoordinates: routeInfo.fromCoordinates,
        deliveryCoordinates: routeInfo.toCoordinates,
        estimatedTime: `${Math.round(routeInfo.duration)} phút`
      };
    } catch (error) {
      console.error('Error calculating shipping:', error);
      throw error;
    }
  }

  // Hàm chính calculateShippingFee theo yêu cầu
  async calculateShippingFee(customerAddress) {
    try {
      const result = await this.calculateShippingFromAddress(customerAddress);
      
      // Trả về đúng format theo yêu cầu
      return {
        distanceInKm: result.distanceInKm,
        durationInMin: result.durationInMin,
        shippingFee: result.shippingFee
      };
    } catch (error) {
      console.error('Error in calculateShippingFee:', error);
      throw error;
    }
  }

  // Tính phí ship từ tọa độ
  async calculateShippingFromCoordinates(lat, lon) {
    try {
      // Lấy địa chỉ từ tọa độ
      const address = await this.getAddressFromCoordinates(lat, lon);
      
      // Tính phí ship từ địa chỉ
      return await this.calculateShippingFromAddress(address.address);
    } catch (error) {
      console.error('Error calculating shipping from coordinates:', error);
      throw error;
    }
  }

  // Lấy thông tin địa chỉ từ tọa độ (reverse geocoding)
  async getAddressFromCoordinates(lat, lon) {
    try {
      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/reverse`, {
        params: {
          apikey: this.apiKey,
          lat: lat,
          lon: lon
        },
        timeout: 5000
      });

      if (response.data && response.data.features && response.data.features.length > 0) {
        const feature = response.data.features[0];
        return {
          address: feature.properties.display_name,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          addressDetails: feature.properties.address || {}
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response && error.response.status === 401) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key không hợp lệ');
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ từ tọa độ');
    }
  }

  // Tìm kiếm địa chỉ (autocomplete)
  async searchAddresses(query) {
    try {
      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/autocomplete`, {
        params: {
          apikey: this.apiKey,
          q: query,
          limit: 10
        },
        timeout: 5000
      });

      if (response.data && response.data.features) {
        return response.data.features.map(feature => ({
          display_name: feature.properties.display_name,
          address: feature.properties.address || {},
          coordinates: {
            lat: feature.geometry.coordinates[1],
            lon: feature.geometry.coordinates[0]
          }
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response && error.response.status === 401) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key không hợp lệ');
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ');
    }
  }

  // Kiểm tra trạng thái API
  async checkApiStatus() {
    try {
      if (!this.apiKey) {
        return { status: 'error', message: 'API key not configured' };
      }

      // Thử gọi API geocoding với một địa chỉ đơn giản
      const response = await axios.get(`${this.baseUrl}/geocode`, {
        params: {
          apikey: this.apiKey,
          q: 'Ho Chi Minh',
          limit: 1
        },
        timeout: 5000
      });

      return { status: 'ok', message: 'API is working' };
    } catch (error) {
      console.error('Error checking API status:', error);
      return { 
        status: 'error', 
        message: error.response?.status === 401 ? 'Invalid API key' : 'API connection failed' 
      };
    }
  }
}

export default VietmapShippingService; 