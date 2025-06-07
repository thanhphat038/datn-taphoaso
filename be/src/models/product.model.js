import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
  rating: {
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: {
    createdAt: 'create_at'
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
