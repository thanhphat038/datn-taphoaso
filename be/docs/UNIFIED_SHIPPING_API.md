# Unified Shipping API Documentation

## Tổng quan

Unified Shipping API là một API thống nhất để xử lý tất cả các dịch vụ vận chuyển, bao gồm:
- Default Shipping Service
- Vietmap Shipping Service

## Base URL
```
/api/shipping
```

## Các Service có sẵn

### 1. Default Shipping Service
- **ID**: `default`
- **Tính năng**: Tính phí vận chuyển cơ bản
- **Phù hợp**: Ứng dụng đơn giản, không cần tính năng nâng cao

### 2. Vietmap Shipping Service
- **ID**: `vietmap`
- **Tính năng**: Tính phí vận chuyển nâng cao với geocoding chính xác
- **Phù hợp**: Ứng dụng cần tính năng đầy đủ

## Endpoints

### Protected Endpoints (Cần authentication)

#### 1. Tính phí ship từ địa chỉ
```http
POST /api/shipping/calculate-from-address
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "deliveryAddress": "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh",
  "service": "vietmap"
}
```

**Parameters:**
- `deliveryAddress` (required): Địa chỉ giao hàng
- `service` (optional): `default` hoặc `vietmap` (mặc định: `default`)

**Response (Default Service):**
```json
{
  "success": true,
  "data": {
    "shippingFee": 15000,
    "distance": 2.5,
    "coordinates": {
      "lat": 10.7829,
      "lon": 106.7009
    },
    "address": "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh"
  },
  "message": "Tính phí vận chuyển thành công"
}
```

**Response (Vietmap Service):**
```json
{
  "success": true,
  "data": {
    "shippingFee": 15000,
    "distance": 2.5,
    "coordinates": {
      "lat": 10.7829,
      "lon": 106.7009,
      "display_name": "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh",
      "address": {
        "house_number": "159",
        "street": "Nguyễn Đình Chiểu",
        "ward": "Phường 6",
        "district": "Quận 3",
        "city": "Hồ Chí Minh"
      }
    },
    "address": "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh"
  },
  "message": "Tính phí vận chuyển thành công"
}
```

## Cách sử dụng

### 1. Tính phí ship với Default Service
```javascript
const response = await fetch('/api/shipping/calculate-from-address', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-token>'
  },
  body: JSON.stringify({
    deliveryAddress: "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh",
    service: "default"
  })
});
```

### 2. Tính phí ship với Vietmap Service
```javascript
const response = await fetch('/api/shipping/calculate-from-address', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <your-token>'
  },
  body: JSON.stringify({
    deliveryAddress: "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh",
    service: "vietmap"
  })
});
```

## Công thức tính phí ship

### Default Service
- ≤ 1km: 8.000đ
- 1-3km: 12.000đ
- 3-5km: 18.000đ
- 5-10km: 25.000đ
- 10-15km: 35.000đ
- 15-20km: 45.000đ
- > 20km: 55.000đ

### Vietmap Service
- ≤ 1km: 8.000đ
- 1-3km: 12.000đ
- 3-5km: 18.000đ
- 5-10km: 25.000đ
- 10-15km: 35.000đ
- > 15km: 40.000đ + 3.000đ/km vượt quá

## Error Codes

| Code | Message | Mô tả |
|------|---------|-------|
| `VALIDATION_ERROR` | Địa chỉ giao hàng là bắt buộc | Thiếu thông tin địa chỉ |
| `CONFIGURATION_ERROR` | Vietmap API key not configured | Chưa cấu hình API key |
| `BUSINESS_INVALID_OPERATION` | Không tìm thấy địa chỉ | Địa chỉ không tồn tại |
| `EXTERNAL_SERVICE_ERROR` | Lỗi khi lấy thông tin địa chỉ | Lỗi từ service bên ngoài |

## Cấu hình

### Environment Variables
```env
VIETMAP_API_KEY=your_vietmap_api_key_here
```

### Cửa hàng mặc định
- **Địa chỉ**: 159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh
- **Tọa độ**: 10.782238, 106.683384

## Lưu ý

1. **Authentication**: Tất cả endpoints đều yêu cầu authentication
2. **Rate Limiting**: Vietmap API có giới hạn số lượng request
3. **Caching**: Vietmap service có cache địa chỉ để tối ưu performance
4. **Error Handling**: Tất cả lỗi đều được trả về với format thống nhất
5. **Service Selection**: Có thể chọn service phù hợp với nhu cầu 