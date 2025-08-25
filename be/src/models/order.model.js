import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voucher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  total_amount: {
    type: Number,
    required: true
  },
  payment_method: {
    type: String,
    required: true
  },
  address: { type: String, required: true },
  receiver: { type: String, required: true },
  sdt: { type: String, required: true },
  note: { type: String },
  order_status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'delivering', 'delivered', 'cancelled', 'failed'],
    default: 'pending'
  },
  vnpay_txn_ref: { type: String }, // Lưu mã giao dịch VNPAY
  vnpay_response_code: { type: String }, // Mã lỗi/phản hồi từ VNPAY
  vnpay_transaction_status: { type: String }, // Trạng thái giao dịch VNPAY
  vnpay_error_message: { type: String }, // Mô tả lỗi chi tiết từ VNPAY
  payment_deadline: { 
    type: Date,
    default: function() {
      // Mặc định 10 phút sau khi tạo đơn hàng
      return new Date(Date.now() + 10 * 60 * 1000);
    }
  }
}, {
  timestamps: { createdAt: 'create_at' }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
