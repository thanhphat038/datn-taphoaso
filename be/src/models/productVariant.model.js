import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    enum: ['thùng', 'lốc', 'gói', 'chai', 'lon', 'túi', 'hộp', 'kg', 'gram'],
    required: true
  },
  quantity_per_unit: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  original_price: {
    type: Number,
    required: true,
    min: 0
  },
  in_stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  is_default: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  images: [{
    type: String
  }],
}, {
  timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }
});

// Index để tối ưu truy vấn
productVariantSchema.index({ product_id: 1, status: 1 });
productVariantSchema.index({ unit: 1 });
productVariantSchema.index({ is_default: 1 });

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant; 