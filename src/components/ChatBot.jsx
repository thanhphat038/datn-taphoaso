import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ChatBot = () => {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Khởi tạo tin nhắn đầu tiên dựa trên trạng thái đăng nhập
  useEffect(() => {
    if (isAuthenticated && user) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Xin chào ${user.username}! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:`,
          options: [
            '🔍 Tìm kiếm sản phẩm',
            '🛒 Đặt hàng ngay',
            '📦 Theo dõi đơn hàng',
            '💰 Xem khuyến mãi',
            '👤 Thông tin tài khoản',
            '📞 Liên hệ hỗ trợ'
          ]
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: 'Xin chào! Tôi là trợ lý ảo của Tạp Hóa Số. Tôi có thể giúp bạn:',
          options: [
            '🔍 Tìm kiếm sản phẩm',
            '🛒 Hướng dẫn đặt hàng',
            '👤 Đăng nhập/Đăng ký',
            '📞 Liên hệ hỗ trợ',
            '❓ Câu hỏi thường gặp'
          ]
        }
      ]);
    }
  }, [isAuthenticated, user]);

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

    // Giả lập bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
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
          '🥛 Sữa và đồ uống',
          '🍪 Bánh kẹo',
          '🧴 Mỹ phẩm',
          '🧻 Vệ sinh cá nhân',
          '🍜 Mì gói và đồ ăn nhanh'
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
            '🛒 Thêm vào giỏ hàng',
            '📦 Xem giỏ hàng hiện tại',
            '💳 Thanh toán ngay',
            '📱 Gọi hotline: 1900-xxxx'
          ]
        };
      } else {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Để đặt hàng, bạn cần:',
          options: [
            '👤 Đăng nhập trước',
            '📝 Đăng ký tài khoản',
            '📱 Gọi hotline: 1900-xxxx',
            '💬 Chat với nhân viên'
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
          '📧 Email',
          '📱 Số điện thoại',
          '👤 Tên đăng nhập',
          '📝 Tạo tài khoản mới'
        ]
      };
    }
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Giá sản phẩm được hiển thị trên từng sản phẩm. Bạn có thể xem chi tiết bằng cách click vào sản phẩm.',
        options: [
          '🔍 Tìm sản phẩm theo giá',
          '💰 Khuyến mãi hiện tại',
          '💳 Phương thức thanh toán'
        ]
      };
    }
    
    if (lowerMessage.includes('ship') || lowerMessage.includes('giao hàng') || lowerMessage.includes('delivery')) {
      return {
        id: Date.now(),
        type: 'bot',
        content: 'Thông tin giao hàng:',
        options: [
          '🚚 Phí ship: 15k-55k tùy khoảng cách',
          '⏰ Thời gian: 2-4 giờ trong nội thành',
          '📍 Khu vực giao hàng',
          '📞 Liên hệ shipper'
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
            '📦 Đơn hàng gần đây',
            '🚚 Đang giao hàng',
            '✅ Đã hoàn thành',
            '👤 Vào trang cá nhân'
          ]
        };
      } else {
        return {
          id: Date.now(),
          type: 'bot',
          content: 'Để xem đơn hàng, bạn cần đăng nhập trước.',
          options: [
            '👤 Đăng nhập ngay',
            '📝 Đăng ký tài khoản',
            '📞 Liên hệ hỗ trợ'
          ]
        };
      }
    }

    return {
      id: Date.now(),
      type: 'bot',
      content: 'Tôi không hiểu rõ yêu cầu của bạn. Bạn có thể thử:',
      options: isAuthenticated ? [
        '🔍 Tìm kiếm sản phẩm',
        '🛒 Đặt hàng ngay',
        '📦 Theo dõi đơn hàng',
        '👤 Thông tin tài khoản'
      ] : [
        '🔍 Tìm kiếm sản phẩm',
        '👤 Đăng nhập/Đăng ký',
        '📞 Liên hệ hỗ trợ',
        '❓ Câu hỏi thường gặp'
      ]
    };
  };

  const handleOptionClick = (option) => {
    handleSendMessage(option);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Chat với trợ lý ảo"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Tạp Hóa Số Bot</h3>
                  <p className="text-sm opacity-90">Trực tuyến</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                          {option}
                        </button>
                      ))}
                    </div>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 