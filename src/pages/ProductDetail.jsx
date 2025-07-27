import React, { useState, useEffect, useRef } from 'react';
import { useProductDetailData, useRelatedProducts } from '../controller/Product.controller';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../components/Product';
import { addToCart } from '../service/Cart.service';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import { getProductComments, postComment } from '../service/Comment.service';
import Product from '../components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

const ProductDetail = () => {

    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);

    const { id } = useParams();
    const pd = useProductDetailData(id) || [];
    const product = pd.data || {};
    const relatedProducts = useRelatedProducts(product._id, 20);

    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const COMMENTS_TO_SHOW = 5;

    // Ref để debounce khi thêm vào giỏ hàng
    const debounceAddToCart = useRef();
    const pendingAddQtyRef = useRef(0);

    useEffect(() => {
        // Kiểm tra trạng thái yêu thích khi mount
        const fetchFavorite = async () => {
            const res = await getFavorites();
            if (res.data?.data) {
                setIsFavorite(res.data.data.some(fav => fav.product_id?._id === product._id));
            }
        };
        if (product._id) fetchFavorite();
    }, [product._id]);

    useEffect(() => {
      if (!product._id) return;
      setLoadingComments(true);
      getProductComments(product._id)
        .then(data => {
          console.log('🔍 Debug - Comments data:', data.data);
          setComments(data.data || []);
        })
        .finally(() => setLoadingComments(false));
    }, [product._id]);

    const handleToggleFavorite = async () => {
        if (loadingFavorite) return;
        setLoadingFavorite(true);
        try {
            if (isFavorite) {
                await removeFromFavorite(product._id);
                setIsFavorite(false);
            } else {
                await addToFavorite(product._id);
                setIsFavorite(true);
            }
        } catch {
            alert('Có lỗi khi thao tác yêu thích!');
        } finally {
            setLoadingFavorite(false);
        }
    };

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
        // setPendingAddQty(pendingAddQtyRef.current); // This line was removed as per the edit hint

        if (debounceAddToCart.current) {
            clearTimeout(debounceAddToCart.current);
        }
        debounceAddToCart.current = setTimeout(async () => {
            if (pendingAddQtyRef.current > 0) {
                try {
                    await addToCart(product._id, pendingAddQtyRef.current);
                    window.dispatchEvent(new Event('cart-updated'));
                } catch {
                    alert('Thêm vào giỏ hàng thất bại!');
                }
                pendingAddQtyRef.current = 0;
                // setPendingAddQty(0); // This line was removed as per the edit hint
            }
            debounceAddToCart.current = null;
        }, 400);
    };

    const handlePostComment = async () => {
      if (!newComment.trim()) return;
      setPostingComment(true);
      try {
        await postComment(product._id, newComment);
        setNewComment('');
        // Reload lại toàn bộ bình luận từ server
        const data = await getProductComments(product._id);
        setComments(data.data || []);
      } catch (err) {
        console.log("Lỗi khi gửi bình luận", err);
        // Có thể alert hoặc hiển thị thông báo lỗi ở đây nếu muốn
      } finally {
        setPostingComment(false);
      }
    };

    const displayedComments = showAllComments ? comments : comments.slice(0, COMMENTS_TO_SHOW);

    if (!product._id) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link to="/product" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                                Sản phẩm
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={mainImage || product.images?.[0] || '/images/image_product.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                                        mainImage === image ? 'border-blue-500' : 'border-transparent'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-red-500">
                                    {formatCurrency(product.price)}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        {formatCurrency(product.original_price)}
                                    </span>
                                )}
                            </div>
                            {product.original_price && product.original_price > product.price && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {product.stock !== undefined && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Tình trạng</h3>
                                <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                                </p>
                            </div>
                        )}

                        {product.category && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {product.category.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quantity and Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="text-lg font-semibold">Số lượng:</label>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                                    disabled={product.stock && quantity >= product.stock}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock || product.stock === 0}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button
                                onClick={handleToggleFavorite}
                                disabled={loadingFavorite}
                                className={`p-3 rounded-lg border transition-colors ${
                                    isFavorite
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                }`}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill={isFavorite ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Comments Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-semibold mb-6">Bình luận ({comments.length})</h2>
                
                {/* Add Comment */}
                <div className="mb-6">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handlePostComment}
                            disabled={!newComment.trim() || postingComment}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {postingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                {loadingComments ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Đang tải bình luận...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedComments.map((comment) => (
                            <div key={comment._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {comment.user_id?.avatar ? (
                                            <img
                                                src={comment.user_id.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">
                                                {comment.user_id?.full_name || comment.user_id?.username || 'Người dùng'}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {comment.create_at ? 
                                                    new Date(comment.create_at).toLocaleString('vi-VN', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 
                                                    'Vừa xong'
                                                }
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{comment.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {comments.length > COMMENTS_TO_SHOW && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setShowAllComments(!showAllComments)}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    {showAllComments ? 'Thu gọn' : `Xem thêm ${comments.length - COMMENTS_TO_SHOW} bình luận`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-6">Sản phẩm liên quan</h2>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        className="related-products-swiper"
                    >
                        {relatedProducts.map((relatedProduct) => (
                            <SwiperSlide key={relatedProduct._id}>
                                <Product data={relatedProduct} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
