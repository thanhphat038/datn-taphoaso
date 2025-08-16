import React, { useState, useEffect, useRef } from 'react';
import { useProductDetailData, useRelatedProducts } from '../controller/Product.controller';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../service/Cart.service';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import { getProductComments, postComment, postReply } from '../service/Comment.service';
import { getReviewsByProductId, getProductsByCategory } from '../service/Product.service';
import Cookies from 'js-cookie';
import { useAlertContext } from '../components/AlertProvider';
import { useToast } from '../components/ToastContainer';

// Import các component đã tách ra
import Breadcrumb from '../components/ProductDetail/Breadcrumb';
import ProductImages from '../components/ProductDetail/ProductImages';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import ProductDescription from '../components/ProductDetail/ProductDescription';
import TabButtons from '../components/ProductDetail/TabButtons';
import CommentSection from '../components/ProductDetail/CommentSection';
import ReviewSection from '../components/ProductDetail/ReviewSection';
import RelatedProducts from '../components/ProductDetail/RelatedProducts';
import Notification from '../components/ProductDetail/Notification';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const pendingAddQtyRef = useRef(0);
    const debounceAddToCart = useRef(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState('comments');
    const [loadingComments, setLoadingComments] = useState(false);
    const [relatedProductsByCategory, setRelatedProductsByCategory] = useState([]);
    const [loadingRelatedProducts, setLoadingRelatedProducts] = useState(false);
    const [quantity] = useState(1);
    const [, setPendingAddQty] = useState(0);
    const { showAlert, showError, hideAlert } = useAlertContext();
    const { showSuccess } = useToast();

    // State cho package selection
    const [selectedPackage, setSelectedPackage] = useState(null);

    const COMMENTS_TO_SHOW = 3;

    const pd = useProductDetailData(id) || [];
    const productData = pd.data || {};
    const relatedProducts = useRelatedProducts(productData._id, 20);

    // State cho expanded replies
    const [expandedReplies, setExpandedReplies] = useState(new Set());

    // Functions
    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const isRepliesExpanded = (commentId) => {
        return expandedReplies.has(commentId);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: 'success' });
        }, 3000);
    };

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

    // Effects
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

    useEffect(() => {
        if (productData._id) {
            fetchReviews(1);
        }
    }, [activeTab, productData._id]);

    useEffect(() => {
        if (productData._id && productData.category_id) {
            fetchRelatedProductsByCategory();
        }
    }, [productData._id, productData.category_id]);

    const fetchReviews = async () => {
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
    };

    const fetchRelatedProductsByCategory = async () => {
        if (!productData.category_id) return;

        try {
            setLoadingRelatedProducts(true);
            const response = await getProductsByCategory(productData.category_id, 1, 10);
            const filteredProducts = response.data?.data?.filter(product => product._id !== productData._id) || [];
            setRelatedProductsByCategory(filteredProducts);
        } catch (error) {
            console.error('Error fetching related products by category:', error);
            setRelatedProductsByCategory([]);
        } finally {
            setLoadingRelatedProducts(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (loadingFavorite) return;

        const userId = getUserId();
        if (!userId) {
            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để sử dụng tính năng yêu thích',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
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
                await removeFromFavorite(productData._id);
                setIsFavorite(false);
                window.dispatchEvent(new CustomEvent('favorite-removed', {
                    detail: { productId: productData._id, product: productData }
                }));
            } else {
                await addToFavorite(productData._id);
                setIsFavorite(true);
                window.dispatchEvent(new CustomEvent('favorite-added', {
                    detail: { productId: productData._id, product: productData }
                }));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showError('Có lỗi xảy ra khi thao tác với mục yêu thích', 'Lỗi');
        } finally {
            setLoadingFavorite(false);
        }
    };

    const handleBuyNow = async () => {
        const userId = getUserId();
        if (!userId) {
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

            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để mua hàng',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
                            navigate('/login');
                        }
                    }
                ],
                autoClose: false
            });
            return;
        }

        if ((productData.in_stock || 0) <= 0) {
            showError('Sản phẩm đã hết hàng!', 'Lỗi');
            return;
        }

        const finalQuantity = selectedPackage ? selectedPackage.quantity : quantity;
        const finalPrice = selectedPackage ? selectedPackage.unitPrice : productData.price;

        if (productData.in_stock && finalQuantity > productData.in_stock) {
            showError(`Chỉ còn ${productData.in_stock} sản phẩm trong kho!`, 'Lỗi');
            return;
        }

        try {
            await addToCart(productData._id, finalQuantity);

            const buyNowProduct = {
                productId: productData._id,
                name: productData.name,
                price: finalPrice,
                quantity: finalQuantity,
                image: productData.images?.[0],
                package: selectedPackage,
                originalPrice: productData.price
            };

            localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
            window.dispatchEvent(new Event('cart-updated'));
            navigate('/checkout');
        } catch (error) {
            console.error('❌ Debug - handleBuyNow: Error adding to cart:', error);
            showError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!', 'Lỗi');
        }
    };

    const handleAddToCart = () => {
        const userId = getUserId();

        if (!userId) {
            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
                            navigate('/login');
                        }
                    }
                ],
                autoClose: false
            });
            return;
        }

        const finalQuantity = selectedPackage ? selectedPackage.quantity : quantity;

        if ((productData.in_stock || 0) === 0) {
            showAlert({
                title: 'Hết hàng',
                message: 'Sản phẩm hiện tại hết hàng!',
                type: 'warning'
            });
            return;
        }

        if (loadingAddToCart) {
            return;
        }

        setLoadingAddToCart(true);
        pendingAddQtyRef.current += finalQuantity;
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
            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để gửi bình luận',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
                            navigate('/login');
                        }
                    }
                ],
                autoClose: false
            });
            return;
        }

        setPostingComment(true);
        try {
            await postComment(productData._id, newComment);
            const commentsResponse = await getProductComments(productData._id);
            if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
                setComments(commentsResponse.data);
            }
            setNewComment('');
            showSuccess('Bình luận đã được gửi thành công!');
        } catch (err) {
            console.log("Lỗi khi gửi bình luận", err);
            showError('Không thể gửi bình luận. Vui lòng thử lại!', 'Lỗi');
        } finally {
            setPostingComment(false);
        }
    };

    const handleReply = (commentId, userName) => {
        const userId = getUserId();
        if (!userId) {
            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để trả lời bình luận',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
                            navigate('/login');
                        }
                    }
                ],
                autoClose: false
            });
            return;
        }
        setReplyingTo({ id: commentId, userName });
        setReplyText('');
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };

    const handlePostReply = async () => {
        if (!replyText.trim()) return;

        const userId = getUserId();
        if (!userId) {
            showAlert({
                title: 'Yêu cầu đăng nhập',
                message: 'Vui lòng đăng nhập để trả lời bình luận',
                type: 'warning',
                actions: [
                    {
                        label: 'Đăng nhập ngay',
                        onClick: () => {
                            hideAlert();
                            navigate('/login');
                        }
                    }
                ],
                autoClose: false
            });
            return;
        }

        setPostingReply(true);
        try {
            await postReply(replyingTo.id, replyText);
            await new Promise(resolve => setTimeout(resolve, 500));
            const commentsResponse = await getProductComments(productData._id);
            if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
                setComments(commentsResponse.data);
            }
            setReplyText('');
            setReplyingTo(null);
            showSuccess('Trả lời đã được gửi thành công!');
        } catch (err) {
            console.error("❌ Lỗi khi gửi trả lời", err);
            showError('Không thể gửi trả lời. Vui lòng thử lại!', 'Lỗi');
        } finally {
            setPostingReply(false);
        }
    };

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
        <div className="min-h-screen bg-[#F5FBFB]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb productData={productData} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <ProductImages productData={productData} />

                    {/* Product Info */}
                    <ProductInfo
                        productData={productData}
                        isFavorite={isFavorite}
                        loadingFavorite={loadingFavorite}
                        onToggleFavorite={handleToggleFavorite}
                        selectedPackage={selectedPackage}
                        onPackageSelect={handlePackageSelect}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        loadingAddToCart={loadingAddToCart}
                        quantity={quantity}
                    />
                </div>

                {/* Product Description Section */}
                <ProductDescription productData={productData} />

                {/* Tab buttons */}
                <TabButtons 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    reviewsCount={reviews.length} 
                />

                {activeTab === 'comments' ? (
                    <CommentSection
                        comments={comments}
                        loadingComments={loadingComments}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        postingComment={postingComment}
                        handlePostComment={handlePostComment}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        postingReply={postingReply}
                        handleReply={handleReply}
                        handleCancelReply={handleCancelReply}
                        handlePostReply={handlePostReply}
                        showAllComments={showAllComments}
                        setShowAllComments={setShowAllComments}
                        expandedReplies={expandedReplies}
                        toggleReplies={toggleReplies}
                        isRepliesExpanded={isRepliesExpanded}
                        getUserId={getUserId}
                        COMMENTS_TO_SHOW={COMMENTS_TO_SHOW}
                    />
                ) : (
                    <ReviewSection 
                        reviews={reviews} 
                        reviewsLoading={reviewsLoading} 
                    />
                )}

                {/* Related Products */}
                <RelatedProducts
                    relatedProductsByCategory={relatedProductsByCategory}
                    loadingRelatedProducts={loadingRelatedProducts}
                    productData={productData}
                    relatedProducts={relatedProducts}
                />

                {/* Custom Notification */}
                <Notification 
                    notification={notification} 
                    setNotification={setNotification} 
                />
            </div>
        </div>
    );
};

export default ProductDetail;
