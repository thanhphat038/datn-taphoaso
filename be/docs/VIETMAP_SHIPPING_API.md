# Vietmap Shipping API Documentation

## Tổng quan

API Vietmap Shipping sử dụng Vietmap API để tính toán phí vận chuyển dựa trên khoảng cách thực tế và thời gian di chuyển từ cửa hàng đến địa chỉ khách hàng.

## Cấu hình

### Environment Variables

Thêm vào file `.env`:

```env
VIETMAP_API_KEY=your_vietmap_api_key_here
```

### Địa chỉ cửa hàng

- **Địa chỉ**: 200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh
- **Tọa độ**: 10.7829, 106.7009

## API Endpoints

### 1. Tính phí ship từ địa chỉ

**POST** `/api/vietmap-shipping/calculate-from-address`

**Request Body:**
```json
{
  "deliveryAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tính phí vận chuyển thành công",
  "data": {
    "distance": 3.45,
    "duration": 12,
    "shippingFee": 15000,
    "deliveryAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam",
    "storeAddress": "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam",
    "storeCoordinates": {
      "lat": 10.7829,
      "lon": 106.7009
    },
    "deliveryCoordinates": {
      "lat": 10.7769,
      "lon": 106.7009
    },
    "estimatedTime": "12 phút"
  }
}
```

### 2. Tính phí ship từ tọa độ

**POST** `/api/vietmap-shipping/calculate-from-coordinates`

**Request Body:**
```json
{
  "lat": 10.7769,
  "lon": 106.7009
}
```

**Response:** Tương tự như endpoint trên

### 3. Tìm kiếm địa chỉ (Autocomplete)

**GET** `/api/vietmap-shipping/search-addresses?query=nguyen hue`

**Response:**
```json
{
  "success": true,
  "message": "Tìm kiếm địa chỉ thành công",
  "data": [
    {
      "display_name": "Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam",
      "address": {
        "road": "Nguyễn Huệ",
        "district": "Quận 1",
        "city": "Hồ Chí Minh",
        "country": "Vietnam"
      },
      "coordinates": {
        "lat": 10.7769,
        "lon": 106.7009
      }
    }
  ]
}
```

### 4. Lấy địa chỉ từ tọa độ (Reverse Geocoding)

**GET** `/api/vietmap-shipping/get-address-from-coordinates?lat=10.7769&lon=106.7009`

**Response:**
```json
{
  "success": true,
  "message": "Lấy thông tin địa chỉ thành công",
  "data": {
    "address": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam",
    "lat": 10.7769,
    "lon": 106.7009,
    "addressDetails": {
      "road": "Nguyễn Huệ",
      "district": "Quận 1",
      "city": "Hồ Chí Minh",
      "country": "Vietnam"
    }
  }
}
```

### 5. Kiểm tra trạng thái API

**GET** `/api/vietmap-shipping/api-status`

**Response:**
```json
{
  "success": true,
  "message": "Kiểm tra trạng thái API thành công",
  "data": {
    "status": "ok",
    "message": "API is working"
  }
}
```

### 6. Tính phí ship với thông tin chi tiết tuyến đường

**POST** `/api/vietmap-shipping/calculate-with-route-details`

**Request Body:**
```json
{
  "deliveryAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tính phí vận chuyển với thông tin tuyến đường thành công",
  "data": {
    "distance": 3.45,
    "duration": 12,
    "fromAddress": "200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh",
    "toAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam",
    "fromCoordinates": {
      "lat": 10.7829,
      "lon": 106.7009
    },
    "toCoordinates": {
      "lat": 10.7769,
      "lon": 106.7009
    },
    "shippingFee": 15000,
    "estimatedTime": "12 phút",
    "distanceFormatted": "3.45 km"
  }
}
```

### 7. Hàm calculateShippingFee theo yêu cầu

**POST** `/api/vietmap-shipping/calculate-shipping-fee`

**Request Body:**
```json
{
  "customerAddress": "10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tính phí vận chuyển thành công",
  "data": {
    "distanceInKm": 4.5,
    "durationInMin": 12,
    "shippingFee": 25000
  }
}
```

## Bảng giá vận chuyển

| Khoảng cách | Phí vận chuyển |
|-------------|----------------|
| 0-3km | 15,000 VND |
| 3-7km | 25,000 VND |
| > 7km | 35,000 VND + 5,000 VND/km vượt quá |

**Công thức tính phí:**
- 0-3km: 15,000 VND
- 3-7km: 25,000 VND  
- Trên 7km: 35,000 VND + 5,000 VND cho mỗi km vượt quá

## Error Codes

- `VALIDATION_ERROR`: Lỗi validation dữ liệu đầu vào
- `CONFIGURATION_ERROR`: Lỗi cấu hình API key
- `BUSINESS_INVALID_OPERATION`: Không thể tìm thấy địa chỉ hoặc tính toán tuyến đường
- `EXTERNAL_SERVICE_ERROR`: Lỗi từ Vietmap API

## Tính năng

1. **Geocoding**: Chuyển đổi địa chỉ thành tọa độ
2. **Reverse Geocoding**: Chuyển đổi tọa độ thành địa chỉ
3. **Route Calculation**: Tính toán tuyến đường và thời gian di chuyển
4. **Address Autocomplete**: Tìm kiếm địa chỉ với gợi ý
5. **Caching**: Cache kết quả geocoding để tăng hiệu suất
6. **Error Handling**: Xử lý lỗi chi tiết với các mã lỗi cụ thể

## Sử dụng trong Frontend

```javascript
// Tính phí ship từ địa chỉ
const calculateShipping = async (deliveryAddress) => {
  try {
    const response = await fetch('/api/vietmap-shipping/calculate-from-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deliveryAddress })
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error calculating shipping:', error);
  }
};

// Tìm kiếm địa chỉ
const searchAddresses = async (query) => {
  try {
    const response = await fetch(`/api/vietmap-shipping/search-addresses?query=${encodeURIComponent(query)}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error searching addresses:', error);
  }
};
``` 