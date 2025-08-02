# Quản lý Vai trò (Role Management)

## Tính năng mới: Chỉnh sửa vai trò người dùng

### Mô tả
Tính năng này cho phép admin chỉnh sửa vai trò của người dùng trong hệ thống. Có hai vai trò chính:
- **Người dùng (user)**: Quyền truy cập cơ bản
- **Quản trị viên (admin)**: Quyền quản trị toàn bộ hệ thống

### Cách sử dụng

#### 1. Truy cập trang quản lý khách hàng
- Đăng nhập với tài khoản admin
- Vào menu "Khách hàng" trong sidebar

#### 2. Chỉnh sửa vai trò
- Trong bảng danh sách khách hàng, mỗi dòng có cột "Vai trò" hiển thị vai trò hiện tại
- Click vào nút "..." (action dropdown) ở cuối dòng
- Chọn "Chỉnh sửa vai trò"
- Modal sẽ hiển thị với các tùy chọn:
  - **Người dùng**: Quyền truy cập cơ bản
  - **Quản trị viên**: Quyền quản trị toàn bộ hệ thống

#### 3. Lưu thay đổi
- Chọn vai trò mới
- Click "Lưu thay đổi"
- Hệ thống sẽ hiển thị thông báo thành công

### Cảnh báo bảo mật
- Khi chọn vai trò "Quản trị viên", hệ thống sẽ hiển thị cảnh báo
- Vai trò admin có quyền truy cập toàn bộ hệ thống
- Chỉ admin hiện tại mới có thể thay đổi vai trò của người dùng khác

### Backend API
- **Endpoint**: `PUT /api/users/:id`
- **Body**: `{ "role": "user" | "admin" }`
- **Validation**: Role phải là "user" hoặc "admin"

### Frontend Components
- **EditRoleModal**: Component modal để chỉnh sửa role
- **AdminUser**: Trang quản lý khách hàng với tính năng role management

### Database Schema
```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

### Lưu ý
- Chỉ admin mới có thể truy cập tính năng này
- Thay đổi vai trò sẽ có hiệu lực ngay lập tức
- Lịch sử thay đổi vai trò không được lưu trữ (có thể bổ sung trong tương lai)

## Bảo mật Admin

### Frontend Protection
- Tất cả route `/admin/*` được bảo vệ bởi `AdminProtected` component
- Kiểm tra token và role admin trước khi render
- Hiển thị trang 403 Forbidden nếu không có quyền

### Backend Protection
- Tất cả API admin được bảo vệ bởi `authMiddleware` và `isAdmin` middleware
- Kiểm tra JWT token và role admin
- Return 403 Forbidden nếu không có quyền

### Cách kiểm tra
1. **Admin user**: Có thể truy cập tất cả trang admin
2. **Regular user**: Sẽ thấy trang 403 khi truy cập `/admin/*`
3. **Unauthenticated**: Sẽ được redirect về login page 