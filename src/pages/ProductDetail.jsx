import React, { useState, useEffect, useRef } from 'react';
import { useProductDetailData, useRelatedProducts } from '../controller/Product.controller';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { addToCart } from '../service/Cart.service';
import Product from '../components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  Package, 
  Truck, 
  Shield, 
  ArrowLeft,
  MessageCircle,
  Send
} from 'lucide-react';

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pendingAddQty, setPendingAddQty] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { id } = useParams();
  const pd = useProductDetailData(id) || [];
  const product = pd.data || {};

  // Ref để debounce khi thêm vào giỏ hàng
  const debounceAddToCart = useRef();
  const pendingAddQtyRef = useRef(0);

  const relatedProducts = useRelatedProducts(product._id, 20);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (product.stock && newQuantity > product.stock) return product.stock;
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    pendingAddQtyRef.current += quantity;
    setPendingAddQty(pendingAddQtyRef.current);

    if (debounceAddToCart.current) {
      clearTimeout(debounceAddToCart.current);
    }
    debounceAddToCart.current = setTimeout(async () => {
      if (pendingAddQtyRef.current > 0) {
        try {
          await addToCart(product._id, pendingAddQtyRef.current);
          window.dispatchEvent(new Event('cart-updated'));
        } catch (err) {
          alert('Thêm vào giỏ hàng thất bại!');
        }
        pendingAddQtyRef.current = 0;
        setPendingAddQty(0);
      }
      debounceAddToCart.current = null;
    }, 400);
  };

  const handleBuyNow = () => {
    // Logic mua ngay
    console.log('Buy now clicked');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

  if (product.images) return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Trang chủ
          </Link>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative">
              <img
                src={mainImage || (product.images?.[0] || '')}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              
              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart 
                  className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                />
              </button>

              {/* Discount Badge */}
              {product.original_price && product.original_price > product.price && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      (mainImage || product.images[0]) === img 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating?.rate)}
                </div>
                <span className="text-gray-600">
                  {product.rating?.rate?.toFixed(1) || '0.0'}/5
                </span>
                <span className="text-gray-500 text-sm">
                  ({product.rating?.count || 0} đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-red-600">
                  {formatCurrency(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
              </div>
              
              {/* Stock Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Còn hàng: {product.stock || 'N/A'}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-3 hover:bg-gray-100 transition-colors ${
                      quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 text-center border-x border-gray-300 py-3 outline-none bg-white"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>Giao hàng nhanh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Bảo hành chính hãng</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Package className="w-5 h-5 text-orange-500" />
                <span>Đổi trả dễ dàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h2>
            <div className="prose prose-gray max-w-none">
              {product.description ? (
                <div className="space-y-4">
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full max-h-80 object-cover rounded-xl mb-6"
                    />
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Chưa có mô tả cho sản phẩm này.</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Bình luận
            </h2>
            
            {/* Comment Input */}
            <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
              <input
                type="text"
                placeholder="Viết bình luận của bạn..."
                className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-500"
              />
              <div className="flex justify-end mt-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <Send className="w-4 h-4" />
                  Gửi
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {[1, 2, 3].map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Nguyễn Văn A</div>
                      <div className="text-xs text-gray-500">2 giờ trước</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(5)}
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="bg-gray-50 rounded-lg p-4 ml-12">
                    <p className="text-gray-700">
                      Sản phẩm chất lượng tốt, giao hàng nhanh chóng. Rất hài lòng với dịch vụ!
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-6 ml-12 mt-3">
                    <button className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Trả lời
                    </button>
                    <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors">
                      <Heart className="w-4 h-4" />
                      12
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          
          {relatedProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Không có sản phẩm liên quan</p>
            </div>
          ) : (
            <Swiper
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 }
              }}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="w-full"
            >
              {relatedProducts.map((item) => (
                <SwiperSlide key={item._id}>
                  <Product data={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
