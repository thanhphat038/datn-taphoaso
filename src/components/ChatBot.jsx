import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatService from '../service/Chat.service.js';
import { MessageCircle, X, Trash2, Send, Bot } from 'lucide-react';

const ChatBot = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Khởi tạo chat khi mở chatbot
  const initializeChat = async () => {
    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, hiển thị tin nhắn mặc định
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'Xin chào! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:',
          options: [
            { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
            { text: '📞 Liên hệ hỗ trợ', action: 'navigate', path: '/contact' },
          ]
        }
      ]);
      return;
    }

    try {
      setError(null);
      const response = await ChatService.initChat();
      
      if (response.status === 200 && response.data) {
        setChatId(response.data.chatId);
        
        // Chuyển đổi messages từ API format sang component format
        const convertedMessages = response.data.messages.map((msg, index) => ({
          id: index + 1,
          type: msg.role === 'assistant' ? 'bot' : 'user',
          content: msg.content,
          timestamp: msg.timestamp
        }));

        // Nếu chưa có tin nhắn nào, thêm tin nhắn chào mừng
        if (convertedMessages.length === 0) {
          convertedMessages.push({
            id: 1,
            type: 'bot',
            content: `Xin chào ${user.username}! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:`,
            options: [
              { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
              { text: '🛒 Đặt hàng ngay', action: 'navigate', path: '/cart' },
              { text: '👤 Thông tin tài khoản', action: 'navigate', path: '/profile' }
            ]
          });
        }

        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Không thể kết nối với chatbot. Vui lòng thử lại sau.');
      
      // Fallback to default messages
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Xin chào ${user.username}! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:`,
          options: [
            { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
            { text: '🛒 Đặt hàng ngay', action: 'navigate', path: '/cart' },
            { text: '👤 Thông tin tài khoản', action: 'navigate', path: '/profile' }
          ]
        }
      ]);
    }
  };

  // Khởi tạo chat khi mở chatbot
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      initializeChat();
    }
  }, [isOpen, isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Thêm tin nhắn của user
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Nếu chưa đăng nhập, sử dụng fallback response
    if (!isAuthenticated) {
      setTimeout(() => {
        const botResponse = generateBotResponse(message);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      setError(null);
      const response = await ChatService.sendMessage(message);
      
      if (response.status === 200 && response.data) {
        // Thêm phản hồi từ AI
        const aiMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.aiResponse,
          timestamp: new Date(),
          // Nếu API trả về options, sử dụng chúng, nếu không thì tạo options mặc định
          options: response.data.options || generateDefaultOptions(message)
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Nếu API fail, sử dụng fallback
        const botResponse = generateBotResponse(message);
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      
      // Fallback to local response
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateDefaultOptions = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Tạo options mặc định dựa trên nội dung tin nhắn
    if (lowerMessage.includes('tìm') || lowerMessage.includes('search') || lowerMessage.includes('sản phẩm')) {
      return [
        { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
        { text: '💰 Xem khuyến mãi', action: 'message', value: 'Khuyến mãi hiện tại' },
        { text: '📞 Liên hệ hỗ trợ', action: 'navigate', path: '/contact' }
      ];
    }
    
    if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua') || lowerMessage.includes('order')) {
      if (isAuthenticated) {
        return [
          { text: '🛒 Thêm vào giỏ hàng', action: 'navigate', path: '/product' },
          { text: '📦 Xem giỏ hàng hiện tại', action: 'navigate', path: '/cart' },
          { text: '💳 Thanh toán ngay', action: 'navigate', path: '/checkout' }
        ];
      } else {
        return [
          { text: '👤 Đăng nhập trước', action: 'navigate', path: '/login' },
          { text: '📝 Đăng ký tài khoản', action: 'navigate', path: '/register' }
        ];
      }
    }
    
    // Options mặc định cho các trường hợp khác
    return isAuthenticated ? [
      { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
      { text: '🛒 Đặt hàng ngay', action: 'navigate', path: '/cart' },
      { text: '👤 Thông tin tài khoản', action: 'navigate', path: '/profile' }
    ] : [
      { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
      { text: '👤 Đăng nhập/Đăng ký', action: 'navigate', path: '/login' },
      { text: '📞 Liên hệ hỗ trợ', action: 'navigate', path: '/contact' }
    ];
  };

  const generateBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Xử lý khác nhau cho user đã đăng nhập và chưa đăng nhập
    if (lowerMessage.includes('tìm') || lowerMessage.includes('search') || lowerMessage.includes('sản phẩm')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Bạn muốn tìm sản phẩm gì? Tôi có thể giúp bạn tìm:',
        options: [
          { text: '🥛 Sữa và đồ uống', action: 'navigate', path: '/product' },
          { text: '🍪 Bánh kẹo', action: 'navigate', path: '/product' },
          { text: '🧴 Mỹ phẩm', action: 'navigate', path: '/product' }
        ]
      };
    }
    
    if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua') || lowerMessage.includes('order')) {
      if (isAuthenticated) {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Bạn có thể đặt hàng ngay:',
          options: [
            { text: '🛒 Thêm vào giỏ hàng', action: 'navigate', path: '/product' },
            { text: '📦 Xem giỏ hàng hiện tại', action: 'navigate', path: '/cart' },
            { text: '💳 Thanh toán ngay', action: 'navigate', path: '/checkout' }
          ]
        };
      } else {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Để đặt hàng, bạn cần:',
          options: [
            { text: '👤 Đăng nhập trước', action: 'navigate', path: '/login' },
            { text: '📝 Đăng ký tài khoản', action: 'navigate', path: '/register' },
            { text: '📱 Gọi hotline: 1900-xxxx', action: 'message', value: 'Liên hệ hotline' }
          ]
        };
      }
    }
    
    if (lowerMessage.includes('đăng nhập') || lowerMessage.includes('login')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Bạn có thể đăng nhập bằng:',
        options: [
          { text: '📧 Email', action: 'navigate', path: '/login' },
          { text: '📱 Số điện thoại', action: 'navigate', path: '/login' },
          { text: '👤 Tên đăng nhập', action: 'navigate', path: '/login' },
          { text: '📝 Tạo tài khoản mới', action: 'navigate', path: '/register' }
        ]
      };
    }
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Giá sản phẩm được hiển thị trên từng sản phẩm. Bạn có thể xem chi tiết bằng cách click vào sản phẩm.',
        options: [
          { text: '🔍 Tìm sản phẩm theo giá', action: 'navigate', path: '/product' },
          { text: '💰 Khuyến mãi hiện tại', action: 'message', value: 'Khuyến mãi hiện tại' }
        ]
      };
    }
    
    if (lowerMessage.includes('ship') || lowerMessage.includes('giao hàng') || lowerMessage.includes('delivery')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Thông tin giao hàng:',
        options: [
          { text: '🚚 Phí ship: 15k-55k tùy khoảng cách', action: 'message', value: 'Chi tiết phí ship' },
          { text: '⏰ Thời gian: 2-4 giờ trong nội thành', action: 'message', value: 'Thời gian giao hàng' }
        ]
      };
    }
    
    if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('order')) {
      if (isAuthenticated) {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Bạn có thể xem đơn hàng:',
          options: [
            { text: '📦 Xem đơn hàng', action: 'navigate', path: '/profile/orders' },
            { text: '👤 Vào trang cá nhân', action: 'navigate', path: '/profile' }
          ]
        };
      } else {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Để xem đơn hàng, bạn cần đăng nhập trước.',
                  options: [
          { text: '👤 Đăng nhập ngay', action: 'navigate', path: '/login' },
          { text: '📝 Đăng ký tài khoản', action: 'navigate', path: '/register' }
        ]
        };
      }
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: 'Tôi không hiểu rõ yêu cầu của bạn. Bạn có thể thử:',
      options: isAuthenticated ? [
        { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
        { text: '🛒 Đặt hàng ngay', action: 'navigate', path: '/cart' },
        { text: '👤 Thông tin tài khoản', action: 'navigate', path: '/profile' }
      ] : [
        { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
        { text: '👤 Đăng nhập/Đăng ký', action: 'navigate', path: '/login' },
        { text: '📞 Liên hệ hỗ trợ', action: 'navigate', path: '/contact' }
      ]
    };
  };

  const handleOptionClick = (option) => {
    if (option.action === 'navigate') {
      // Điều hướng đến trang cụ thể
      navigate(option.path);
      // Đóng chatbot sau khi điều hướng
      setIsOpen(false);
      // Thêm tin nhắn thông báo
      const notificationMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Đang chuyển hướng đến ${option.text}...`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, notificationMessage]);
    } else if (option.action === 'message') {
      // Gửi tin nhắn như cũ
      handleSendMessage(option.value);
    } else {
      // Fallback: gửi tin nhắn như cũ (để tương thích ngược)
      handleSendMessage(option.text || option);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Clear error when opening chat
  const handleToggleChat = () => {
    if (!isOpen) {
      setError(null);
    }
    setIsOpen(!isOpen);
  };

  // Clear chat history (for testing)
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: isAuthenticated 
          ? `Xin chào ${user.username}! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:`
          : 'Xin chào! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:',
        options: isAuthenticated ? [
          { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
          { text: '🛒 Đặt hàng ngay', action: 'navigate', path: '/cart' },
          { text: '👤 Thông tin tài khoản', action: 'navigate', path: '/profile' }
        ] : [
          { text: '🔍 Tìm kiếm sản phẩm', action: 'navigate', path: '/product' },
          { text: '👤 Đăng nhập/Đăng ký', action: 'navigate', path: '/login' },
          { text: '📞 Liên hệ hỗ trợ', action: 'navigate', path: '/contact' }
        ]
      }
    ]);
    setChatId(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Chat với trợ lý ảo"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Tạp Hóa Số Bot</h3>
                  <p className="text-sm opacity-90">
                    {isAuthenticated ? 'Đã kết nối API' : 'Chế độ demo'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Xóa lịch sử chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Error message */}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-100 text-red-800 rounded-2xl px-4 py-2 max-w-[80%]">
                  <p className="text-sm">⚠️ {error}</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{message.content}</p>
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors"
                        >
                          {option.text || option}
                        </button>
                      ))}
                    </div>
                  )}
                  {message.timestamp && (
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-full p-2 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
