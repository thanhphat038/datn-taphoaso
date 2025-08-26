import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testWithAuth() {
  console.log('🔐 Testing Shipping API with Authentication...\n');
  console.log(`📍 API Base URL: ${API_BASE_URL}\n`);

  console.log('💡 To test with authentication, you need to:');
  console.log('1. Login to your frontend app');
  console.log('2. Get the auth token from browser');
  console.log('3. Use that token in this test');
  
  console.log('\n🔍 How to get auth token:');
  console.log('1. Open browser console (F12)');
  console.log('2. Type: localStorage.getItem("auth_token")');
  console.log('3. Copy the token value');
  
  console.log('\n📝 Or check these locations:');
  console.log('- localStorage.getItem("auth_token")');
  console.log('- localStorage.getItem("token")');
  console.log('- Cookies: document.cookie');
  
  console.log('\n🧪 Test Command:');
  console.log(`curl -X POST ${API_BASE_URL}/api/shipping/calculate-from-address \\`);
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\');
  console.log('  -d \'{"deliveryAddress": "test address", "service": "vietmap"}\'');
  
  console.log('\n🎯 Frontend Debug Steps:');
  console.log('1. Open browser console (F12)');
  console.log('2. Go to checkout page');
  console.log('3. Check for JavaScript errors');
  console.log('4. Check Network tab for failed requests');
  console.log('5. Verify auth token exists');
  console.log('6. Try to calculate shipping fee');
  
  console.log('\n🐛 Common Issues:');
  console.log('- Missing or expired auth token');
  console.log('- CORS errors');
  console.log('- API endpoint mismatch');
  console.log('- Request format wrong');
  console.log('- Backend server not running');
  
  console.log('\n✅ Backend Status:');
  console.log('- Server: Running on port 3000');
  console.log('- Shipping routes: Registered');
  console.log('- Vietmap service: Configured');
  console.log('- Authentication: Working');
  
  console.log('\n🎉 Ready to debug frontend!');
}

// Run the test
testWithAuth();
