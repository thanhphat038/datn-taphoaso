import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToFavorite, removeFromFavorite, getFavorites, clearFavoritesCache, forceClearFavoritesCache } from '../service/Favorite.service';
import { addToCart } from '../service/Cart.service';
import Cookies from 'js-cookie';
import { useToast } from './ToastContainer';
import { useAlertContext } from './AlertProvider';

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const Product = ({ data: product, onAddToCartSuccess }) => {
  
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [userKey, setUserKey] = useState('');
  const { showSuccess, showError, showWarning } = useToast();
  const { showAlert, hideAlert } = useAlertContext();
  
  // Lấy user_id từ token
  const getUserId = () => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  // Kiểm tra trạng thái yêu thích khi component mount hoặc token thay đổi
  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const userId = getUserId();
    const currentToken = Cookies.get('auth_token');
    const newUserKey = userId ? `${userId}-${currentToken}` : 'guest';
    
    // Cập nhật userKey để force re-render
    setUserKey(newUserKey);
    
    if (!userId) {
      console.log('🔒 User not logged in, skipping favorite check');
      setIsFavorite(false);
      return;
    }
    
    let isMounted = true;
    
    const checkFavoriteStatus = async () => {
      try {
        console.log('🔍 Checking favorite status for product:', product._id, 'user:', userId);
        const response = await getFavorites();
        if (!isMounted) return;
        
        if (response.data?.data) {
          const isProductFavorite = response.data.data.some(
            (fav) => fav.product_id?._id === product._id
          );
          setIsFavorite(isProductFavorite);
          console.log('✅ Favorite status updated:', isProductFavorite, 'for user:', userId);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('❌ Error checking favorite status:', error);
        // Chỉ log lỗi nếu không phải lỗi 401 (unauthorized)
        if (error.response?.status !== 401) {
          console.error('❌ Unexpected error checking favorite status:', error);
        }
        setIsFavorite(false);
      }
    };

    checkFavoriteStatus();
    
    return () => {
      isMounted = false;
    };
  }, [product._id, userKey]); // Sử dụng userKey thay vì token trực tiếp

  // Lắng nghe sự kiện logout và login để reset trạng thái yêu thích
  useEffect(() => {
    const handleUserLogout = () => {
      console.log('🚪 User logout detected, resetting favorite status');
      setIsFavorite(false);
    };

    const handleUserLogin = () => {
      console.log('🚪 User login detected, force clearing favorites cache');
      forceClearFavoritesCache();
      setIsFavorite(false);
    };

    window.addEventListener('user-logout', handleUserLogout);
    window.addEventListener('user-login', handleUserLogin);
    
    return () => {
      window.removeEventListener('user-logout', handleUserLogout);
      window.removeEventListener('user-login', handleUserLogin);
    };
  }, []);

  // Kiểm tra dữ liệu sản phẩm
  if (!product || !product._id) {
    console.error('❌ Error - Invalid product data:', product);
    return (
      <div className='drop-shadow-lg bg-white p-4 rounded-[15px] flex flex-col justify-between gap-5 relative group min-w-[220px] max-w-[260px] w-full h-full'>
        <div className='text-center text-gray-500'>
          <p>Sản phẩm không hợp lệ</p>
        </div>
      </div>
    );
  }
  
  const ratingValue = Math.floor(product?.rating?.rate || 0);
  const maxStars = 5;
  const imageUrl = product?.images?.[0] || product?.image || product?.product_image || '/placeholder.png';
  
  // Fallback cho tên sản phẩm
  const productName = product?.name || product?.product_name || 'Tên sản phẩm';
  
  // Fallback cho giá
  const productPrice = product?.price || product?.cur_price || 0;
  const originalPrice = product?.original_price || product?.old_price || null;
  
  // Fallback cho rating
  const rating = product?.rating?.rate || 0;
  
  // Function để kiểm tra và sửa dữ liệu sản phẩm
  const validateProductData = () => {
    const issues = [];
    
    if (!product._id) issues.push('Missing product ID');
    if (!productName || productName === 'Tên sản phẩm') issues.push('Missing product name');
    if (!productPrice || productPrice === 0) issues.push('Missing product price');
    if (!product.images || product.images.length === 0) issues.push('Missing product images');
    
    if (issues.length > 0) {
      console.warn('⚠️ Warning - Product data issues:', issues);
      console.warn('⚠️ Warning - Product data:', product);
    }
    
    return issues.length === 0;
  };
  
  // Kiểm tra dữ liệu sản phẩm
  validateProductData();

  const handleBuyNow = async () => {
    const userId = getUserId();
    if (!userId) {
      console.log('🔒 User not logged in, showing login prompt for buy now');
      
      // Lưu thông tin sản phẩm để mua ngay sau khi đăng nhập
      const buyNowProduct = {
        productId: product._id,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: imageUrl,
        originalPrice: product.original_price || productPrice
      }
      localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
      
      // Hiện alert với các nút hành động
      showAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để mua sản phẩm',
        type: 'warning',
        actions: [
          {
            label: 'Đăng nhập ngay',
            onClick: () => {
              hideAlert(); // Tắt alert
              navigate('/login');
            }
          }
        ],
        autoClose: false
      });
      
      return;
    }

    try {
      // Thêm sản phẩm vào giỏ hàng trước
      await addToCart(product._id, 1);
      
      // Lưu thông tin sản phẩm để mua ngay vào localStorage
      const buyNowProduct = {
        productId: product._id,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: imageUrl,
        originalPrice: product.original_price || productPrice
      }

      localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
      
      // Dispatch event để cập nhật cart context
      window.dispatchEvent(new Event('cart-updated'));
      
      // Đợi một chút để cart context cập nhật
      setTimeout(() => {
        // Chuyển đến trang thanh toán
        navigate('/checkout');
      }, 500);
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      showError('Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.');
    }
  };

  const handleAddToCart = async () => {
    if (loadingAddToCart) return;
    
    const userId = getUserId();
    if (!userId) {
      console.log('🔒 User not logged in, showing login prompt for add to cart');
      
      // Hiện alert với các nút hành động
      showAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        type: 'warning',
        actions: [
          {
            label: 'Đăng nhập ngay',
            onClick: () => {
              hideAlert(); // Tắt alert
              navigate('/login');
            }
          }
        ],
        autoClose: false
      });
      return;
    }

    setLoadingAddToCart(true);
    try {
      await addToCart(product._id, 1);
      
      // Gọi callback nếu có
      if (onAddToCartSuccess) {
        onAddToCartSuccess('Đã thêm sản phẩm vào giỏ hàng!', 'success');
      } else {
        // Fallback cho showSuccess nếu không có callback
        showSuccess('Đã thêm sản phẩm vào giỏ hàng!');
      }
      
      // Dispatch event để cập nhật cart context
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Gọi callback nếu có
      if (onAddToCartSuccess) {
        onAddToCartSuccess('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!', 'error');
      } else {
        // Fallback cho showError nếu không có callback
        showError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
      }
    } finally {
      setLoadingAddToCart(false);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (loadingFavorite) return;
    
    const userId = getUserId();
    if (!userId) {
      console.log('🔒 User not logged in, showing login prompt for favorite');
      
      // Hiện alert với các nút hành động
      showAlert({
        title: 'Yêu cầu đăng nhập',
        message: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích',
        type: 'warning',
        actions: [
          {
            label: 'Đăng nhập ngay',
            onClick: () => {
              hideAlert(); // Tắt alert
              navigate('/login');
            }
          }
        ],
        autoClose: false
      });
      return;
    }
    
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        // Xóa khỏi favorite
        await removeFromFavorite(product._id);
        setIsFavorite(false);
        // Phát sự kiện thông báo xóa sản phẩm khỏi favorite
        window.dispatchEvent(new CustomEvent('favorite-removed', {
          detail: { productId: product._id, product: product }
        }));
      } else {
        // Thêm vào favorite
        await addToFavorite(product._id); // Không cần truyền userId nữa
        setIsFavorite(true);
        // Phát sự kiện thông báo thêm sản phẩm vào favorite
        window.dispatchEvent(new CustomEvent('favorite-added', {
          detail: { productId: product._id, product: product }
        }));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showError('Có lỗi xảy ra khi thao tác với mục yêu thích');
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group min-w-[220px] max-w-[280px] w-full h-full flex flex-col'>
      {/* Product Image Container */}
      <div className='relative overflow-hidden bg-white p-4'>
        <Link to={`/product/${product._id}`}>
          <img
            className='w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105'
            src={imageUrl}
            alt={productName}
            loading='lazy'
            onError={(e) => {
              console.error('❌ Error - Image failed to load:', imageUrl);
              e.target.src = '/placeholder.png';
            }}

          />
        </Link>
        
        {/* Favorite Button - Floating on top right */}
        <button 
          className='absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 z-20' 
          onClick={handleToggleFavorite} 
          disabled={loadingFavorite}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
        >
          {loadingFavorite ? (
            <svg className="animate-spin size-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-600 hover:text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          )}
        </button>

        {/* Discount Badge */}
        {originalPrice && productPrice < originalPrice && (
          <div className='absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
            -{Math.round(((originalPrice - productPrice) / originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className='p-4 flex-1 flex flex-col'>
        {/* Product Name */}
        <Link to={`/product/${product._id}`} className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2 leading-tight'>
            {productName}
          </h3>
        </Link>

        {/* Rating */}
        <div className='flex items-center mb-3'>
          <div className='flex items-center'>
            {[...Array(ratingValue)].map((_, i) => (
              <StarIcon key={`full-${i}`} filled />
            ))}
            {[...Array(maxStars - ratingValue)].map((_, i) => (
              <StarIcon key={`empty-${i}`} />
            ))}
          </div>
          <span className='text-sm text-gray-600 ml-2 font-medium'>{rating?.toFixed(1) || '0.0'}</span>
        </div>

        {/* Price */}
        <div className='mb-4'>
          <div className='flex items-center gap-2'>
            <span className='text-xl font-bold text-red-600'>
              {formatCurrency(productPrice)}
            </span>
            {originalPrice && productPrice < originalPrice && (
              <del className='text-sm text-gray-400'>
                {formatCurrency(originalPrice)}
              </del>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2'>
          {/* Buy Now Button */}
          <button
            onClick={e => { e.stopPropagation(); handleBuyNow(); }}
            className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg'
          >
            Mua ngay
          </button>

          {/* Add to Cart Button - Icon Only */}
          <button
            onClick={e => { e.stopPropagation(); handleAddToCart(); }}
            disabled={loadingAddToCart}
            className='w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
            title="Thêm vào giỏ hàng"
          >
            {loadingAddToCart ? (
              <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const StarIcon = ({ filled = false }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    fill='currentColor'
    viewBox='0 0 20 20'
  >
    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z' />
  </svg>
);

export default Product;