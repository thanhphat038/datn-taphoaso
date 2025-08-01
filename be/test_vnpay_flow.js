const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWE5ZWE3Njg3NWZjZjhmNDk5ZmE5YSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzUzNjIwNTY0LCJleHAiOjE3NTQyMjUzNjR9.EUGuqw1sc4PnDvNIy1OCjwBZggKVDVWoGISIKRv4DDM';

/*
HƯỚNG DẪN SỬ DỤNG:
1. Token đã được cập nhật từ api.http
2. Chạy: node test_vnpay_flow.js
3. Xem kết quả để debug flow VNPAY
*/

async function testVNPayFlow() {
  try {
    console.log('=== Testing VNPAY Flow ===\n');

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

    const orderId = orderResponse.data.data._id; // Lấy từ data.data._id
    console.log('✅ Order created successfully');
    console.log('Order ID:', orderId);
    console.log('Order Response:', JSON.stringify(orderResponse.data, null, 2));

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

    console.log('✅ VNPAY payment created successfully');
    console.log('Payment Response:', JSON.stringify(paymentResponse.data, null, 2));

    // 3. Kiểm tra order có vnpay_txn_ref chưa
    console.log('\n3. Checking order vnpay_txn_ref...');
    const orderCheckResponse = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    console.log('✅ Order details retrieved');
    console.log('Order vnpay_txn_ref:', orderCheckResponse.data.data.vnpay_txn_ref);
    console.log('Order status:', orderCheckResponse.data.data.order_status);

    // 4. Lấy tất cả orders có vnpay_txn_ref
    console.log('\n4. Getting all orders with vnpay_txn_ref...');
    const allOrdersResponse = await axios.get(`${API_BASE_URL}/payment/all-orders-with-vnpay-ref`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    console.log('✅ All orders with vnpay_txn_ref retrieved');
    console.log('Orders:', JSON.stringify(allOrdersResponse.data, null, 2));

    // 5. Test tìm order theo vnpay_txn_ref
    if (orderCheckResponse.data.data.vnpay_txn_ref) {
      console.log('\n5. Testing find order by vnpay_txn_ref...');
      const findOrderResponse = await axios.get(`${API_BASE_URL}/payment/find-order/${orderCheckResponse.data.data.vnpay_txn_ref}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      console.log('✅ Order found by vnpay_txn_ref');
      console.log('Found Order:', JSON.stringify(findOrderResponse.data, null, 2));
    }

    // 6. Test callback VNPAY
    if (orderCheckResponse.data.data.vnpay_txn_ref) {
      console.log('\n6. Testing VNPAY callback...');
      const callbackResponse = await axios.get(`${API_BASE_URL}/payment/return`, {
        params: {
          vnp_ResponseCode: '00',
          vnp_TxnRef: orderCheckResponse.data.data.vnpay_txn_ref,
          vnp_Amount: '1100000',
          vnp_BankCode: 'VNPAY',
          vnp_CardType: 'QRCODE',
          vnp_PayDate: '20250727175916',
          vnp_TransactionStatus: '00',
          vnp_TransactionNo: '123456',
          vnp_SecureHash: 'test_hash'
        },
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });

      console.log('✅ VNPAY callback test completed');
      console.log('Callback Response:', JSON.stringify(callbackResponse.data, null, 2));
    }

    console.log('\n=== Test completed successfully ===');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Chạy test
testVNPayFlow(); 