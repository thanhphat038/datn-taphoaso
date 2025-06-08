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

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
                </div>

            </div>
        </main>
    );
};
export default ProductDetail;
