import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  original_price: {
    type: Number,
    required: true
  },
  in_stock: {
    type: Number,
    required: true,
    min: 0
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
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
