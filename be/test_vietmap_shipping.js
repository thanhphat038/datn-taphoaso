import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/vietmap-shipping';

// Test functions
async function testApiStatus() {
  try {
    console.log('🔍 Testing API Status...');
    const response = await axios.get(`${BASE_URL}/api-status`);
    console.log('✅ API Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Status Error:', error.response?.data || error.message);
    return null;
  }
}

async function testSearchAddresses() {
  try {
    console.log('🔍 Testing Address Search...');
    const response = await axios.get(`${BASE_URL}/search-addresses?query=nguyen hue`);
    console.log('✅ Address Search:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Address Search Error:', error.response?.data || error.message);
    return null;
  }
}

async function testCalculateShippingFromAddress() {
  try {
    console.log('🔍 Testing Shipping Calculation from Address...');
    const response = await axios.post(`${BASE_URL}/calculate-from-address`, {
      deliveryAddress: '123 Nguyễn Huệ, Quận 1, Hồ Chí Minh'
    });
    console.log('✅ Shipping Calculation:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Shipping Calculation Error:', error.response?.data || error.message);
    return null;
  }
}

async function testCalculateShippingFromCoordinates() {
  try {
    console.log('🔍 Testing Shipping Calculation from Coordinates...');
    const response = await axios.post(`${BASE_URL}/calculate-from-coordinates`, {
      lat: 10.7769,
      lon: 106.7009
    });
    console.log('✅ Shipping Calculation from Coordinates:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Shipping Calculation from Coordinates Error:', error.response?.data || error.message);
    return null;
  }
}

async function testGetAddressFromCoordinates() {
  try {
    console.log('🔍 Testing Get Address from Coordinates...');
    const response = await axios.get(`${BASE_URL}/get-address-from-coordinates?lat=10.7769&lon=106.7009`);
    console.log('✅ Get Address from Coordinates:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get Address from Coordinates Error:', error.response?.data || error.message);
    return null;
  }
}

async function testCalculateShippingWithRouteDetails() {
  try {
    console.log('🔍 Testing Shipping Calculation with Route Details...');
    const response = await axios.post(`${BASE_URL}/calculate-with-route-details`, {
      deliveryAddress: '123 Nguyễn Huệ, Quận 1, Hồ Chí Minh'
    });
    console.log('✅ Shipping Calculation with Route Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Shipping Calculation with Route Details Error:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Vietmap Shipping API Tests...\n');
  
  // Test 1: API Status
  await testApiStatus();
  console.log('');
  
  // Test 2: Search Addresses
  await testSearchAddresses();
  console.log('');
  
  // Test 3: Calculate Shipping from Address
  await testCalculateShippingFromAddress();
  console.log('');
  
  // Test 4: Calculate Shipping from Coordinates
  await testCalculateShippingFromCoordinates();
  console.log('');
  
  // Test 5: Get Address from Coordinates
  await testGetAddressFromCoordinates();
  console.log('');
  
  // Test 6: Calculate Shipping with Route Details
  await testCalculateShippingWithRouteDetails();
  console.log('');
  
  console.log('✅ All tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export {
  testApiStatus,
  testSearchAddresses,
  testCalculateShippingFromAddress,
  testCalculateShippingFromCoordinates,
  testGetAddressFromCoordinates,
  testCalculateShippingWithRouteDetails,
  runAllTests
}; 