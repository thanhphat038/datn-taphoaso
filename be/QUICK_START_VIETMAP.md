# Quick Start - Vietmap Shipping Service

## 🚀 Cài đặt nhanh

### 1. Thêm API Key vào .env
```env
VIETMAP_API_KEY=your_vietmap_api_key_here
```

### 2. Khởi động server
```bash
cd be
npm start
```

## 🧪 Test nhanh

### Test với địa chỉ cụ thể:
```bash
node demo_shipping_calculation.js
```

### Test với nhiều địa chỉ:
```bash
node test_shipping_calculation.js
```

## 📍 Địa chỉ mặc định

- **Cửa hàng**: 200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh
- **Khách hàng**: 10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh

## 💰 Công thức tính phí

- **0-3km**: 15,000 VND
- **3-7km**: 25,000 VND  
- **>7km**: 35,000 VND + 5,000 VND/km vượt quá

## 🔧 API Endpoint chính

**POST** `/api/vietmap-shipping/calculate-shipping-fee`

```javascript
// Request
{
  "customerAddress": "10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh"
}

// Response
{
  "distanceInKm": 4.5,
  "durationInMin": 12,
  "shippingFee": 25000
}
```

## 📝 Sử dụng trong Frontend

```javascript
const calculateShipping = async (customerAddress) => {
  try {
    const response = await fetch('/api/vietmap-shipping/calculate-shipping-fee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerAddress })
    });
    
    const result = await response.json();
    return result.data; // { distanceInKm, durationInMin, shippingFee }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Sử dụng
const shippingInfo = await calculateShipping('10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh');
console.log('Shipping fee:', shippingInfo.shippingFee);
```

## ⚠️ Lưu ý

1. Đảm bảo API key hợp lệ
2. Địa chỉ phải chính xác và đầy đủ
3. Server phải có kết nối internet để gọi Vietmap API
4. Timeout mặc định: 10 giây cho route API

## 🐛 Troubleshooting

- **"API key not configured"**: Kiểm tra file .env
- **"Invalid API key"**: Kiểm tra API key có đúng không
- **"Không thể tìm thấy địa chỉ"**: Thử với địa chỉ khác hoặc format khác 