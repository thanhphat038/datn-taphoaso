// Test script cho Chat API
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWE5ZWE3Njg3NWZjZjhmNDk5ZmE5YSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU0MTI3NDQ0LCJleHAiOjE3NTQ3MzIyNDR9.ITuKGr1FNmggjG6xi523DK7L8GqngWrvYQQymRy9L0U';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testChatAPI() {
  console.log('🧪 Testing Chat API...\n');

  try {
    // Test 1: Khởi tạo chat
    console.log('1️⃣ Testing: GET /chat/init');
    const initResponse = await api.get('/chat/init');
    console.log('✅ Init chat success:', initResponse.data);
    
    const chatId = initResponse.data.data.chatId;
    console.log('📝 Chat ID:', chatId);
    console.log('');

    // Test 2: Gửi tin nhắn
    console.log('2️⃣ Testing: POST /chat/send');
    const sendResponse = await api.post('/chat/send', {
      message: 'Xin chào, tôi muốn hỏi về sản phẩm'
    });
    console.log('✅ Send message success:', sendResponse.data);
    console.log('🤖 AI Response:', sendResponse.data.data.aiResponse);
    console.log('');

    // Test 3: Lấy thống kê
    console.log('3️⃣ Testing: GET /chat/stats');
    const statsResponse = await api.get('/chat/stats');
    console.log('✅ Get stats success:', statsResponse.data);
    console.log('');

    // Test 4: Lấy lịch sử chat
    console.log('4️⃣ Testing: GET /chat/history');
    const historyResponse = await api.get('/chat/history?page=1&limit=5');
    console.log('✅ Get history success:', historyResponse.data);
    console.log('');

    // Test 5: Lấy chat cụ thể
    console.log('5️⃣ Testing: GET /chat/:chatId');
    const chatResponse = await api.get(`/chat/${chatId}`);
    console.log('✅ Get chat success:', chatResponse.data);
    console.log('');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('💡 Tip: Token có thể đã hết hạn. Hãy cập nhật TEST_TOKEN với token mới.');
    }
  }
}

// Chạy test
testChatAPI();
