import React, { useState } from 'react';
import ChatBot from './ChatBot';

const ChatBotDemo = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 ChatBot UI Mới
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            ChatBot component mới với Lucide icons và UI đẹp hơn
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {showDemo ? 'Ẩn Demo' : 'Hiện Demo'}
            </button>
          </div>
        </div>

        {showDemo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ✨ UI Improvements
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  🎨 Visual Enhancements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Lucide React icons thay vì SVG inline</li>
                  <li>• Clean và consistent icon design</li>
                  <li>• Better hover effects và transitions</li>
                  <li>• Improved color scheme</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  🔧 Technical Improvements
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cleaner code structure</li>
                  <li>• Better error handling</li>
                  <li>• Improved state management</li>
                  <li>• API integration ready</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Test ChatBot:</h4>
              <div className="text-sm text-blue-700">
                <p>• Click vào chat button (góc phải dưới) để mở ChatBot</p>
                <p>• Test các tính năng: gửi tin nhắn, quick actions, error handling</p>
                <p>• UI sẽ responsive và smooth hơn với Lucide icons</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🚀 ChatBot Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                ✨ UI Components
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Lucide React icons</li>
                <li>✅ Smooth animations</li>
                <li>✅ Responsive design</li>
                <li>✅ Modern color scheme</li>
                <li>✅ Hover effects</li>
                <li>✅ Clean typography</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                🔧 Functionality
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time chat với AI</li>
                <li>• API Backend integration</li>
                <li>• Fallback responses</li>
                <li>• Chat history management</li>
                <li>• Quick action buttons</li>
                <li>• Error handling</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🎯 Status:</h4>
            <p className="text-green-700">
              ChatBot UI mới đã được áp dụng thành công! 
              Sử dụng Lucide React icons cho giao diện đẹp và nhất quán hơn.
              Tất cả tính năng API integration vẫn hoạt động bình thường.
            </p>
          </div>
        </div>
      </div>

      {/* ChatBot component mới */}
      <ChatBot />
    </div>
  );
};

export default ChatBotDemo;
