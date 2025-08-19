import mongoose from 'mongoose';

const recentViewsSchema = new mongoose.Schema({
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
  viewed_at: {
    type: Date,
    default: Date.now
  },
  view_count: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index để tối ưu truy vấn
recentViewsSchema.index({ user_id: 1, viewed_at: -1 });
recentViewsSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

// Middleware để tự động cập nhật thời gian xem
recentViewsSchema.pre('save', function(next) {
  this.viewed_at = new Date();
  next();
});

const RecentViews = mongoose.model('RecentViews', recentViewsSchema);
export default RecentViews; 