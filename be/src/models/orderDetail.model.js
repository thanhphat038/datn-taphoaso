import mongoose from 'mongoose';

const orderDetailSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qty: {
    type: Number,
    required: true,
    min: 1
  },
  cur_price: {
    type: Number,
    required: true
  }
});

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
export default OrderDetail;