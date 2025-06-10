import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  full_name: {
    type: String
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

const User = mongoose.model('User', userSchema);
export default User;
