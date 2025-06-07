import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'create_at'
  }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment; 