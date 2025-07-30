import mongoose from 'mongoose';
import Order from './src/models/order.model.js';
import OrderDetail from './src/models/orderDetail.model.js';
import Product from './src/models/product.model.js';

// Connect to database
await mongoose.connect('mongodb://localhost:27017/taphoaso');

console.log('🔍 Fixing order data...');

// Get the specific order
const orderId = '688506daac2073b86b4595d9';
const order = await Order.findById(orderId);
console.log('🔍 Found order:', order);

if (!order) {
  console.log('❌ Order not found');
  process.exit(1);
}

// Check if there are any OrderDetails for this order
const existingOrderDetails = await OrderDetail.find({ order_id: orderId });
console.log('🔍 Existing OrderDetails count:', existingOrderDetails.length);

if (existingOrderDetails.length === 0) {
  console.log('🔍 No OrderDetails found, creating test data...');
  
  // Get a product to use
  const product = await Product.findOne();
  if (!product) {
    console.log('❌ No products found in database');
    process.exit(1);
  }
  
  console.log('🔍 Using product:', product.name);
  
  // Create OrderDetail
  const orderDetail = await OrderDetail.create({
    order_id: orderId,
    product_id: product._id,
    qty: 2,
    cur_price: product.price
  });
  
  console.log('✅ Created OrderDetail:', orderDetail);
} else {
  console.log('✅ OrderDetails already exist');
}

// Verify the fix
const updatedOrderDetails = await OrderDetail.find({ order_id: orderId }).populate('product_id');
console.log('🔍 Updated OrderDetails:', updatedOrderDetails);

await mongoose.disconnect();
console.log('✅ Done fixing data'); 