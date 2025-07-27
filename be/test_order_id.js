const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWE5ZWE3Njg3NWZjZjhmNDk5ZmE5YSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUzNjIwNTY0LCJleHAiOjE3NTQyMjUzNjR9.EUGuqw1sc4PnDvNIy1OCjwBZggKVDVWoGISIKRv4DDM';

async function testOrderId() {
  try {
    console.log('=== Testing Order ID ===\n');

    // 1. Tạo order
    console.log('1. Creating order...');
    const orderData = {
      address: "Số 123, Quận ABC, TP XYZ",
      receiver: "Nguyễn Văn AAAAAA",
      sdt: "0123456789",
      items: [
        {
          product_id: "6862d1c32df5d5159cc51ef2",
          qty: 1
        }
      ],
      payment_method: "vnpay",
      note: "Vui lòng giao buổi sáng",
      total_amount: 11000
    };

    const orderResponse = await axios.post(`${API_BASE_URL}/orders`, orderData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Order Response Structure:');
    console.log('orderResponse.data:', typeof orderResponse.data);
    console.log('orderResponse.data.success:', orderResponse.data.success);
    console.log('orderResponse.data.data:', typeof orderResponse.data.data);
    console.log('orderResponse.data.data._id:', orderResponse.data.data._id);

    const orderId = orderResponse.data.data._id;
    console.log('\n✅ Order ID extracted:', orderId);

    // 2. Tạo VNPAY payment
    console.log('\n2. Creating VNPAY payment...');
    const paymentData = {
      method: "vnpay",
      amount: 11000,
      bankCode: "",
      language: "vn",
      orderId: orderId
    };

    const paymentResponse = await axios.post(`${API_BASE_URL}/payment/create`, paymentData, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ VNPAY Payment Response:');
    console.log('paymentResponse.data:', JSON.stringify(paymentResponse.data, null, 2));

    // 3. Kiểm tra order có vnpay_txn_ref chưa
    console.log('\n3. Checking order vnpay_txn_ref...');
    const orderCheckResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    console.log('✅ Order Check Response:');
    console.log('orderCheckResponse.data.data.vnpay_txn_ref:', orderCheckResponse.data.data.vnpay_txn_ref);
    console.log('orderCheckResponse.data.data.order_status:', orderCheckResponse.data.data.order_status);

    console.log('\n=== Test completed successfully ===');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Chạy test
testOrderId(); 