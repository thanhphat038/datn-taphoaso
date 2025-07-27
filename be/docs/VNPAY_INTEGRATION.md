# VNPAY Integration Guide

## Overview
Hệ thống đã được tích hợp VNPAY để xử lý thanh toán và tự động cập nhật trạng thái đơn hàng.

## Flow hoạt động

### 1. Tạo thanh toán VNPAY
- Frontend tạo đơn hàng trước qua API `POST /orders`
- Frontend gọi API `POST /payment/create` với method "vnpay" và orderId
- Backend sử dụng orderId làm `vnp_TxnRef` và lưu vào field `vnpay_txn_ref`
- Backend tạo URL thanh toán VNPAY và trả về
- Frontend redirect user đến URL thanh toán

### 2. Xử lý callback VNPAY
- VNPAY redirect về `/payment/return` với các tham số
- Backend verify signature và xử lý kết quả
- Backend tìm order theo `vnpay_txn_ref` (từ `vnp_TxnRef`)
- Nếu thành công: cập nhật trạng thái đơn hàng thành "paid"
- Trả về kết quả cho frontend

## API Endpoints

### Tạo thanh toán VNPAY
```
POST /payment/create
Content-Type: application/json

{
  "method": "vnpay",
  "amount": 100000,
  "bankCode": "",
  "language": "vn",
  "orderId": "507f1f77bcf86cd799439011"
}
```

### Xử lý callback VNPAY
```
GET /payment/return?vnp_ResponseCode=00&vnp_TxnRef=27184919&...
```

### Test cập nhật trạng thái đơn hàng
```
POST /payment/test-update-status
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "orderId": "507f1f77bcf86cd799439011",
  "status": "paid"
}
```

### Test tìm order theo vnpay_txn_ref
```
GET /payment/find-order/27184919
```

## Trạng thái đơn hàng

Model Order đã được cập nhật với các trạng thái:
- `pending`: Chờ thanh toán
- `paid`: Đã thanh toán (VNPAY thành công)
- `processing`: Đang xử lý
- `delivered`: Đã giao hàng
- `cancelled`: Đã hủy

## VNPAY Response Codes

- `00`: Giao dịch thành công
- `24`: Giao dịch thất bại
- `51`: Tài khoản không đủ số dư
- `65`: Tài khoản vượt quá hạn mức
- `75`: Ngân hàng đang bảo trì
- `79`: Sai mật khẩu quá số lần
- `99`: Các lỗi khác

## Mapping OrderId và VNPAY TxnRef

### Vấn đề:
- MongoDB ObjectId: `507f1f77bcf86cd799439011` (24 ký tự)
- VNPAY TxnRef: `27193316` (8 ký tự số)

### Giải pháp:
1. **Tạo order trước** với MongoDB ObjectId
2. **Tạo txnRef ngắn** từ timestamp khi tạo URL VNPAY
3. **Lưu txnRef ngắn** vào field `vnpay_txn_ref` của order
4. **Tìm order** theo `vnpay_txn_ref` khi callback

### Flow chi tiết:
```
1. Tạo order → ObjectId: "507f1f77bcf86cd799439011"
2. Tạo VNPAY URL → txnRef: "27193316" (từ timestamp)
3. Lưu mapping → vnpay_txn_ref: "27193316"
4. VNPAY callback → vnp_TxnRef: "27193316"
5. Tìm order → findOne({ vnpay_txn_ref: "27193316" })
6. Cập nhật status → updateStatus(order._id, 'paid')
```

## Testing

### 1. Test tìm order theo vnpay_txn_ref
```
GET /payment/find-order/27184919
```

### 2. Test thanh toán thành công
```
GET /payment/return?vnp_ResponseCode=00&vnp_TxnRef=27184919&vnp_Amount=2400000&vnp_BankCode=VNPAY&vnp_CardType=QRCODE&vnp_PayDate=20250727175916&vnp_TransactionStatus=00&vnp_TransactionNo=123456&vnp_SecureHash=test_hash
```

### 3. Test thanh toán thất bại
```
GET /payment/return?vnp_ResponseCode=24&vnp_TxnRef=27184919&vnp_Amount=2400000&vnp_BankCode=VNPAY&vnp_CardType=QRCODE&vnp_PayDate=20250727175916&vnp_TransactionStatus=02&vnp_TransactionNo=0&vnp_SecureHash=test_hash
```

## Environment Variables

Đảm bảo các biến môi trường sau được cấu hình:
```
VNP_TMN_CODE=your_tmn_code
VNP_HASH_SECRET=your_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:5173/checkout/payment/vnpay_return
VNP_API=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

## Frontend Integration

Frontend đã được cập nhật để:
1. Tạo order trước qua API `/orders`
2. Gọi API tạo thanh toán VNPAY với orderId
3. Redirect đến trang processing
4. Xử lý callback từ VNPAY
5. Hiển thị kết quả thanh toán

## Troubleshooting

### Lỗi thường gặp:
1. **Invalid signature**: Kiểm tra VNP_HASH_SECRET
2. **Order not found**: Kiểm tra vnpay_txn_ref có được lưu đúng không
3. **Status update failed**: Kiểm tra quyền truy cập database

### Debug:
- Sử dụng API `/payment/find-order/:vnpayTxnRef` để kiểm tra mapping
- Kiểm tra logs backend để xem chi tiết lỗi
- Sử dụng API test để kiểm tra riêng từng chức năng
- Verify VNPAY response parameters

### Flow Debug:
1. Tạo order → Lấy ObjectId
2. Gọi createVNPayPayment với ObjectId → Lưu vnpay_txn_ref
3. VNPAY callback → Tìm order theo vnpay_txn_ref
4. Cập nhật trạng thái → Thành công 