import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true
  },
  max_discount: {
    type: Number
  },
  min_order_value: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  qty: { // Số lượng voucher còn lại
    type: Number,
    default: 0,
    min: 0
  },
  max_uses_per_user: { // Số lần tối đa một user được dùng
    type: Number,
    default: 1,
    min: 1
  },
  usage_history: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    order_amount: { type: Number },
    discount_amount: { type: Number },
    used_at: { type: Date, default: Date.now }
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Voucher = mongoose.model('Voucher', voucherSchema);
export default Voucher; 