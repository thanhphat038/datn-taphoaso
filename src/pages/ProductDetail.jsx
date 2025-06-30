import React, { useState, useEffect, useContext } from 'react';
import { useProductDetailData } from '../controller/Product.controller';
import { useParams } from 'react-router-dom';
import { formatCurrency } from '../components/Product';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductDetail = () => {

    const [mainImage, setMainImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    const { addProduct } = useContext(CartContext);

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => {
            const newQuantity = prev + delta;
            if (newQuantity < 1) return 1;
            if (product.stock && newQuantity > product.stock) return product.stock;
            return newQuantity;
        });
    };

    const { id } = useParams();
    const pd = useProductDetailData(id) || [];
    const product = pd[0] || {};

    const handleAddToCart = () => {
        if (product) {
            addProduct({ 
                id: product.id,
                name: product.name,
                image: product.images && product.images.length > 0 ? product.images[0] : '',
                price: product.price,
                quantity: quantity
            });
        }
    };

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
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                    <div className="mb-4">
                        <span className="text-2xl font-semibold text-red-600 mr-2">{formatCurrency(product.price * quantity)}</span>
                        {product.price && (
                            <span className="text-gray-500 line-through">{formatCurrency(product.price * quantity)}</span>
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
                        />
                        <div className="flex justify-end mt-2">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                                Gửi
                            </button>
                        </div>
                    </div>
                    {/* Danh sách bình luận (dữ liệu tĩnh) */}
                    <div className="space-y-6">
                        {[1,2,3].map((item, idx) => (
                            <div key={idx} className="border border-blue-300 rounded-lg p-4">
                                {/* Thông tin người dùng và đánh giá */}
                                <div className="flex items-center gap-3 mb-2">
                                    <img src="https://i.imgur.com/0y0y0y0.png" alt="avatar" className="w-10 h-10 rounded-full border" />
                                    <div>
                                        <div className="font-semibold">Admin</div>
                                        {/* Hiển thị 5 sao vàng */}
                                        {/* <div className="flex items-center gap-1">
                                            
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" /></svg>
                                            ))}
                                        </div> */}
                                    </div>
                                    <div className="ml-auto text-xs text-gray-500">00:00, 20/5</div>
                                </div>
                                {/* Nội dung bình luận */}
                                <div className="bg-[#f6f6f6] rounded-lg p-3 ml-12 mb-2">
                                    Xà lách tươi, giòn và sạch, rất thích hợp cho các món salad và ăn kèm. Hương vị nhẹ, dễ ăn, cảm giác thanh mát. Rau được bảo quản tốt, không héo úa. Rất hài lòng về chất lượng, sẽ tiếp tục ủng hộ.
                                </div>
                                {/* Hành động */}
                                <div className="flex items-center gap-6 ml-12">
                                    <button className="flex items-center gap-1 text-blue-500 hover:underline text-[15px]">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg>
                                        Trả lời
                                    </button>
                                    <button className="flex items-center gap-1 text-blue-500 hover:underline text-[15px]">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                        0
                                    </button>
                                </div>
                                {/* Bình luận trả lời (nếu có) */}
                                <div className="mt-4 ml-12">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src="https://i.imgur.com/0y0y0y0.png" alt="avatar" className="w-8 h-8 rounded-full border" />
                                        <div>
                                            <div className="font-semibold text-sm">Admin</div>
                                            {/* <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" /></svg>
                                            ))}
                                            </div> */}
                                        </div>
                                        <div className="ml-auto text-xs text-gray-500">00:00, 20/5</div>
                                    </div>
                                    <div className="bg-[#f6f6f6] rounded-lg p-3 ml-10">
                                        Xà lách tươi, giòn và sạch, rất thích hợp cho các món salad và ăn kèm. Hương vị nhẹ, dễ ăn, cảm giác thanh mát. Rau được bảo quản tốt, không héo úa. Rất hài lòng về chất lượng, sẽ tiếp tục ủng hộ.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Nút xem tất cả */}
                    <div className="mt-6 flex justify-center">
                        <button className="text-blue-500 text-lg font-semibold hover:underline">Xem tất cả</button>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ProductDetail;
