import mongoose from 'mongoose';
import Order from './src/models/order.model.js';
import OrderDetail from './src/models/orderDetail.model.js';

// Connect to database
await mongoose.connect('mongodb://localhost:27017/taphoaso');

console.log('🔍 Checking order data...');

// Get the specific order
const orderId = '688506daac2073b86b4595d9';
const order = await Order.findById(orderId);
console.log('🔍 Order:', order);

// Check if there are any OrderDetails for this order
const orderDetails = await OrderDetail.find({ order_id: orderId });
console.log('🔍 OrderDetails count:', orderDetails.length);
console.log('🔍 OrderDetails:', orderDetails);

// Check all orders
const allOrders = await Order.find().limit(5);
console.log('🔍 All orders count:', allOrders.length);

// Check all order details
const allOrderDetails = await OrderDetail.find().limit(10);
console.log('🔍 All order details count:', allOrderDetails.length);

await mongoose.disconnect();
console.log('✅ Done checking data'); 