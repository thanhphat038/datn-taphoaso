import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'create_at'
  }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite; 