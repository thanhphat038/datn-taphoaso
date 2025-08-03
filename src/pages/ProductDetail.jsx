import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useProductDetailData, useRelatedProducts } from '../controller/Product.controller';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../components/Product';
import { addToCart } from '../service/Cart.service';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import { getProductComments, postComment, postReply } from '../service/Comment.service';
import { getReviewsByProductId, getProductsByCategory } from '../service/Product.service';
import Cookies from 'js-cookie';
import Product from '../components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useToast } from '../components/ToastContainer';
import ProductPackageSelector from '../components/ProductPackageSelector';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState(null);
    const [quantity] = useState(1); // Default quantity, không cần setter
    const [loadingAddToCart, setLoadingAddToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [postingReply, setPostingReply] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [_pendingAddQty, setPendingAddQty] = useState(0);
    const pendingAddQtyRef = useRef(0);
    const debounceAddToCart = useRef(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'reviews'
    const [loadingComments, setLoadingComments] = useState(false);
    const [relatedProductsByCategory, setRelatedProductsByCategory] = useState([]);
    const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(false);
    const { showWarning } = useToast();

    // Thêm state cho package selection
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Thêm function để xử lý package selection
    const handlePackageSelect = useCallback((pkg) => {
        setSelectedPackage(pkg);
    }, []);

    const COMMENTS_TO_SHOW = 3;

    const pd = useProductDetailData(id) || [];
    const productData = pd.data || {};
    const relatedProducts = useRelatedProducts(productData._id, 20);

    // Thêm state này vào đầu component
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    // Thêm function để toggle replies
    const toggleReplies = useCallback((commentId) => {
        setExpandedReplies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    }, []);

    // Thêm function để kiểm tra xem replies có được mở rộng không
    const isRepliesExpanded = useCallback((commentId) => {
        return expandedReplies.has(commentId);
    }, [expandedReplies]);

    // Hàm hiển thị notification
    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    }, []);

    // Lấy user_id từ token
    const getUserId = useCallback(() => {
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
    }, []);

    // Kiểm tra trạng thái yêu thích khi component mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await getFavorites();
                if (response.data?.data) {
                    const isProductFavorite = response.data.data.some(
                        (fav) => fav.product_id?._id === productData._id
                    );
                    setIsFavorite(isProductFavorite);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error);
                setIsFavorite(false);
            }
        };

        if (productData._id) {
            checkFavoriteStatus();
        }
    }, [productData._id]);

    useEffect(() => {
        if (!productData._id) return;
        setLoadingComments(true);
        getProductComments(productData._id)
            .then(data => {
                setComments(data.data || []);
            })
            .catch(err => {
                console.error('Error fetching comments:', err);
                setComments([]);
            })
            .finally(() => {
                setLoadingComments(false);
            });
    }, [productData._id]);

    // Fetch reviews when product changes or tab changes to reviews
    useEffect(() => {
        if (productData._id) {
            fetchReviews(1);
        }
    }, [activeTab, productData._id]);

    const fetchRelatedProductsByCategory = useCallback(async () => {
        if (!productData.category_id) return;
        
        try {
            setLoadingRelatedProducts(true);
            const response = await getProductsByCategory(productData.category_id, 1, 10);
            
            // Lọc bỏ sản phẩm hiện tại khỏi danh sách liên quan
            const filteredProducts = response.data?.data?.filter(product => product._id !== productData._id) || [];
            setRelatedProductsByCategory(filteredProducts);
        } catch (error) {
            console.error('Error fetching related products by category:', error);
            setRelatedProductsByCategory([]);
        } finally {
            setLoadingRelatedProducts(false);
        }
    }, [productData.category_id, productData._id]);

    // Fetch related products by category when product changes
    useEffect(() => {
        if (productData._id && productData.category_id) {
            fetchRelatedProductsByCategory();
        }
    }, [productData._id, productData.category_id, fetchRelatedProductsByCategory]);

    const fetchReviews = useCallback(async () => {
        if (!productData._id) return;
        
        try {
            setReviewsLoading(true);
            const response = await getReviewsByProductId(productData._id);
            setReviews((response.data || []).reverse());
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    }, [productData._id]);

    const handleToggleFavorite = async () => {
        if (loadingFavorite) return;
        
        const userId = getUserId();
        if (!userId) {
            showWarning('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
            return;
        }
        
        setLoadingFavorite(true);
        try {
            if (isFavorite) {
                // Xóa khỏi favorite
                await removeFromFavorite(productData._id);
                setIsFavorite(false);
                // Phát sự kiện thông báo xóa sản phẩm khỏi favorite
                window.dispatchEvent(new CustomEvent('favorite-removed', {
                    detail: { productId: productData._id, product: productData }
                }));
            } else {
                // Thêm vào favorite
                await addToFavorite(productData._id); // Không cần truyền userId nữa
                setIsFavorite(true);
                // Phát sự kiện thông báo thêm sản phẩm vào favorite
                window.dispatchEvent(new CustomEvent('favorite-added', {
                    detail: { productId: productData._id, product: productData }
                }));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showNotification('Có lỗi xảy ra khi thao tác với mục yêu thích', 'error');
        } finally {
            setLoadingFavorite(false);
        }
    };

    // Removed unused function handleQuantityChange

    // Cập nhật handleBuyNow để sử dụng selectedPackage
    const handleBuyNow = async () => {
        const userId = getUserId();
        if (!userId) {
            // Lưu thông tin sản phẩm để mua ngay sau khi đăng nhập
            const buyNowProduct = {
                productId: productData._id,
                name: productData.name,
                price: productData.price,
                quantity: selectedPackage ? selectedPackage.quantity : quantity,
                image: productData.images?.[0],
                package: selectedPackage,
                originalPrice: productData.original_price || productData.price
            }
            localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
            
            showWarning('Vui lòng đăng nhập để mua hàng');
            return;
        }

        if (productData.stock !== undefined && productData.stock <= 0) {
            showNotification('Sản phẩm đã hết hàng!', 'error');
            return;
        }

        // Sử dụng thông tin gói đã chọn (nếu có)
        const finalQuantity = selectedPackage ? selectedPackage.quantity : quantity;
        const finalPrice = selectedPackage ? selectedPackage.unitPrice : productData.price;

        if (productData.stock && finalQuantity > productData.stock) {
            showNotification(`Chỉ còn ${productData.stock} sản phẩm trong kho!`, 'error');
            return;
        }

        try {
            // Thêm vào giỏ hàng trước và đợi hoàn thành
            await addToCart(productData._id, finalQuantity);
            
            // Lưu thông tin sản phẩm để mua ngay vào localStorage
            const buyNowProduct = {
                productId: productData._id,
                name: productData.name,
                price: finalPrice, // Giá đơn vị
                quantity: finalQuantity,
                image: productData.images?.[0],
                package: selectedPackage,
                originalPrice: productData.price
            };
            
            localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
            
            // Dispatch event để cập nhật giỏ hàng (nếu cần)
            window.dispatchEvent(new Event('cart-updated'));
            
            // Chuyển đến trang thanh toán ngay lập tức
            navigate('/checkout');
        } catch (error) {
            console.error('❌ Debug - handleBuyNow: Error adding to cart:', error);
            showNotification('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!', 'error');
        }
    };

    // Cập nhật handleAddToCart để sử dụng selectedPackage
    const handleAddToCart = () => {
        const userId = getUserId();
        
        if (!userId) {
            showWarning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }

        // Sử dụng thông tin gói đã chọn (nếu có)
        const finalQuantity = selectedPackage ? selectedPackage.quantity : quantity;

        // Chỉ kiểm tra stock nếu có thông tin stock và stock = 0
        if (productData.stock !== undefined && productData.stock !== null && productData.stock === 0) {
            showWarning('Sản phẩm hiện tại hết hàng!');
            return;
        }

        if (loadingAddToCart) {
            return;
        }

        setLoadingAddToCart(true);
        pendingAddQtyRef.current += finalQuantity; // Sử dụng finalQuantity
        setPendingAddQty(pendingAddQtyRef.current);

        if (debounceAddToCart.current) {
            clearTimeout(debounceAddToCart.current);
        }
        debounceAddToCart.current = setTimeout(async () => {
            if (pendingAddQtyRef.current > 0) {
                try {
                    await addToCart(productData._id, pendingAddQtyRef.current);
                    
                    window.dispatchEvent(new Event('cart-updated'));
                    showNotification(`Đã thêm ${pendingAddQtyRef.current} sản phẩm vào giỏ hàng!`, 'success');
                } catch (error) {
                    console.error('Error adding to cart:', error);
                    showNotification('Thêm vào giỏ hàng thất bại! Vui lòng thử lại.', 'error');
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
        
        const userId = getUserId();
        if (!userId) {
            showWarning('Vui lòng đăng nhập để gửi bình luận');
            return;
        }
        
        setPostingComment(true);
        try {
            await postComment(productData._id, newComment);
            
            // Fetch lại toàn bộ comments thay vì cập nhật state local
            const commentsResponse = await getProductComments(productData._id);
            if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
                setComments(commentsResponse.data);
            }
            
            setNewComment('');
            showNotification('Bình luận đã được gửi thành công!', 'success');
        } catch (err) {
            console.log("Lỗi khi gửi bình luận", err);
            showNotification('Không thể gửi bình luận. Vui lòng thử lại!', 'error');
        } finally {
            setPostingComment(false);
        }
    };

    const handleReply = (commentId, userName, replyToUserName = null) => {
        const userId = getUserId();
        if (!userId) {
            showWarning('Vui lòng đăng nhập để trả lời bình luận');
            return;
        }
        // Nếu có replyToUserName (trả lời reply), thì hiển thị tên người viết reply
        // Nếu không có (trả lời comment gốc), thì hiển thị tên người viết comment
        const displayName = replyToUserName || userName;
        setReplyingTo({ id: commentId, userName: displayName });
        // Tự động điền @tên người dùng vào textarea
        setReplyText(`@${displayName} `);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handlePostReply = async () => {
        if (!replyText.trim()) return;
        
        const userId = getUserId();
        if (!userId) {
            showWarning('Vui lòng đăng nhập để trả lời bình luận');
            return;
        }
        
        setPostingReply(true);
        try {
            await postReply(replyingTo.id, replyText);
            
            // Thêm delay nhỏ để đảm bảo database đã được cập nhật
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const commentsResponse = await getProductComments(productData._id);
            
            if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
                setComments(commentsResponse.data);
            }
            
            setReplyText('');
            setReplyingTo(null);
            showNotification('Trả lời đã được gửi thành công!', 'success');
        } catch (err) {
            console.error("❌ Lỗi khi gửi trả lời", err);
            showNotification('Không thể gửi trả lời. Vui lòng thử lại!', 'error');
        } finally {
            setPostingReply(false);
        }
    };

    const displayedComments = useMemo(() => 
        showAllComments ? comments : comments.slice(0, COMMENTS_TO_SHOW), 
        [showAllComments, comments]
    );

    if (!productData._id) {
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
        <>
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
                            <svg key="breadcrumb-chevron-1" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link to="/product" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                                Sản phẩm
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg key="breadcrumb-chevron-2" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-1 text-gray-500 md:ml-2">{productData.name}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={mainImage || productData.images?.[0] || '/images/image_product.png'}
                            alt={productData.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {productData.images && productData.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {productData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(image)}
                                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                                        mainImage === image ? 'border-blue-500' : 'border-transparent'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${productData.name} ${index + 1}`}
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
                        <div className="flex items-start justify-between mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 flex-1">{productData.name}</h1>
                            
                            {/* Favorite Button - Next to Product Name */}
                            <button
                                onClick={handleToggleFavorite}
                                disabled={loadingFavorite}
                                className={`ml-4 p-3 rounded-lg border transition-colors flex items-center gap-2 flex-shrink-0 ${
                                    isFavorite
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                                }`}
                            >
                                <svg
                                    className="w-5 h-5"
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
                                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-red-500">
                                    {formatCurrency(productData.price)}
                                </span>
                                {productData.original_price && productData.original_price > productData.price && (
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        {formatCurrency(productData.original_price)}
                                    </span>
                                )}
                            </div>
                            {productData.original_price && productData.original_price > productData.price && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                    -{Math.round(((productData.original_price - productData.price) / productData.original_price) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                            <p className="text-gray-600 leading-relaxed">{productData.description}</p>
                        </div>

                        {productData.category && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {productData.category.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Product Package Selector - hiển thị cho TẤT CẢ sản phẩm */}
                    <ProductPackageSelector
                        product={productData}
                        onPackageSelect={handlePackageSelect}
                        selectedPackage={selectedPackage}
                    />

                    {/* Quantity and Actions */}
                    <div className="space-y-3">
                        {/* Hàng 1: Nút Mua hàng (nổi bật nhất) */}
                       
                        
                        {/* Hàng 2: Thêm vào giỏ hàng (icon) và Mua ngay */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={loadingAddToCart}
                                className="w-16 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed border border-gray-300 flex items-center justify-center py-4"
                                title="Thêm vào giỏ hàng"
                            >
                                {loadingAddToCart ? (
                                    <div className="animate-spin h-5 w-5 border-b-2 border-gray-600"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                )}
                            </button>
                            
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Mô tả sản phẩm</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        {productData.images && productData.images.length > 0 && (
                            <img
                                src={productData.images[0]}
                                alt={productData.name}
                                className="w-full max-h-80 object-contain rounded-lg shadow-md mb-6"
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed text-lg">{productData.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                        
                        {productData.category && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 font-medium">Danh mục:</span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {productData.category.name}
                                </span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-medium">Trạng thái:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                productData.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {productData.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

                            {/* Tab buttons */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`px-6 py-3 font-semibold text-base border-b-2 transition-colors ${
                            activeTab === 'comments'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        💬 Bình luận
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 font-semibold text-base border-b-2 transition-colors ${
                            activeTab === 'reviews'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        ⭐ Đánh giá ({reviews.length})
                    </button>
                </div>

                    {activeTab === 'comments' ? (
                        <div className="space-y-6">
                            {/* Comment input box */}
                            {getUserId() ? (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="text-base font-semibold text-gray-800 mb-3">💭 Viết bình luận của bạn</h3>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                                        className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button 
                                            onClick={handlePostComment}
                                            disabled={!newComment.trim() || postingComment}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                                        >
                                            <svg key="main-send-icon" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                            </svg>
                                            <span key="main-send-text">{postingComment ? 'Đang gửi...' : 'Gửi bình luận'}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg key="comment-section-icon" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Đăng nhập để bình luận</h3>
                                    <p className="text-gray-600 mb-4 text-sm">Bạn cần đăng nhập để có thể gửi bình luận về sản phẩm này.</p>
                                    <Link 
                                        to="/login" 
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 font-medium text-sm"
                                    >
                                        <svg key="login-icon" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-4">
                                {loadingComments ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-3 text-gray-600 text-sm">Đang tải bình luận...</p>
                                    </div>
                                ) : comments.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có bình luận nào</h3>
                                        <p className="text-gray-600 text-sm">Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm này!</p>
                                    </div>
                                ) : (
                                    displayedComments && Array.isArray(displayedComments) && displayedComments.map((comment) => (
                                        <div key={`comment-${comment._id}-${comment.replies?.length || 0}`} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                            {/* User info */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-sm">
                                                    {comment.user_id?.avatar ? (
                                                        <img
                                                            src={comment.user_id.avatar}
                                                            alt="Avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <svg key={`comment-avatar-${comment._id}`} className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-base text-gray-800">
                                                        {comment.user_id?.full_name || comment.user_id?.username || 'Người dùng'}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
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
                                            </div>
                                            {/* Comment content */}
                                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-md p-3 ml-13 mb-3 border-l-4 border-blue-200">
                                                <p className="text-gray-800 text-sm leading-relaxed">{comment.comment || 'Nội dung bình luận'}</p>
                                            </div>
                                            {/* Actions */}
                                            <div className="flex items-center gap-4 ml-13">
                                                <button 
                                                    onClick={() => handleReply(comment._id, comment.user_id?.full_name || comment.user_id?.username || 'Người dùng')}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                                                >
                                                    <svg key="reply-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                                                    </svg>
                                                    Trả lời
                                                </button>
                                            </div>

                                            {/* Reply Form */}
                                            {replyingTo && replyingTo.id === comment._id && (
                                                <div className="ml-10 mt-2 border-l-2 border-blue-200 pl-3">
                                                    <div className="bg-white rounded-md border border-blue-200 p-2">
                                                        <div className="text-xs text-gray-600 mb-1">
                                                            Trả lời <span className="font-medium text-blue-600">@{replyingTo.userName}</span>
                                                        </div>
                                                        <textarea
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                            placeholder="Viết trả lời của bạn..."
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                                            rows="2"
                                                            autoFocus
                                                        />
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <button
                                                                onClick={handleCancelReply}
                                                                className="px-2 py-1 text-gray-600 hover:text-gray-800 text-xs"
                                                            >
                                                                Hủy
                                                            </button>
                                                            <button
                                                                onClick={handlePostReply}
                                                                disabled={!replyText.trim() || postingReply}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                                                            >
                                                                {postingReply ? (
                                                                    <>
                                                                        <div key="loading-spinner" className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                                                        <span key="loading-text">Đang gửi...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg key="send-icon" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                                                        </svg>
                                                                        <span key="send-text">Gửi</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Replies List - Remove debug message */}
                                            {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 ? (
                                                <div className="ml-12 mt-3">
                                                    {/* Hiển thị 1 reply đầu tiên nếu chưa mở rộng */}
                                                    {!isRepliesExpanded(comment._id) && comment.replies.length > 1 ? (
                                                        <>
                                                            {/* Hiển thị 1 reply đầu tiên */}
                                                            <div className="space-y-3">
                                                                {comment.replies.slice(0, 1).map((reply, replyIndex) => (
                                                                    <div key={reply._id || replyIndex} className="border-l-2 border-gray-200 pl-4">
                                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                                    {reply.user_id?.avatar ? (
                                                                                        <img
                                                                                            src={reply.user_id.avatar}
                                                                                            alt="Avatar"
                                                                                            className="w-full h-full object-cover"
                                                                                        />
                                                                                    ) : (
                                                                                        <svg key={`avatar-icon-${reply._id || replyIndex}`} className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                                        </svg>
                                                                                    )}
                                                                                </div>
                                                                                <span className="font-medium text-sm">
                                                                                    {reply.user_id?.full_name || reply.user_id?.username || 'Người dùng'}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {reply.create_at ? 
                                                                                        new Date(reply.create_at).toLocaleString('vi-VN', {
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
                                                                            <div className="text-sm text-gray-800 ml-8 mb-2">
                                                                                {reply.reply || 'Nội dung trả lời'}
                                                                            </div>
                                                                            {/* Reply action for replies */}
                                                                            <div className="flex items-center gap-4 ml-8">
                                                                                <button 
                                                                                    onClick={() => handleReply(comment._id, comment.user_id?.full_name || comment.user_id?.username || 'Người dùng', reply.user_id?.full_name || reply.user_id?.username || 'Người dùng')}
                                                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs"
                                                                                >
                                                                                    <svg key={`reply-reply-icon-${reply._id || replyIndex}`} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                                                                                    </svg>
                                                                                    Trả lời
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            
                                                            {/* Nút "Xem thêm replies" */}
                                                            <div className="mt-2">
                                                                <button
                                                                    onClick={() => toggleReplies(comment._id)}
                                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                    Xem thêm {comment.replies.length - 1} trả lời
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Hiển thị tất cả replies khi đã mở rộng hoặc chỉ có 1 reply */}
                                                            <div className="space-y-3">
                                                    {comment.replies.map((reply, replyIndex) => (
                                                        <div key={reply._id || replyIndex} className="border-l-2 border-gray-200 pl-4">
                                                            <div className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                                        {reply.user_id?.avatar ? (
                                                                            <img
                                                                                src={reply.user_id.avatar}
                                                                                alt="Avatar"
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <svg key={`avatar-icon-${reply._id || replyIndex}`} className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                    <span className="font-medium text-sm">
                                                                        {reply.user_id?.full_name || reply.user_id?.username || 'Người dùng'}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {reply.create_at ? 
                                                                            new Date(reply.create_at).toLocaleString('vi-VN', {
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
                                                                <div className="text-sm text-gray-800 ml-8 mb-2">
                                                                    {reply.reply || 'Nội dung trả lời'}
                                                                </div>
                                                                {/* Reply action for replies */}
                                                                <div className="flex items-center gap-4 ml-8">
                                                                    <button 
                                                                        onClick={() => handleReply(comment._id, comment.user_id?.full_name || comment.user_id?.username || 'Người dùng', reply.user_id?.full_name || reply.user_id?.username || 'Người dùng')}
                                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs"
                                                                    >
                                                                        <svg key={`reply-reply-icon-${reply._id || replyIndex}`} width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                                                                        </svg>
                                                                        Trả lời
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                            </div>
                                                            
                                                            {/* Nút "Thu gọn" nếu đã mở rộng và có nhiều hơn 1 reply */}
                                                            {isRepliesExpanded(comment._id) && comment.replies.length > 1 && (
                                                                <div className="mt-2">
                                                                    <button
                                                                        onClick={() => toggleReplies(comment._id)}
                                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                        </svg>
                                                                        Thu gọn
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ) : comment.replies === undefined ? (
                                                <div className="ml-12 mt-3 text-center text-gray-500 text-sm">
                                                    Đang tải trả lời...
                                                </div>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                                
                                {comments.length > COMMENTS_TO_SHOW && (
                                    <div className="text-center pt-3">
                                        <button
                                            onClick={() => setShowAllComments(!showAllComments)}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            {showAllComments ? 'Thu gọn' : `Xem thêm ${comments.length - COMMENTS_TO_SHOW} bình luận`}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviewsLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600 text-lg">Đang tải đánh giá...</p>
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có đánh giá nào</h3>
                                        <p className="text-gray-600 text-lg">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                                    </div>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                            {/* User info */}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden shadow-md">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-lg text-gray-800">{review.user_id?.email || 'Người dùng'}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {/* Rating stars */}
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg 
                                                                key={`star-${review._id}-${i}`} 
                                                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor" 
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                        <span className="text-sm font-medium text-gray-600 ml-2">{review.rating}/5</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(review.create_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                            {/* Review content */}
                                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-400">
                                                <p className="text-gray-800 text-lg leading-relaxed">{review.user_review || 'Không có nội dung đánh giá.'}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

            {/* Related Products by Category */}
            {relatedProductsByCategory && relatedProductsByCategory.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Sản phẩm cùng danh mục</h2>
                        <Link 
                            to={`/product?category=${productData.category_id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                        >
                            Xem tất cả
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                    
                    {loadingRelatedProducts ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                                    <div className="bg-gray-200 h-4 rounded mb-1"></div>
                                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                1280: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                            }}
                            loop={relatedProductsByCategory.length > 5}
                            autoplay={{ delay: 2000, disableOnInteraction: false }}
                            modules={[Autoplay]}
                            className="w-full"
                        >
                            {relatedProductsByCategory.map((item) => (
                                <SwiperSlide key={item._id}>
                                    <Product data={item} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            )}

            {/* Original Related Products (if any) */}
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
                                <Product 
                                    data={item} 
                                    onAddToCartSuccess={showNotification}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Custom Notification */}
                            {notification.show && (
                    <div className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${
                        notification.type === 'success' ? 'border-green-500' : 'border-red-500'
                    } transform transition-all duration-300 ease-in-out`}>
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {notification.type === 'success' ? (
                                        <svg key="success-icon" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg key="error-icon" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                    <p className={`text-sm font-medium ${
                                        notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        className={`inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150`}
                                        onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                                    >
                                        <svg key="close-icon" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDetail;
