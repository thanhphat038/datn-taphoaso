# MongoDB + Express + Nodejs

# datn-taphoaso

# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
API sử dụng JWT (JSON Web Token) để xác thực. Token được gửi trong header của request:


Dùng RestClient để testing API

## Response Format
Tất cả các response đều có format như sau:

```json
// Success response
{
  "data": object | array,
  "message": "string" // optional
}

// Error response
{
  "message": "string",
  "error": "string" // optional
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Notes
1. Tất cả các ID đều là MongoDB ObjectId
2. Các date format nên sử dụng ISO 8601
3. Các số tiền nên được gửi dưới dạng số nguyên
4. Các file ảnh nên được upload trước và sử dụng URL trong request 