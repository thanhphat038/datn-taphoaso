import mongoose from 'mongoose';
import Order from './src/models/order.model.js';
import OrderDetail from './src/models/orderDetail.model.js';

// Connect to database
await mongoose.connect('mongodb://localhost:27017/taphoaso');

console.log('🔍 Checking latest order data...');

// Get the latest order
const latestOrder = await Order.findOne().sort({ created_at: -1 });
console.log('🔍 Latest order:', latestOrder);

if (latestOrder) {
    // Check if there are any OrderDetails for this order
    const orderDetails = await OrderDetail.find({ order_id: latestOrder._id });
    console.log('🔍 OrderDetails count:', orderDetails.length);
    console.log('🔍 OrderDetails:', orderDetails);

    // Check all orders
    const allOrders = await Order.find().sort({ created_at: -1 }).limit(5);
    console.log('🔍 All orders count:', allOrders.length);
    console.log('🔍 All orders:', allOrders.map(o => ({ id: o._id, total: o.total_amount, created: o.created_at })));

    // Check all order details
    const allOrderDetails = await OrderDetail.find().limit(10);
    console.log('🔍 All order details count:', allOrderDetails.length);
    console.log('🔍 All order details:', allOrderDetails);
} else {
    console.log('❌ No orders found');
}

await mongoose.disconnect();
console.log('✅ Done checking data'); 