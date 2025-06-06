# TapHoaSo Backend API

Backend API cho ứng dụng TapHoaSo.

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- MongoDB
- npm 

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd taphoaso/be
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env từ .env.example:
```bash
cp .env.example .env
```

4. Cấu hình các biến môi trường trong file .env:
Theo .env.example

## Chạy ứng dụng

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## API Documentation

Xem chi tiết API tại [API.md](./docs/API.md)

## Cấu trúc thư mục

```
be/
├── src/
│   ├── config/         # Cấu hình (database, env)
│   ├── controllers/    # Controllers xử lý request
│   ├── middlewares/    # Middleware (auth, error handling)
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── app.js         # Express app configuration
├── docs/              # Documentation
├── .env              # Environment variables
├── .env.example      # Example environment variables
├── package.json      # Project dependencies
└── server.js         # Server entry point
```

## Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Token được gửi trong header của request:

```
Authorization: Bearer <token>
```

## Error Handling

Tất cả các lỗi đều được trả về dưới dạng JSON với format:

```json
{
  "message": "Error message",
  "error": "Error details (only in development)"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
