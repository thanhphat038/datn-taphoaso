# Email Setup Guide

## Cấu hình Email cho chức năng Quên mật khẩu

### 1. Tạo file .env trong thư mục backend

Tạo file `.env` trong thư mục `be/` với nội dung sau:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAILER_NAME=TapHoaSo
```

### 2. Cấu hình Gmail (Khuyến nghị)

#### Bước 1: Bật xác thực 2 yếu tố
- Vào Google Account Settings
- Bật "2-Step Verification"

#### Bước 2: Tạo App Password
- Vào "Security" > "App passwords"
- Chọn "Mail" và "Other (Custom name)"
- Đặt tên (ví dụ: "TapHoaSo")
- Copy mật khẩu được tạo ra

#### Bước 3: Cập nhật .env
```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 3. Cấu hình SMTP khác

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### Custom SMTP Server
```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
```

### 4. Kiểm tra cấu hình

Sau khi cấu hình, khởi động lại server và kiểm tra console:

```
✅ SMTP transporter created successfully
```

Nếu có lỗi:
```
❌ SMTP configuration error: Missing required SMTP environment variables: SMTP_HOST, SMTP_PORT
📧 Email functionality will be disabled. Please check your .env file.
```

### 5. Test chức năng

1. Vào trang Login
2. Click "Quên mật khẩu?"
3. Nhập email hợp lệ
4. Kiểm tra hộp thư email

### 6. Troubleshooting

#### Lỗi "Email authentication failed"
- Kiểm tra SMTP_USER và SMTP_PASS
- Đảm bảo đã bật xác thực 2 yếu tố và tạo App Password

#### Lỗi "Cannot connect to SMTP server"
- Kiểm tra SMTP_HOST và SMTP_PORT
- Kiểm tra firewall/antivirus

#### Lỗi "SMTP connection timeout"
- Kiểm tra kết nối mạng
- Thử tăng timeout trong cấu hình

### 7. Fallback Mode

Nếu email không hoạt động, hệ thống vẫn tạo token reset password và trả về thành công, nhưng không gửi email. Người dùng có thể sử dụng token trực tiếp.

### 8. Security Notes

- Không commit file .env vào git
- Sử dụng App Password thay vì mật khẩu chính
- Định kỳ thay đổi App Password
- Giới hạn quyền truy cập của App Password
