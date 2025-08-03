import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Sản phẩm là bắt buộc']
  },
  name: {
    type: String,
    required: [true, 'Tên biến thể là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên biến thể không được vượt quá 100 ký tự']
  },
  sku: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values
  },
  unit: {
    type: String,
    enum: ['thùng', 'lốc', 'gói', 'chai', 'lon', 'túi', 'hộp', 'kg', 'gram'],
    required: [true, 'Đơn vị là bắt buộc']
  },
  quantity_per_unit: {
    type: Number,
    required: [true, 'Số lượng mỗi đơn vị là bắt buộc'],
    min: [1, 'Số lượng mỗi đơn vị phải lớn hơn 0'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Giá là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  original_price: {
    type: Number,
    required: [true, 'Giá gốc là bắt buộc'],
    min: [0, 'Giá gốc không được âm']
  },
  in_stock: {
    type: Number,
    required: [true, 'Số lượng tồn kho là bắt buộc'],
    min: [0, 'Số lượng tồn kho không được âm'],
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
    type: String,
    trim: true,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for better query performance
variantSchema.index({ product_id: 1, status: 1 });
variantSchema.index({ is_default: 1 });

// Virtual for discount percentage
variantSchema.virtual('discount_percent').get(function() {
  if (this.original_price && this.original_price > this.price) {
    return Math.round(((this.original_price - this.price) / this.original_price) * 100);
  }
  return 0;
});

// Ensure virtual fields are serialized
variantSchema.set('toJSON', { virtuals: true });
variantSchema.set('toObject', { virtuals: true });

const Variant = mongoose.model('Variant', variantSchema);

export default Variant; 