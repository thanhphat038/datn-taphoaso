import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  district: {
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  chitlet: {
    type: String,
    required: true
  },
  sdt: {
    type: String,
    required: true
  },
  ten_nguoi_nhan: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

const Address = mongoose.model('Address', addressSchema);
export default Address; 