# VNPAY Integration Testing Guide

## Overview
Hướng dẫn test toàn bộ flow VNPAY từ tạo order đến callback.

## Prerequisites
1. Backend server đang chạy trên `http://localhost:3000`
2. Có auth token hợp lệ
3. Có product với ID `6862d1c32df5d5159cc51ef2` trong database

## Test Steps

### 1. Lấy Auth Token
```bash
# Login để lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your_email@example.com",
    "password": "your_password"
  }'
```

### 2. Cập nhật Token trong Script
Mở file `test_vnpay_flow.js` và thay đổi:
```javascript
const AUTH_TOKEN = 'your_actual_token_here';
```

### 3. Chạy Test Script
```bash
cd be
node test_vnpay_flow.js
```

## Expected Results

### Step 1: Create Order
- ✅ Order được tạo với status `pending`
- ✅ Order ID được trả về

### Step 2: Create VNPAY Payment
- ✅ VNPAY URL được tạo
- ✅ `vnpay_txn_ref` được lưu vào order

### Step 3: Check Order
- ✅ Order có `vnpay_txn_ref` field
- ✅ `vnpay_txn_ref` là chuỗi 8 ký tự số

### Step 4: Find Order by vnpay_txn_ref
- ✅ Order được tìm thấy theo `vnpay_txn_ref`

### Step 5: Test Callback
- ✅ Order status được cập nhật thành `paid`

## Manual Testing

### Test via Frontend
1. Mở frontend: `http://localhost:5173`
2. Login và thêm sản phẩm vào cart
3. Vào checkout và chọn VNPAY
4. Xem console logs để debug

### Test via API
```bash
# 1. Tạo order
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Building A, Room 101, Ward, District, City",
    "receiver": "Nguyen Van A",
    "sdt": "0123456789",
    "items": [{"product_id": "6862d1c32df5d5159cc51ef2", "qty": 1}],
    "payment_method": "vnpay",
    "note": "",
    "total_amount": 23000
  }'

# 2. Tạo VNPAY payment (thay ORDER_ID)
curl -X POST http://localhost:3000/api/payment/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "method": "vnpay",
    "amount": 23000,
    "bankCode": "",
    "language": "vn",
    "orderId": "ORDER_ID_FROM_STEP_1"
  }'

# 3. Test callback (thay TXN_REF)
curl "http://localhost:3000/api/payment/return?vnp_ResponseCode=00&vnp_TxnRef=TXN_REF&vnp_Amount=2300000&vnp_TransactionStatus=00"
```

## Debug Commands

### Xem tất cả orders có vnpay_txn_ref
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/payment/all-orders-with-vnpay-ref
```

### Tìm order theo vnpay_txn_ref
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/payment/find-order/TXN_REF
```

### Xem order details
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/orders/ORDER_ID
```

## Troubleshooting

### Lỗi "Order not found"
- Kiểm tra `vnpay_txn_ref` có được lưu đúng không
- Kiểm tra `vnp_TxnRef` từ callback có match với `vnpay_txn_ref` không

### Lỗi "Invalid signature"
- Kiểm tra VNP_HASH_SECRET trong .env
- Kiểm tra VNPAY configuration

### Lỗi "Product not found"
- Kiểm tra product ID có tồn tại trong database không
- Kiểm tra product có đủ stock không

## Logs to Check

### Backend Logs
```bash
# Xem logs khi tạo order
console.log('Order created:', orderResponse);

# Xem logs khi tạo VNPAY payment
console.log('Saved vnpay_txn_ref:', txnRef, 'for order:', orderId);

# Xem logs khi callback
console.log('VNPAY Callback Result:', callbackResult);
console.log('Looking for order with vnpay_txn_ref:', vnpayTxnRef);
```

### Frontend Logs
```javascript
// Trong Checkout.jsx
console.log('Order ID from response:', orderResponse._id);
console.log('Payment data with orderId:', paymentData);

// Trong PaymentProcessing.jsx
console.log('Order ID from orderData:', orderData?._id);
console.log('Full orderData object:', JSON.stringify(orderData, null, 2));
``` 