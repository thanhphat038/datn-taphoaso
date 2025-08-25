# Chat API Documentation

## Tổng quan
Chat API cho phép khách hàng chat với trợ lý ảo AI của TapHoaSo để được hỗ trợ mua sắm và giải đáp thắc mắc.

## Tính năng chính
- ✅ Chat real-time với AI
- ✅ Lưu trữ lịch sử chat
- ✅ Phân trang chat history
- ✅ Thống kê chat
- ✅ Tìm kiếm trong chat history
- ✅ Quản lý trạng thái chat (active/closed)

## API Endpoints

### Base URL
```
http://localhost:5000/api/chat
```

### 1. Khởi tạo/Lấy chat
```http
GET /init
Authorization: Bearer <token>
```

### 2. Gửi tin nhắn
```http
POST /send
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Xin chào, tôi muốn hỏi về sản phẩm"
}
```

### 3. Lấy lịch sử chat
```http
GET /history?page=1&limit=20
Authorization: Bearer <token>
```

### 4. Lấy thống kê
```http
GET /stats
Authorization: Bearer <token>
```

### 5. Lấy chat cụ thể
```http
GET /:chatId
Authorization: Bearer <token>
```

### 6. Đóng chat
```http
PUT /:chatId/close
Authorization: Bearer <token>
```

### 7. Xóa chat
```http
DELETE /:chatId
Authorization: Bearer <token>
```

### 8. Lấy tin nhắn mới
```http
GET /:chatId/latest?lastMessageId=<messageId>
Authorization: Bearer <token>
```

### 9. Tìm kiếm
```http
GET /search?query=<searchTerm>&page=1&limit=20
Authorization: Bearer <token>
```

## Database Schema

### Chat Model
```javascript
{
  userId: ObjectId,        // ID của user
  messages: [              // Array tin nhắn
    {
      role: String,        // 'user' hoặc 'assistant'
      content: String,     // Nội dung tin nhắn
      timestamp: Date      // Thời gian gửi
    }
  ],
  status: String,          // 'active' hoặc 'closed'
  createdAt: Date,         // Thời gian tạo
  updatedAt: Date          // Thời gian cập nhật
}
```

## AI Service

### Hiện tại (Placeholder)
- Sử dụng fallback responses dựa trên từ khóa
- Hỗ trợ các chủ đề: chào hỏi, giá cả, giao hàng, thanh toán, sản phẩm

### Tương lai (TODO)
- Tích hợp OpenAI GPT, Claude, hoặc AI service khác
- Phân tích sentiment
- Gợi ý sản phẩm thông minh
- Hỗ trợ đa ngôn ngữ

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Lỗi",
  "error": {
    "code": 2001,
    "status": 400,
    "description": "Mô tả lỗi"
  }
}
```

## Error Codes

| Code | Status | Mô tả |
|------|--------|-------|
| 2001 | 400 | Tin nhắn không được để trống |
| 2002 | 400 | Tin nhắn quá dài |
| 2003 | 400 | Từ khóa tìm kiếm không được để trống |
| 4001 | 404 | Không tìm thấy chat |
| 5001 | 500 | Không thể tạo/lấy chat |
| 5002 | 500 | Không thể gửi tin nhắn |
| 5003 | 500 | Không thể lấy lịch sử chat |
| 5004 | 500 | Không thể lấy thông tin chat |
| 5005 | 500 | Không thể đóng chat |
| 5006 | 500 | Không thể xóa chat |
| 5007 | 500 | Không thể lấy thống kê |

## Giới hạn và Quy tắc

- **Tin nhắn**: Tối đa 1000 ký tự
- **Phân trang**: Mặc định 20 items/page
- **Authentication**: Bắt buộc cho tất cả endpoints
- **Rate limiting**: Áp dụng theo cấu hình chung

## Testing

### Sử dụng REST Client
1. Cài đặt REST Client extension trong VS Code
2. Mở file `api_chat.http`
3. Thay thế `{{base_url}}` và `{{access_token}}`
4. Test các endpoints

### Sử dụng Postman
1. Import collection từ file documentation
2. Set environment variables
3. Test các API endpoints

## Deployment Notes

### Environment Variables
```bash
# AI Service (tương lai)
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key

# Chat Configuration
MAX_MESSAGE_LENGTH=1000
CHAT_HISTORY_LIMIT=20
```

### Performance
- Index trên `userId` và `createdAt`
- Pagination cho chat history
- Caching cho AI responses (tương lai)

## Roadmap

### Phase 1 (Hiện tại)
- ✅ Basic chat functionality
- ✅ Fallback AI responses
- ✅ Chat history management

### Phase 2 (Tương lai)
- 🔄 Real AI integration
- 🔄 Sentiment analysis
- 🔄 Product recommendations
- 🔄 Multi-language support

### Phase 3 (Nâng cao)
- 🔄 Voice chat
- 🔄 Image recognition
- 🔄 Advanced analytics
- 🔄 Chatbot training

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ:
- Email: support@taphoaso.com
- Hotline: 1900-xxxx
- Documentation: `/docs/api_chat.http`
