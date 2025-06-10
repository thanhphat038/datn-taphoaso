import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  full_name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
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
  is_default: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

const Address = mongoose.model('Address', addressSchema);
export default Address; 