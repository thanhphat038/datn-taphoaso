import axios from 'axios';
import { AppError } from '../../errors/AppError.js';
import { ERROR_CODES } from '../../errors/errorDefinitions.js';

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
      console.log('🔍 [VIETMAP] Bắt đầu tìm kiếm địa chỉ:', address);
      
      const normalizedAddress = address.toLowerCase().trim();
      if (this.addressCache.has(normalizedAddress)) {
        console.log('💾 [VIETMAP] Lấy từ cache');
        return this.addressCache.get(normalizedAddress);
      }

      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      // 1. Search address
      console.log('🔍 [VIETMAP] Gọi API search với địa chỉ:', address);
      const searchRes = await axios.get(`${this.baseUrl}/search/v3`, {
        params: {
          apikey: this.apiKey,
          text: address
        },
        timeout: 5000
      });

      console.log('📡 [VIETMAP] Response từ search API:', searchRes.data);

      // Response là array, lấy item đầu tiên có ref_id
      const searchResults = Array.isArray(searchRes.data) ? searchRes.data : [];
      const feature = searchResults.find(item => item.ref_id);
      
      if (!feature || !feature.ref_id) {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không tìm thấy địa chỉ (không có refid)');
      }

      const refid = feature.ref_id;
      console.log('🆔 [VIETMAP] Tìm thấy ref_id:', refid);

      // 2. Get place details from refid
      console.log('📍 [VIETMAP] Gọi API place với ref_id:', refid);
      const placeRes = await axios.get(`${this.baseUrl}/place/v3`, {
        params: {
          apikey: this.apiKey,
          refid
        },
        timeout: 5000
      });

      const data = placeRes.data;
      console.log('📡 [VIETMAP] Response từ place API:', data);
      
      // Nếu không có place details, sử dụng thông tin từ search
      if (!data || !data.lat) {
        console.log('⚠️ [VIETMAP] Không có place details, sử dụng thông tin từ search');
        // Sử dụng thông tin từ search result
        const result = {
          lat: feature.lat || 0,
          lon: feature.lon || 0,
          display_name: feature.display || address,
          address: {
            house_number: feature.name || '',
            street: feature.address || '',
            ward: '',
            district: '',
            city: ''
          }
        };
        
        this.addressCache.set(normalizedAddress, result);
        console.log('✅ [VIETMAP] Kết quả từ search:', result);
        return result;
      }

      const result = {
        lat: data.lat,
        lon: data.lng,
        display_name: data.display || address,
        address: {
          house_number: data.hs_num,
          street: data.street,
          ward: data.ward,
          district: data.district,
          city: data.city
        }
      };

      this.addressCache.set(normalizedAddress, result);
      console.log('✅ [VIETMAP] Kết quả từ place:', result);
      return result;

    } catch (error) {
      console.error('❌ [VIETMAP] Lỗi khi lấy tọa độ:', error.message);
      if (error instanceof AppError) throw error;
      if (error.response?.status === 401) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key không hợp lệ');
      }
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi lấy thông tin địa chỉ từ Vietmap');
    }
  }

  // Lấy thông tin tuyến đường thực tế từ Vietmap Route API
  async getRouteInfo(originCoords, destinationCoords, vehicle = 'motorcycle') {
    try {
      console.log('🛣️ [VIETMAP] Bắt đầu lấy thông tin tuyến đường');
      console.log('📍 [VIETMAP] Điểm xuất phát:', originCoords);
      console.log('🎯 [VIETMAP] Điểm đến:', destinationCoords);
      console.log('🚗 [VIETMAP] Phương tiện:', vehicle);

      if (!this.apiKey) {
        throw new AppError(ERROR_CODES.CONFIGURATION_ERROR, 'Vietmap API key not configured');
      }

      console.log('📡 [VIETMAP] Gọi Route API...');
      const response = await axios.get(`${this.baseUrl}/route`, {
        params: {
          'api-version': '1.1',
          apikey: this.apiKey,
          point: `${originCoords.lat},${originCoords.lon}`,
          point: `${destinationCoords.lat},${destinationCoords.lon}`,
          vehicle: vehicle,
          points_encoded: true
        },
        timeout: 10000
      });

      console.log('📡 [VIETMAP] Response từ Route API:', response.data);

      if (response.data && response.data.paths && response.data.paths.length > 0) {
        const path = response.data.paths[0];
        const result = {
          distance: path.distance / 1000, // Chuyển từ mét sang km
          time: path.time / 1000, // Chuyển từ millisecond sang giây
          instructions: path.instructions,
          routeInfo: path
        };
        
        console.log('✅ [VIETMAP] Kết quả tuyến đường:', {
          distance: result.distance,
          time: result.time,
          instructionsCount: result.instructions.length
        });
        
        return result;
      } else {
        throw new AppError(ERROR_CODES.BUSINESS_INVALID_OPERATION, 'Không thể tính toán tuyến đường');
      }
    } catch (error) {
      console.error('❌ [VIETMAP] Lỗi khi lấy thông tin tuyến đường:', error.message);
      if (error instanceof AppError) throw error;
      throw new AppError(ERROR_CODES.EXTERNAL_SERVICE_ERROR, 'Lỗi khi lấy thông tin tuyến đường từ Vietmap');
    }
  }

  // Tính phí ship dựa trên khoảng cách
  calculateShippingFee(distance) {
    console.log('💰 [VIETMAP] Tính phí ship cho khoảng cách:', distance, 'km');
    
    // Công thức tính phí ship hợp lý hơn
    let shippingFee = 0;

    if (distance <= 1) {
      shippingFee = 8000; // 8.000đ cho khoảng cách 0-1km
    } else if (distance <= 3) {
      shippingFee = 12000; // 12.000đ cho khoảng cách 1-3km
    } else if (distance <= 5) {
      shippingFee = 18000; // 18.000đ cho khoảng cách 3-5km
    } else if (distance <= 10) {
      shippingFee = 25000; // 25.000đ cho khoảng cách 5-10km
    } else if (distance <= 15) {
      shippingFee = 35000; // 35.000đ cho khoảng cách 10-15km
    } else {
      // Trên 15km: 40.000đ + 3.000đ cho mỗi km vượt quá
      const extraKm = distance - 15;
      shippingFee = 40000 + (extraKm * 3000);
    }

    console.log('💵 [VIETMAP] Phí ship được tính:', shippingFee, 'VND');
    return shippingFee;
  }

  // Helper method để tính khoảng cách giữa 2 điểm
  calculateDistance(point1, point2) {
  const toRadians = (degree) => degree * (Math.PI / 180);
  const R = 6371; // Bán kính Trái Đất (km)

  const dLat = toRadians(point2.lat - point1.lat);
  const dLon = toRadians(point2.lon - point1.lon);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Trả về khoảng cách tính bằng km
}

  // Helper method để chuyển đổi độ sang radian
  toRadians(degrees) {
    return degrees * (Math.PI/180);
  }
}

export default VietmapShippingService; 