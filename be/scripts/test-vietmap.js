import dotenv from 'dotenv';
import VietmapShippingService from '../src/services/shipping/vietmapShipping.service.js';

// Load environment variables
dotenv.config();

async function testVietmapService() {
  console.log('🧪 Testing Vietmap Shipping Service...\n');

  try {
    const vietmapService = new VietmapShippingService();
    
    // Test 1: Kiểm tra API key
    console.log('1️⃣ Checking API Key...');
    if (!vietmapService.apiKey) {
      console.log('❌ VIETMAP_API_KEY not configured');
      console.log('💡 Please add VIETMAP_API_KEY to your .env file');
      return;
    }
    console.log('✅ VIETMAP_API_KEY configured');
    
    // Test 2: Test geocoding
    console.log('\n2️⃣ Testing Geocoding...');
    const testAddress = "159 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh";
    console.log(`📍 Testing address: ${testAddress}`);
    
    const coordinates = await vietmapService.getCoordinatesFromAddress(testAddress);
    console.log('✅ Geocoding successful:', coordinates);
    
    // Test 3: Test distance calculation
    console.log('\n3️⃣ Testing Distance Calculation...');
    const storeCoords = { lat: 10.782238, lon: 106.683384 };
    const distance = vietmapService.calculateDistance(storeCoords, coordinates);
    console.log('✅ Distance calculated:', distance.toFixed(2), 'km');
    
    // Test 4: Test route info
    console.log('\n4️⃣ Testing Route Info...');
    const routeInfo = await vietmapService.getRouteInfo(storeCoords, coordinates);
    console.log('✅ Route info retrieved:', {
      distance: routeInfo.distance.toFixed(2) + ' km',
      time: Math.round(routeInfo.time / 60) + ' minutes'
    });
    
    // Test 5: Test shipping fee calculation
    console.log('\n5️⃣ Testing Shipping Fee Calculation...');
    const shippingFee = vietmapService.calculateShippingFee(routeInfo.distance);
    console.log('✅ Shipping fee calculated:', shippingFee.toLocaleString(), 'VND');
    
    console.log('\n🎉 All tests passed! Vietmap service is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testVietmapService();
