import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import Cookies from 'js-cookie';

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

const Product = ({ data: product, isFavorited = false }) => {
  console.log('🔍 Debug - Product data:', product);
  console.log('🔍 Debug - Product name:', product?.name);
  console.log('🔍 Debug - Product price:', product?.price);
  console.log('🔍 Debug - Product images:', product?.images);
  console.log('🔍 Debug - Is favorited:', isFavorited);
  
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

  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

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

  // Kiểm tra trạng thái yêu thích khi component mount
  useEffect(() => {
    // Nếu đã được truyền prop isFavorited, không cần kiểm tra
    if (isFavorited) {
      setIsFavorite(true);
      return;
    }
    
    let isMounted = true;
    
    const checkFavoriteStatus = async () => {
      try {
        const response = await getFavorites();
        if (!isMounted) return;
        
        if (response.data?.data) {
          const isProductFavorite = response.data.data.some(
            (fav) => fav.product_id?._id === product._id
          );
          setIsFavorite(isProductFavorite);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error checking favorite status:', error);
        setIsFavorite(false);
      }
    };

    checkFavoriteStatus();
    
    return () => {
      isMounted = false;
    };
  }, [product._id, isFavorited]);

  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product: {
          id: product.product_id,
          name: productName,
          image: imageUrl,
          price: productPrice,
          quantity: 1,
        }
      }
    });
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (loadingFavorite) return;
    
    const userId = getUserId();
    if (!userId) {
      alert('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
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
      alert('Có lỗi xảy ra khi thao tác với mục yêu thích');
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
            onLoad={() => {
              console.log('✅ Debug - Image loaded successfully:', imageUrl);
            }}
          />
        </Link>
        
        {/* Favorite Button - Floating */}
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

        {/* Buy Now Button */}
        <button
          onClick={e => { e.stopPropagation(); handleBuyNow(); }}
          className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg'
        >
          Mua ngay
        </button>
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