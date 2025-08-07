import axios from 'axios';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorDefinitions.js';
import { getGoogleMapsApiKey, isGoogleMapsConfigured } from '../../../config/googleMaps.config.js';

// Địa chỉ cửa hàng (origin)
const STORE_ADDRESS = "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam";
const STORE_COORDS = {
  lat: 10.7541,
  lon: 106.6622
};

class GoogleShippingService {
  constructor() {
    this.googleMapsApiKey = getGoogleMapsApiKey();
    this.baseUrl = 'https://maps.googleapis.com/maps/api';
  }

  // Lấy tọa độ từ địa chỉ sử dụng Google Geocoding API
  async getCoordinatesFromAddress(address) {
    try {
      console.log('🔍 Đang tìm tọa độ cho địa chỉ:', address);
      console.log('🔑 Google Maps API key:', this.googleMapsApiKey ? 'Đã cấu hình' : 'Chưa cấu hình');

      // Kiểm tra nếu API key không hợp lệ hoặc có restriction
      if (!this.googleMapsApiKey || this.googleMapsApiKey.includes('callback')) {
        console.log('⚠️ Google Maps API key không hợp lệ, chuyển sang sử dụng Nominatim');
        return this.getCoordinatesFromNominatim(address);
      }

      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          address: address,
          key: this.googleMapsApiKey,
          region: 'vn', // Chỉ tìm trong Việt Nam
          language: 'vi' // Ngôn ngữ tiếng Việt
        },
        headers: {
          'User-Agent': 'TAPHOASO-SERVER/1.0'
        }
      });

      console.log('Google Geocoding response status:', response.data.status);
      console.log('Google Geocoding results count:', response.data.results?.length || 0);

      if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        const formattedAddress = response.data.results[0].formatted_address;
        
        console.log('Found coordinates:', location);
        console.log('Formatted address:', formattedAddress);
        
        return {
          lat: location.lat,
          lon: location.lng,
          formatted_address: formattedAddress
        };
      } else {
        console.log('Google Geocoding failed. Status:', response.data.status);
        console.log('Error message:', response.data.error_message);
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, `Không thể tìm thấy địa chỉ: ${response.data.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error getting coordinates from Google:', error);
      
      // Kiểm tra nếu có lỗi authorization hoặc API không được enable
      if (error.response && error.response.data && 
          (error.response.data.error_message?.includes('not authorized') || 
           error.response.data.error_message?.includes('API project is not authorized'))) {
        console.log('⚠️ Google Maps API không được authorize, chuyển sang sử dụng Nominatim');
        return this.getCoordinatesFromNominatim(address);
      }
      
      if (error instanceof AppError) {
        throw error;
      }
      if (error.response) {
        console.error('Google API error response:', error.response.data);
        throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, `Google Maps API error: ${error.response.data.error_message || error.message}`);
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ từ Google Maps');
    }
  }

  // Fallback: Lấy tọa độ từ Nominatim (OpenStreetMap)
  async getCoordinatesFromNominatim(address) {
    try {
      console.log('🗺️ Sử dụng Nominatim để tìm tọa độ:', address);
      
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1,
          countrycodes: 'vn', // Chỉ tìm trong Việt Nam
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'TAPHOASO-SERVER/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        console.log('✅ Tìm thấy tọa độ từ Nominatim:', result);
        
        return {
          lat: parseFloat(result.lat),
          lon: parseFloat(result.lon),
          formatted_address: result.display_name
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('❌ Lỗi khi tìm tọa độ từ Nominatim:', error);
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ từ Nominatim');
    }
  }

  // Tính khoảng cách và thời gian sử dụng Google Distance Matrix API
  async getDistanceAndDuration(origin, destination) {
    try {
      console.log('📏 Đang tính khoảng cách từ Google Maps:', origin, '->', destination);
      
      // Kiểm tra nếu API key không hợp lệ
      if (!this.googleMapsApiKey || this.googleMapsApiKey.includes('callback')) {
        console.log('⚠️ Google Maps API key không hợp lệ, chuyển sang sử dụng Haversine');
        return this.getDistanceFromHaversine(origin, destination);
      }

      const response = await axios.get(`${this.baseUrl}/distancematrix/json`, {
        params: {
          origins: origin,
          destinations: destination,
          mode: 'driving', // Chế độ lái xe
          units: 'metric', // Đơn vị mét
          key: this.googleMapsApiKey,
          region: 'vn'
        }
      });

      if (response.data.status === 'OK' && response.data.rows.length > 0) {
        const element = response.data.rows[0].elements[0];
        
        if (element.status === 'OK') {
          return {
            distance: element.distance.value / 1000, // Chuyển từ mét sang km
            duration: element.duration.value, // Thời gian tính bằng giây
            distanceText: element.distance.text,
            durationText: element.duration.text
          };
        } else {
          throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tính toán khoảng cách');
        }
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tính toán khoảng cách');
      }
    } catch (error) {
      console.error('Error getting distance from Google:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tính toán khoảng cách từ Google Maps');
    }
  }

  // Fallback: Tính khoảng cách bằng công thức Haversine
  getDistanceFromHaversine(origin, destination) {
    try {
      console.log('🧮 Sử dụng công thức Haversine để tính khoảng cách');
      
      // Parse tọa độ
      const [originLat, originLon] = origin.split(',').map(coord => parseFloat(coord.trim()));
      const [destLat, destLon] = destination.split(',').map(coord => parseFloat(coord.trim()));
      
      // Công thức Haversine
      const R = 6371; // Bán kính Trái Đất (km)
      const dLat = this.toRadians(destLat - originLat);
      const dLon = this.toRadians(destLon - originLon);
      
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.toRadians(originLat)) * Math.cos(this.toRadians(destLat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      console.log('✅ Khoảng cách tính bằng Haversine:', distance.toFixed(2), 'km');
      
      return {
        distance: distance,
        duration: distance * 120, // Ước tính thời gian (2 phút/km)
        distanceText: `${distance.toFixed(1)} km`,
        durationText: `${Math.round(distance * 2)} phút`
      };
    } catch (error) {
      console.error('❌ Lỗi khi tính khoảng cách bằng Haversine:', error);
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tính toán khoảng cách');
    }
  }

  // Chuyển đổi độ sang radian
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Tính phí ship dựa trên khoảng cách (Google Maps)
  calculateShippingFee(distance) {
    // Bảng giá ship theo khoảng cách (có thể điều chỉnh)
    if (distance <= 5) {
      return 15000; // 15k cho khoảng cách <= 5km
    } else if (distance <= 10) {
      return 25000; // 25k cho khoảng cách 5-10km
    } else if (distance <= 20) {
      return 35000; // 35k cho khoảng cách 10-20km
    } else if (distance <= 30) {
      return 45000; // 45k cho khoảng cách 20-30km
    } else {
      return 55000; // 55k cho khoảng cách > 30km
    }
  }

  // Tính phí ship từ địa chỉ sử dụng Google Maps
  async calculateShippingFromAddress(deliveryAddress) {
    try {
      // Lấy tọa độ của địa chỉ giao hàng
      const deliveryCoords = await this.getCoordinatesFromAddress(deliveryAddress);
      
      // Tính khoảng cách và thời gian
      const distanceInfo = await this.getDistanceAndDuration(
        STORE_ADDRESS,
        deliveryCoords.formatted_address
      );

      // Tính phí ship
      const shippingFee = this.calculateShippingFee(distanceInfo.distance);

      return {
        distance: Math.round(distanceInfo.distance * 100) / 100,
        duration: Math.round(distanceInfo.duration / 60), // Chuyển từ giây sang phút
        shippingFee,
        deliveryAddress: deliveryCoords.formatted_address,
        storeAddress: STORE_ADDRESS,
        distanceText: distanceInfo.distanceText,
        durationText: distanceInfo.durationText
      };
    } catch (error) {
      console.error('Error calculating shipping with Google:', error);
      throw error;
    }
  }

  // Tính phí ship từ tọa độ sử dụng Google Maps
  async calculateShippingFromCoordinates(lat, lon) {
    try {
      // Lấy địa chỉ từ tọa độ
      const addressInfo = await this.getAddressFromCoordinates(lat, lon);
      
      // Tính khoảng cách và thời gian
      const distanceInfo = await this.getDistanceAndDuration(
        STORE_ADDRESS,
        addressInfo.formatted_address
      );

      // Tính phí ship
      const shippingFee = this.calculateShippingFee(distanceInfo.distance);

      return {
        distance: Math.round(distanceInfo.distance * 100) / 100,
        duration: Math.round(distanceInfo.duration / 60),
        shippingFee,
        deliveryAddress: addressInfo.formatted_address,
        storeAddress: STORE_ADDRESS,
        distanceText: distanceInfo.distanceText,
        durationText: distanceInfo.durationText
      };
    } catch (error) {
      console.error('Error calculating shipping from coordinates with Google:', error);
      throw error;
    }
  }

  // Lấy thông tin địa chỉ từ tọa độ (reverse geocoding)
  async getAddressFromCoordinates(lat, lon) {
    try {
      if (!this.googleMapsApiKey) {
        throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Google Maps API key chưa được cấu hình');
      }

      const response = await axios.get(`${this.baseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lon}`,
          key: this.googleMapsApiKey,
          region: 'vn'
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          address: result.formatted_address,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          formatted_address: result.formatted_address
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy địa chỉ');
      }
    } catch (error) {
      console.error('Error getting address from coordinates with Google:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm kiếm địa chỉ từ Google Maps');
    }
  }

  // Lấy route từ cửa hàng đến địa chỉ giao hàng
  async getRouteToAddress(deliveryAddress) {
    try {
      if (!this.googleMapsApiKey) {
        throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Google Maps API key chưa được cấu hình');
      }

      const deliveryCoords = await this.getCoordinatesFromAddress(deliveryAddress);

      const response = await axios.get(`${this.baseUrl}/directions/json`, {
        params: {
          origin: STORE_ADDRESS,
          destination: deliveryCoords.formatted_address,
          mode: 'driving',
          key: this.googleMapsApiKey,
          region: 'vn'
        }
      });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];
        
        return {
          distance: leg.distance.value / 1000,
          duration: leg.duration.value,
          distanceText: leg.distance.text,
          durationText: leg.duration.text,
          steps: leg.steps.map(step => ({
            instruction: step.html_instructions,
            distance: step.distance.text,
            duration: step.duration.text
          })),
          polyline: route.overview_polyline.points
        };
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tìm thấy route');
      }
    } catch (error) {
      console.error('Error getting route with Google:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi tìm route từ Google Maps');
    }
  }
}

export default GoogleShippingService; 