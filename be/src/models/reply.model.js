import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  reply: {
    type: String,
    required: true
  },
  is_hidden: {
    type: Boolean,
    default: false 
  }
}, {
  timestamps: {
    createdAt: 'create_at'
  }
});

const Reply = mongoose.model('Reply', replySchema);
export default Reply; 