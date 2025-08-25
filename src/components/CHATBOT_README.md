# ChatBot Component - TapHoaSo

## 🎯 Tổng quan
ChatBot component đã được tích hợp với Backend API để cung cấp trải nghiệm chat thực tế với AI assistant.

## ✨ Tính năng

### 🔐 Authentication
- **Đã đăng nhập**: Sử dụng API Backend thực tế
- **Chưa đăng nhập**: Sử dụng fallback responses (demo mode)

### 🤖 AI Responses
- **Backend API**: Gọi AI service thực tế
- **Fallback**: Responses dựa trên từ khóa khi API fail
- **Context**: Lưu trữ lịch sử chat

### 💬 Chat Features
- Real-time messaging
- Typing indicators
- Message timestamps
- Quick action buttons
- Error handling
- Chat history management

## 🚀 Cách sử dụng

### 1. Import Component
```jsx
import ChatBot from './components/ChatBot';

// Sử dụng trong App hoặc component khác
function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatBot />
    </div>
  );
}
```

### 2. Authentication Context
ChatBot tự động sử dụng `useAuth()` context:
```jsx
const { isAuthenticated, user } = useAuth();
```

### 3. API Integration
- **Backend URL**: `VITE_API_URL` hoặc `http://localhost:3000/api`
- **Endpoints**: `/chat/init`, `/chat/send`, `/chat/history`, etc.

## 🔧 Configuration

### Environment Variables
```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

### API Endpoints
- `GET /chat/init` - Khởi tạo chat
- `POST /chat/send` - Gửi tin nhắn
- `GET /chat/history` - Lịch sử chat
- `GET /chat/stats` - Thống kê

## 📱 UI Components

### Chat Button
- Fixed position: bottom-right
- Green color scheme
- Hover effects và animations

### Chat Window
- Size: 384px × 500px
- Responsive design
- Header với gradient
- Messages area với scroll
- Input area với send button

### Message Types
- **User messages**: Green background, right-aligned
- **Bot messages**: Gray background, left-aligned
- **Options**: Quick action buttons
- **Timestamps**: Hiển thị thời gian

## 🎨 Styling

### Colors
- Primary: Green (`green-500`, `green-600`)
- Secondary: Gray (`gray-100`, `gray-800`)
- Error: Red (`red-100`, `red-800`)

### Animations
- Hover effects
- Typing indicators
- Smooth transitions
- Scale animations

## 🔄 State Management

### Local State
```jsx
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState([]);
const [inputValue, setInputValue] = useState('');
const [isTyping, setIsTyping] = useState(false);
const [chatId, setChatId] = useState(null);
const [error, setError] = useState(null);
```

### Message Format
```jsx
{
  id: number,
  type: 'user' | 'bot',
  content: string,
  options?: string[],
  timestamp?: Date
}
```

## 🧪 Testing

### Manual Testing
1. Mở browser
2. Click vào chat button
3. Gửi tin nhắn test
4. Kiểm tra responses

### API Testing
1. Đăng nhập vào app
2. Mở ChatBot
3. Gửi tin nhắn
4. Kiểm tra API calls trong Network tab

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed
- Kiểm tra Backend server có đang chạy không
- Kiểm tra `VITE_API_URL` trong .env
- Kiểm tra CORS configuration

#### 2. Authentication Issues
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra AuthContext có hoạt động không
- Kiểm tra localStorage

#### 3. Messages Not Loading
- Kiểm tra MongoDB connection
- Kiểm tra Chat model có được import không
- Kiểm tra console errors

### Debug Commands
```bash
# Backend
cd be && npm run dev

# Frontend
npm run dev

# Check API
curl http://localhost:3000/api/chat/init
```

## 📈 Performance

### Optimizations
- Lazy loading cho chat window
- Debounced input handling
- Efficient message rendering
- Memory cleanup khi đóng chat

### Best Practices
- Sử dụng `useCallback` cho handlers
- Sử dụng `useMemo` cho expensive operations
- Cleanup effects khi component unmount

## 🔮 Future Enhancements

### Phase 1 (Current)
- ✅ Basic chat functionality
- ✅ API integration
- ✅ Fallback responses
- ✅ Error handling

### Phase 2 (Next)
- 🔄 Real-time updates (WebSocket)
- 🔄 File attachments
- 🔄 Voice messages
- 🔄 Chat search

### Phase 3 (Future)
- 🔄 AI sentiment analysis
- 🔄 Product recommendations
- 🔄 Multi-language support
- 🔄 Chat analytics

## 📚 Dependencies

### Required
- React 18+
- Tailwind CSS
- React Router
- Axios (via secureApi service)

### Optional
- Framer Motion (for animations)
- React Query (for caching)
- Socket.io (for real-time)

## 🤝 Contributing

### Code Style
- Use functional components
- Use hooks for state management
- Follow React best practices
- Use TypeScript (if available)

### Testing
- Test authentication flows
- Test API integration
- Test error handling
- Test responsive design

---

**Status**: ✅ Complete with API integration
**Next**: Add real-time features và advanced AI capabilities
