import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {    // Chuẩn tên field: người nhận
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address_detail: {   // Chi tiết địa chỉ (số nhà, tên đường)
    type: String,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  is_default: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
