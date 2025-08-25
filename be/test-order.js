// Test file để kiểm tra order service
import mongoose from 'mongoose';
import OrderService from './src/services/order.service.js';
import OrderDetail from './src/models/orderDetail.model.js';
import Product from './src/models/product.model.js';

// Kết nối database
mongoose.connect('mongodb://localhost:27017/taphoaso', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const orderService = new OrderService();

async function testGetOrdersByUser() {
  try {
    console.log('🔍 Testing getOrdersByUser...');
    
    // Test với user ID thực tế từ database
    const userId = 'your_user_id_here'; // Thay bằng user ID thực tế
    
    const result = await orderService.getOrdersByUser(userId, { page: 1, limit: 5 });
    
    console.log('🔍 Result:', JSON.stringify(result, null, 2));
    
    if (result.data && result.data.length > 0) {
      const firstOrder = result.data[0];
      console.log('🔍 First order items:', firstOrder.items);
      
      if (firstOrder.items && firstOrder.items.length > 0) {
        const firstItem = firstOrder.items[0];
        console.log('🔍 First item:', firstItem);
        console.log('🔍 First item product_id:', firstItem.product_id);
        console.log('🔍 First item images:', firstItem.product_id?.images);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing getOrdersByUser:', error);
  }
}

async function testGetOrderById() {
  try {
    console.log('🔍 Testing getOrderById...');
    
    // Test với order ID thực tế từ database
    const orderId = 'your_order_id_here'; // Thay bằng order ID thực tế
    
    const result = await orderService.getOrderById(orderId);
    
    console.log('🔍 Result:', JSON.stringify(result, null, 2));
    
    if (result && result.items && result.items.length > 0) {
      const firstItem = result.items[0];
      console.log('🔍 First item:', firstItem);
      console.log('🔍 First item product_id:', firstItem.product_id);
      console.log('🔍 First item images:', firstItem.product_id?.images);
    }
    
  } catch (error) {
    console.error('❌ Error testing getOrderById:', error);
  }
}

async function testPopulate() {
  try {
    console.log('🔍 Testing populate...');
    
    // Test populate trực tiếp
    const orderDetails = await OrderDetail.find().populate({
      path: 'product_id',
      select: 'name price images description category_id'
    }).limit(5);
    
    console.log('🔍 OrderDetails with populate:', JSON.stringify(orderDetails, null, 2));
    
    if (orderDetails.length > 0) {
      const firstDetail = orderDetails[0];
      console.log('🔍 First detail:', firstDetail);
      console.log('🔍 First detail product_id:', firstDetail.product_id);
      console.log('🔍 First detail images:', firstDetail.product_id?.images);
    }
    
  } catch (error) {
    console.error('❌ Error testing populate:', error);
  }
}

// Chạy tests
async function runTests() {
  console.log('🚀 Starting tests...');
  
  await testPopulate();
  await testGetOrderById();
  await testGetOrdersByUser();
  
  console.log('✅ Tests completed');
  process.exit(0);
}

runTests().catch(console.error);
