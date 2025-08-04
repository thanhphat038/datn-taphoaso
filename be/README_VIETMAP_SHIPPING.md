# Vietmap Shipping Service

## Tổng quan

Vietmap Shipping Service là một module tính toán phí vận chuyển sử dụng Vietmap API. Service này cung cấp các tính năng:

- Tính phí vận chuyển dựa trên khoảng cách thực tế
- Tìm kiếm địa chỉ với autocomplete
- Chuyển đổi địa chỉ ↔ tọa độ
- Tính toán tuyến đường và thời gian di chuyển

## Cài đặt

### 1. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
VIETMAP_API_KEY=your_vietmap_api_key_here
```

### 2. Cấu trúc thư mục

```
be/src/services/shipping/
├── vietmapShipping.service.js    # Vietmap shipping service
├── shipping.service.js           # Google shipping service (cũ)
└── googleShipping.service.js     # Google shipping service (cũ)

be/src/controllers/
└── vietmapShipping.controller.js # Controller cho Vietmap shipping

be/src/routes/
└── vietmapShipping.route.js      # Routes cho Vietmap shipping

be/docs/
└── VIETMAP_SHIPPING_API.md      # API documentation
```

## Sử dụng

### 1. Tính phí vận chuyển từ địa chỉ

```javascript
// Frontend
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

// Sử dụng
const shippingInfo = await calculateShipping('123 Nguyễn Huệ, Quận 1, Hồ Chí Minh');
console.log('Shipping fee:', shippingInfo.shippingFee);
console.log('Distance:', shippingInfo.distance, 'km');
console.log('Estimated time:', shippingInfo.estimatedTime);
```

### 2. Tìm kiếm địa chỉ

```javascript
// Frontend
const searchAddresses = async (query) => {
  try {
    const response = await fetch(`/api/vietmap-shipping/search-addresses?query=${encodeURIComponent(query)}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error searching addresses:', error);
  }
};

// Sử dụng
const addresses = await searchAddresses('nguyen hue');
addresses.forEach(address => {
  console.log(address.display_name);
});
```

### 3. Tính phí vận chuyển từ tọa độ

```javascript
// Frontend
const calculateShippingFromCoords = async (lat, lon) => {
  try {
    const response = await fetch('/api/vietmap-shipping/calculate-from-coordinates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lon })
    });
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error calculating shipping from coordinates:', error);
  }
};

// Sử dụng
const shippingInfo = await calculateShippingFromCoords(10.7769, 106.7009);
```

## API Endpoints

### POST `/api/vietmap-shipping/calculate-from-address`
Tính phí vận chuyển từ địa chỉ

**Request:**
```json
{
  "deliveryAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Tính phí vận chuyển thành công",
  "data": {
    "distance": 3.45,
    "duration": 12,
    "shippingFee": 15000,
    "deliveryAddress": "123 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam",
    "storeAddress": "159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam",
    "estimatedTime": "12 phút"
  }
}
```

### POST `/api/vietmap-shipping/calculate-from-coordinates`
Tính phí vận chuyển từ tọa độ

### GET `/api/vietmap-shipping/search-addresses`
Tìm kiếm địa chỉ với autocomplete

### GET `/api/vietmap-shipping/get-address-from-coordinates`
Lấy địa chỉ từ tọa độ (reverse geocoding)

### GET `/api/vietmap-shipping/api-status`
Kiểm tra trạng thái API

### POST `/api/vietmap-shipping/calculate-with-route-details`
Tính phí vận chuyển với thông tin chi tiết tuyến đường

## Bảng giá vận chuyển

| Khoảng cách | Phí vận chuyển |
|-------------|----------------|
| ≤ 5km | 15,000 VND |
| 5-10km | 25,000 VND |
| 10-20km | 35,000 VND |
| 20-30km | 45,000 VND |
| > 30km | 55,000 VND |

**Lưu ý:** Nếu thời gian di chuyển > 60 phút, sẽ cộng thêm 10,000 VND.

## Địa chỉ cửa hàng

- **Địa chỉ**: 159 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh, Vietnam
- **Tọa độ**: 10.7829, 106.7009

## Testing

Chạy test để kiểm tra API:

```bash
cd be
node test_vietmap_shipping.js
```

## Error Handling

Service xử lý các lỗi sau:

- `VALIDATION_ERROR`: Lỗi validation dữ liệu đầu vào
- `CONFIGURATION_ERROR`: Lỗi cấu hình API key
- `BUSINESS_INVALID_OPERATION`: Không thể tìm thấy địa chỉ hoặc tính toán tuyến đường
- `EXTERNAL_SERVICE_ERROR`: Lỗi từ Vietmap API

## Cache

Service sử dụng cache đơn giản để lưu kết quả geocoding, giúp tăng hiệu suất cho các địa chỉ được truy vấn nhiều lần.

## Security

- API key được lưu trong environment variables
- Tất cả requests đều sử dụng HTTPS
- Validation đầy đủ cho tất cả input parameters

## Performance

- Timeout cho API calls: 5-10 giây
- Cache cho geocoding results
- Error handling với retry logic
- Rate limiting (nếu cần)

## Troubleshooting

### Lỗi "API key not configured"
- Kiểm tra file `.env` có `VIETMAP_API_KEY`
- Đảm bảo server đã restart sau khi thêm environment variable

### Lỗi "Invalid API key"
- Kiểm tra API key có đúng không
- Đảm bảo API key có quyền truy cập Vietmap API

### Lỗi "Không thể tìm thấy địa chỉ"
- Kiểm tra địa chỉ có đúng định dạng không
- Thử với địa chỉ khác

### Lỗi timeout
- Kiểm tra kết nối internet
- Thử lại sau vài phút
- Liên hệ admin nếu vấn đề kéo dài 