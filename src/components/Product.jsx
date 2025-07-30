import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import { formatCurrency } from '../utils/formatCurrency';
import { ShoppingCart, Heart, Check, X } from 'lucide-react';
import { addToCart } from '../service/Cart.service';
import './Product.css';

const Product = ({ data: product }) => {
  // console.log(product);
  const ratingValue = Math.floor(product?.rating?.rate || 0);
  const maxStars = 5;
  const { cartItems, setInitialCartItems } = useContext(CartContext);
  const { isFavorite: isFavoriteContext, addFavorite, removeFavorite } = useFavorite();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  // Get image URL
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  useEffect(() => {
    // Kiểm tra trạng thái yêu thích khi mount
    const fetchFavorite = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_token='))
          ?.split('=')[1];

        if (token) {
          const response = await fetch(`http://localhost:3000/api/favorites/check/${product._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setIsFavorite(data.isFavorite);
          }
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    fetchFavorite();
  }, [product._id]);

  const handleBuyNow = async () => {
    try {
      setIsAddingToCart(true);
      // Thêm sản phẩm vào giỏ hàng qua API
      await addToCart(product._id, 1);
      
      // Dispatch event để cập nhật cart count trong header
      window.dispatchEvent(new Event('cart-updated'));
      
      // Chuyển đến trang checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi khi thêm vào giỏ hàng!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      console.log('Adding to cart via API:', product._id);
      
      // Thêm sản phẩm vào giỏ hàng qua API
      await addToCart(product._id, 1);
      
      // Dispatch event để cập nhật cart count trong header
      window.dispatchEvent(new Event('cart-updated'));
      
      // Hiển thị toast notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi khi thêm vào giỏ hàng!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    console.log('Toggle favorite:', product._id, isFavoriteContext(product._id));
    if (isFavoriteContext(product._id)) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up">
          <Check className="w-5 h-5" />
          <div>
            <div className="font-semibold">Thành công!</div>
            <div className="text-sm opacity-90">Đã thêm "{product.name}" vào giỏ hàng</div>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-2 p-1 hover:bg-green-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:scale-105 relative h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Link to={`/product/${product._id}`}>
            <img
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              src={imageUrl}
              alt={product.name}
              loading="lazy"
            />
          </Link>
          
          {/* Discount Badge */}
          {product.original_price && product.original_price > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
            </div>
          )}
          
          {/* Favorite Button */}
          <button 
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110"
            onClick={handleToggleFavorite}
            title={isFavoriteContext(product._id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart 
              className={`w-5 h-5 ${isFavoriteContext(product._id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors text-sm lg:text-base min-h-[2.5rem] leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(ratingValue)].map((_, i) => (
                <StarIcon key={`full-${i}`} filled />
              ))}
              {[...Array(maxStars - ratingValue)].map((_, i) => (
                <StarIcon key={`empty-${i}`} />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {product.rating?.rate?.toFixed(1) || '0.0'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-4 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.original_price)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleBuyNow}
              disabled={isAddingToCart}
              className="flex-1 product-btn-order disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? 'Đang xử lý...' : 'Mua ngay'}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const StarIcon = ({ filled = false }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

export default Product;
