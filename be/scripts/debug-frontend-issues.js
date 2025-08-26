import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function debugFrontendIssues() {
  console.log('🐛 Debugging Frontend Issues...\n');
  console.log(`📍 Backend URL: ${API_BASE_URL}\n`);

  try {
    // Test 1: Check CORS headers
    console.log('1️⃣ Testing CORS Headers...');
    try {
      const response = await axios.options(`${API_BASE_URL}/api/shipping/calculate-from-address`);
      console.log('✅ CORS preflight response:', {
        status: response.status,
        headers: response.headers
      });
    } catch (error) {
      console.log('❌ CORS preflight failed:', error.message);
    }

    // Test 2: Check if endpoint exists
    console.log('\n2️⃣ Testing Endpoint Existence...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shipping/calculate-from-address`);
      console.log('⚠️  Endpoint exists but should not allow GET:', response.status);
    } catch (error) {
      if (error.response?.status === 405) {
        console.log('✅ Endpoint exists and correctly rejects GET method (405 Method Not Allowed)');
      } else {
        console.log('❌ Endpoint test failed:', error.response?.status, error.message);
      }
    }

    // Test 3: Check authentication middleware
    console.log('\n3️⃣ Testing Authentication Middleware...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shipping/calculate-from-address`, {
        deliveryAddress: "test address",
        service: "vietmap"
      });
      console.log('⚠️  Unexpected success without auth:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication middleware working (401 Unauthorized)');
        console.log('   Message:', error.response.data?.message);
      } else {
        console.log('❌ Authentication test failed:', error.response?.status, error.message);
      }
    }

    // Test 4: Check validation middleware
    console.log('\n4️⃣ Testing Validation Middleware...');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shipping/calculate-from-address`, {
        service: "vietmap"
        // Missing deliveryAddress
      });
      console.log('⚠️  Unexpected success without required fields:', response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Still requires auth first (401 Unauthorized)');
      } else if (error.response?.status === 400) {
        console.log('✅ Validation working (400 Bad Request)');
        console.log('   Message:', error.response.data?.message);
      } else {
        console.log('❌ Validation test failed:', error.response?.status, error.message);
      }
    }

    console.log('\n🎯 Common Frontend Issues to Check:');
    console.log('1. Browser Console Errors (F12 → Console)');
    console.log('2. Network Tab (F12 → Network)');
    console.log('3. CORS errors in console');
    console.log('4. Authentication token missing/expired');
    console.log('5. API endpoint mismatch');
    console.log('6. Request/Response format mismatch');
    
    console.log('\n🔧 Debugging Steps:');
    console.log('1. Open browser console (F12)');
    console.log('2. Go to checkout page');
    console.log('3. Try to calculate shipping');
    console.log('4. Check for red errors in console');
    console.log('5. Check Network tab for failed requests');
    
  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
  }
}

// Run the debug
debugFrontendIssues();
