import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/vietmap-shipping';

// Địa chỉ theo yêu cầu
const CUSTOMER_ADDRESS = "10 Ngô Gia Tự, Phường 13, Quận 10, Thành phố Hồ Chí Minh";

// Hàm calculateShippingFee theo yêu cầu
async function calculateShippingFee(customerAddress) {
  try {
    console.log('🔍 Calculating shipping fee for:', customerAddress);
    
    const response = await axios.post(`${BASE_URL}/calculate-shipping-fee`, {
      customerAddress: customerAddress
    });
    
    const result = response.data.data;
    
    // In kết quả theo format yêu cầu
    console.log('📊 Result:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Test với địa chỉ cụ thể
async function main() {
  try {
    console.log('🎯 Vietmap Shipping Fee Calculator Demo\n');
    console.log('📍 Customer Address:', CUSTOMER_ADDRESS);
    console.log('📍 Store Address: 200 Lý Chính Thắng, Phường 9, Quận 3, Thành phố Hồ Chí Minh\n');
    
    const result = await calculateShippingFee(CUSTOMER_ADDRESS);
    
    console.log('\n✅ Expected output format:');
    console.log(JSON.stringify({
      distanceInKm: result.distanceInKm,
      durationInMin: result.durationInMin,
      shippingFee: result.shippingFee
    }, null, 2));
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run demo
main(); 