import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/vietmap-shipping';

// Địa chỉ cửa hàng và khách hàng theo yêu cầu
const STORE_ADDRESS = "200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh";
const CUSTOMER_ADDRESS = "10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh";

// Hàm tính phí ship chính
async function calculateShippingFee(customerAddress) {
  try {
    console.log('🔍 Calculating shipping fee for:', customerAddress);
    
    const response = await axios.post(`${BASE_URL}/calculate-shipping-fee`, {
      customerAddress: customerAddress
    });
    
    const result = response.data.data;
    
    console.log('✅ Shipping calculation result:', JSON.stringify(result, null, 2));
    return result;
    
  } catch (error) {
    console.error('❌ Error calculating shipping fee:', error.response?.data || error.message);
    throw error;
  }
}

// Test với địa chỉ cụ thể
async function testShippingCalculation() {
  try {
    console.log('🚀 Testing Shipping Calculation...\n');
    console.log('📍 Store Address:', STORE_ADDRESS);
    console.log('📍 Customer Address:', CUSTOMER_ADDRESS);
    console.log('');
    
    const result = await calculateShippingFee(CUSTOMER_ADDRESS);
    
    console.log('\n📊 Final Result:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  }
}

// Test với các địa chỉ khác nhau để kiểm tra công thức tính phí
async function testMultipleAddresses() {
  const testAddresses = [
    {
      name: "Near Store (within 3km)",
      address: "123 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh"
    },
    {
      name: "Medium Distance (3-7km)",
      address: "10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh"
    },
    {
      name: "Far Distance (>7km)",
      address: "123 Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh"
    }
  ];
  
  console.log('🧪 Testing Multiple Addresses...\n');
  
  for (const testCase of testAddresses) {
    try {
      console.log(`📍 Testing: ${testCase.name}`);
      console.log(`   Address: ${testCase.address}`);
      
      const result = await calculateShippingFee(testCase.address);
      
      console.log(`   Result: ${JSON.stringify(result, null, 2)}\n`);
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`);
    }
  }
}

// Main function
async function main() {
  console.log('🎯 Vietmap Shipping Fee Calculator\n');
  
  // Test 1: Địa chỉ cụ thể theo yêu cầu
  await testShippingCalculation();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Nhiều địa chỉ khác nhau
  await testMultipleAddresses();
  
  console.log('✅ All tests completed!');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  calculateShippingFee,
  testShippingCalculation,
  testMultipleAddresses
}; 