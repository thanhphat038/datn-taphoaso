import React, { useState, useEffect, useRef } from 'react';
import { useProductDetailData, useRelatedProducts } from '../controller/Product.controller';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../components/Product';
import { addToCart } from '../service/Cart.service';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import { getProductComments, postComment } from '../service/Comment.service';
import { getReviewsByProductId } from '../service/Product.service';
import Cookies from 'js-cookie';
import Product from '../components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

const ProductDetail = () => {
    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pendingAddQty, setPendingAddQty] = useState(0);
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'reviews'
    const [reviews, setReviews] = useState([]);
    const [reviewsPagination, setReviewsPagination] = useState({
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1
    });
    const [reviewsLoading, setReviewsLoading] = useState(false);
    
    // Favorite states
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [loadingAddToCart, setLoadingAddToCart] = useState(false);

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

    // Kiểm tra trạng thái yêu thích khi component mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await getFavorites();
                if (response.data?.data) {
                    const isProductFavorite = response.data.data.some(
                        (fav) => fav.product_id?._id === product._id
                    );
                    setIsFavorite(isProductFavorite);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
                setIsFavorite(false);
            }
        };

        if (product._id) {
            checkFavoriteStatus();
        }
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

    // Fetch reviews when product changes or tab changes to reviews
    useEffect(() => {
        if (product._id) {
            fetchReviews(1);
        }
    }, [activeTab, product._id]);

    const fetchReviews = async (page = 1) => {
        if (!product._id) return;
        
        try {
            setReviewsLoading(true);
            const response = await getReviewsByProductId(product._id);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
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

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => {
            const newQuantity = prev + delta;
            if (newQuantity < 1) return 1;
            if (product.stock && newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        console.log('🔍 Debug - handleAddToCart called');
        console.log('🔍 Debug - Product stock:', product.stock);
        console.log('🔍 Debug - Product ID:', product._id);
        console.log('🔍 Debug - Quantity:', quantity);
        
        const userId = getUserId();
        console.log('🔍 Debug - User ID:', userId);
        
        if (!userId) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        // Chỉ kiểm tra stock nếu có thông tin stock và stock = 0
        if (product.stock !== undefined && product.stock !== null && product.stock === 0) {
            alert('Sản phẩm hiện tại hết hàng!');
            return;
        }

        if (loadingAddToCart) {
            console.log('🔍 Debug - Already loading, ignoring click');
            return;
        }

        console.log('🔍 Debug - Starting add to cart process');
        setLoadingAddToCart(true);
        pendingAddQtyRef.current += quantity;
        setPendingAddQty(pendingAddQtyRef.current);

        if (debounceAddToCart.current) {
            clearTimeout(debounceAddToCart.current);
        }
        debounceAddToCart.current = setTimeout(async () => {
            if (pendingAddQtyRef.current > 0) {
                try {
                    console.log('🔍 Debug - Adding to cart:', product._id, 'quantity:', pendingAddQtyRef.current);
                    await addToCart(product._id, pendingAddQtyRef.current);
                    console.log('✅ Debug - Added to cart successfully');
                    
                    window.dispatchEvent(new Event('cart-updated'));
                    alert(`Đã thêm ${pendingAddQtyRef.current} sản phẩm vào giỏ hàng!`);
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    alert('Thêm vào giỏ hàng thất bại! Vui lòng thử lại.');
                } finally {
                    setLoadingAddToCart(false);
                }
                pendingAddQtyRef.current = 0;
                setPendingAddQty(0);
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
                                disabled={loadingAddToCart}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loadingAddToCart ? (
                                    <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    'Thêm vào giỏ hàng'
                                )}
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

            {/* Description and Comments Section */}
            <div className="flex gap-8 my-8">
                {/* Description */}
                <div className="bg-white p-6 rounded-lg shadow-md w-1/2 h-[600px] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-white z-10">Mô tả sản phẩm</h2>
                    {product.images && product.images.length > 0 && (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full max-h-60 object-contain rounded mb-4"
                        />
                    )}
                    <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                </div>

                {/* Comments */}
                <div className="bg-white p-6 rounded-lg shadow-md w-1/2 h-[600px] flex flex-col">
                    {/* Tab buttons */}
                    <div className="flex border-b border-gray-200 mb-4">
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'comments'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Bình luận
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'reviews'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Đánh giá ({reviews.length})
                        </button>
                    </div>

                    {activeTab === 'comments' ? (
                        <>
                            {/* Comment input box */}
                            <div className="border border-blue-300 rounded-lg p-4 mb-6">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Bình luận"
                                    className="w-full border-none outline-none bg-transparent text-[16px] resize-none"
                                    rows="3"
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={handlePostComment}
                                        disabled={!newComment.trim() || postingComment}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                        </svg>
                                        {postingComment ? 'Đang gửi...' : 'Gửi'}
                                    </button>
                                </div>
                            </div>

                            {/* Comments List - scrollable */}
                            <div className="flex-grow overflow-y-auto pr-4 space-y-6">
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
                                    displayedComments.map((comment) => (
                                        <div key={comment._id} className="border border-blue-300 rounded-lg p-4">
                                            {/* User info */}
                                            <div className="flex items-center gap-3 mb-2">
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
                                                <div>
                                                    <div className="font-semibold">
                                                        {comment.user_id?.full_name || comment.user_id?.username || 'Người dùng'}
                                                    </div>
                                                </div>
                                                <div className="ml-auto text-xs text-gray-500">
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
                                                </div>
                                            </div>
                                            {/* Comment content */}
                                            <div className="bg-[#f6f6f6] rounded-lg p-3 ml-12 mb-2">
                                                {comment.comment}
                                            </div>
                                            {/* Actions */}
                                            <div className="flex items-center gap-6 ml-12">
                                                <button className="flex items-center gap-1 text-blue-500 hover:underline text-[15px]">
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                    Trả lời
                                                </button>
                                                <button className="flex items-center gap-1 text-blue-500 hover:underline text-[15px]">
                                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                    0
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                
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
                        </>
                    ) : (
                        <>
                            {/* Reviews List - scrollable */}
                            <div className="flex-grow overflow-y-auto pr-4 space-y-6">
                                {reviewsLoading ? (
                                    <div className="text-center py-8 text-gray-500">Đang tải đánh giá...</div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                                            {/* User info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <img 
                                                    src="https://i.imgur.com/0y0y0y0.png" 
                                                    alt="avatar" 
                                                    className="w-10 h-10 rounded-full border" 
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold">{review.user_id?.email || 'Người dùng'}</div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Rating stars */}
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg 
                                                                key={i} 
                                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor" 
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(review.create_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                            {/* Review content */}
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-gray-800">{review.user_review || 'Không có nội dung đánh giá.'}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={5}
                        loop={true}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        modules={[Autoplay]}
                        className="w-full"
                    >
                        {relatedProducts.map((item) => (
                            <SwiperSlide key={item._id}>
                                <Product data={item} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
