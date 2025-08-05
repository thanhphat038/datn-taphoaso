import mongoose from 'mongoose';

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: {
    createdAt: 'create_at'
  }
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);
export default BlogCategory; 