import React, { useState, useEffect, useRef } from 'react';
import { useProductDetailData } from '../controller/Product.controller';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency } from '../components/Product';
import { addToCart } from '../service/Cart.service';
import { addToFavorite, removeFromFavorite, getFavorites } from '../service/Favorite.service';
import { getProductComments, postComment } from '../service/Comment.service';

const ProductDetail = () => {

    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);

    const { id } = useParams();
    const pd = useProductDetailData(id) || [];
    const product = pd.data || {};

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
        .then(data => setComments(data.data || []))
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

    if (product.images) return (
        <main className="container mx-auto py-10 px-4">
            <div className="flex flex-wrap lg:flex-nowrap gap-8">
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <img
                        src={mainImage || (product.images?.[0] || '')}
                        alt={mainImage}
                        className="w-full max-w-md rounded-lg shadow-lg"
                    />
                    <div className="flex gap-4 mt-4">
                        {product.images && product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={index}
                                className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-blue-500"
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
<h1 className="text-3xl font-bold mb-4 flex items-center gap-3">{product.name}
    <button onClick={handleToggleFavorite} disabled={loadingFavorite} aria-label={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}>
        {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ef4444" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
        )}
    </button>
</h1>

                    <div className="mb-4">
                        <span className="text-2xl font-semibold text-red-600 mr-2">{formatCurrency(product.price )}</span>
                        {product.price && (
                            <span className="text-gray-500 line-through">{formatCurrency(product.price )}</span>
                        )}
                    </div>

                    <p className='flex mb-3'>
                        {[...Array(Math.floor(product.rating.rate || 0))].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        {[...Array(5 - Math.floor(product.rating.rate || 0))].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className='text-[14px] ms-2'> {product.rating.rate}/5</span>
                    </p>
                    <p className='text-[14px] mb-3'> {product.rating.count} đánh giá</p>

                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                            className={`bg-gray-200 text-gray-700 w-8 h-8 flex items-center justify-center rounded-l-md ${quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-12 h-8 text-center border-t border-b border-gray-200 outline-none"
                        />
                        <button
                            onClick={() => handleQuantityChange(1)}
className="bg-gray-200 text-gray-700 w-8 h-8 flex items-center justify-center rounded-r-md hover:bg-gray-300"
                        >
                            +
                        </button>
                        <span className="ml-4 text-sm text-gray-600">Còn hàng: {product.stock || 'X'}</span> {/* Placeholder */}
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleAddToCart}
                            className="bg-[#06AEF4] text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Thêm vào giỏ hàng
                        </button>
                        <Link to={`/checkout`}><button className="bg-white text-blue-500 border border-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-[#06AEF4] hover:text-white transition duration-300">
                            Mua Ngay
                        </button></Link>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
                    <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>

                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-[60%]">
                    <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
                    {/* Khung nhập bình luận */}
                    <div className="border border-blue-300 rounded-lg p-4 mb-6">
                        <input
                            type="text"
                            placeholder="Bình luận"
                            className="w-full border-none outline-none bg-transparent text-[16px]"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            disabled={postingComment}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2"
                                onClick={handlePostComment}
                                disabled={postingComment}
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                    {/* Danh sách bình luận */}
                    <div className="space-y-6">
                        {loadingComments ? (
                            <div>Đang tải bình luận...</div>
                        ) : displayedComments.length === 0 ? (
                            <div>Chưa có bình luận nào.</div>
                        ) : (
                            displayedComments.map((cmt, idx) => (
                                <div key={cmt._id || idx} className="border border-blue-300 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={cmt.user_id?.avatar || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full border" />
                                        <div>
                                            <div className="font-semibold">{cmt.user_id?.full_name || cmt.user_id?.username || 'Ẩn danh'}</div>
                                        </div>
                                        <div className="ml-auto text-xs text-gray-500">
  {cmt.create_at ? new Date(cmt.create_at).toLocaleString('vi-VN') : ''}
</div>
                                    </div>
                                    <div className="bg-[#f6f6f6] rounded-lg p-3 ml-12 mb-2">
                                        {cmt.comment}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {comments.length > COMMENTS_TO_SHOW && (
  <div className="mt-6 flex justify-center">
    <button
      className="text-blue-500 text-lg font-semibold hover:underline"
      onClick={() => setShowAllComments(!showAllComments)}
    >
      {showAllComments ? 'Thu gọn' : 'Xem thêm'}
    </button>
  </div>
)}
                </div>
            </div>
        </main>
    );
};
export default ProductDetail;
