import React, { useState, useEffect } from 'react';
import { useProductData } from '../controller/Product.controller';

const ProductDetail = () => {
    // Giả sử chúng ta có một ID sản phẩm từ URL hoặc props
    const productId = 'some-product-id'; // Placeholder: cần lấy ID thực tế

    // Sử dụng hook để lấy dữ liệu sản phẩm (cần điều chỉnh hook nếu nó chỉ lấy danh sách)
    // Giả định useProductData(productId) trả về chi tiết 1 sản phẩm
    const product = useProductData(productId); 
    
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('https://via.placeholder.com/400x400'); // Placeholder

    // Cập nhật ảnh chính khi dữ liệu sản phẩm có sẵn
    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]); // Sử dụng ảnh đầu tiên làm ảnh chính
        }
    }, [product]);

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    if (!product) {
        return <div>Đang tải sản phẩm...</div>; // Hoặc hiển thị thông báo lỗi
    }

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="flex flex-wrap lg:flex-nowrap gap-8">
                {/* Left Section: Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col items-center">
                    <img src={mainImage} alt={product.name} className="w-full max-w-md rounded-lg shadow-lg" />
                    <div className="flex gap-4 mt-4">
                        {product.images && product.images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                alt={`${product.name} image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-blue-500"
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Section: Product Info */}
                <div className="w-full lg:w-1/2">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                    {/* Price */}
                    <div className="mb-4">
                        {/* Cần điều chỉnh hiển thị giá dựa trên cấu trúc dữ liệu của product */}
                        <span className="text-2xl font-semibold text-red-600 mr-2">{product.price}₫</span>
                        {product.originalPrice && (
                             <span className="text-gray-500 line-through">{product.originalPrice} vnd</span>
                        )}
                    </div>
                    
                    {/* Rating (Placeholder) */}
                    <div className="flex items-center mb-4">
                        {/* Cần render sao dựa trên product.rating */}
                         {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                        ))}
                         {[...Array(5 - Math.floor(product.rating || 0))].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.542 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.787.565-1.842-.197-1.542-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="ml-2 text-gray-600 text-sm">{product.rating || 0} ({product.reviewCount || 0} đánh giá)</span> {/* Placeholder */}
                    </div>

                    {/* Quantity Selector */}
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

                    {/* Buttons */}
                    <div className="flex gap-4">
                         <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                            Thêm vào giỏ hàng
                        </button>
                         <button className="bg-white text-blue-500 border border-blue-500 px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition duration-300">
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>
             {/* Placeholder cho các phần còn lại */}
             <div className="mt-10">
                 {/* Phần mô tả sản phẩm */}
                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                     <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
                     {/* Nội dung mô tả */}
                     <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
                     {/* Nút Xem tất cả */}
                 </div>

                 {/* Sản phẩm liên quan */}
                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                     <h2 className="text-2xl font-bold mb-4">Sản phẩm liên quan</h2>
                     {/* Danh sách sản phẩm liên quan */}
                 </div>

                 {/* Bình luận */}
                 <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                      <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
                     {/* Form bình luận và danh sách bình luận */}
                 </div>

                 {/* Các sản phẩm khác (nếu cần) */}
             </div>
        </main>
    );
};

export default ProductDetail;
