import React from 'react';
import { formatCurrency } from '../Product';
import ProductPackageSelector from '../ProductPackageSelector';

const ProductInfo = ({ 
    productData, 
    isFavorite, 
    loadingFavorite, 
    onToggleFavorite,
    // Package selector (disabled for now)
    selectedPackage,
    onPackageSelect,
    // Variant selector
    variants = [],
    selectedVariant = null,
    onSelectVariant = () => {},
    // Actions
    onAddToCart,
    onBuyNow,
    loadingAddToCart,
    quantity
}) => {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 flex-1">{productData.name}</h1>

                    {/* Favorite Button - Next to Product Name */}
                    <button
                        onClick={onToggleFavorite}
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

            <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    (productData.in_stock || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {(productData.in_stock || 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
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

            {/* Variant Selector - đặt tại vị trí Package Selector cũ */}
            {Array.isArray(variants) && variants.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Chọn biến thể</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {variants.map((v) => {
                            const isActive = selectedVariant?._id === v._id;
                            const img = (v.images && v.images[0]) || productData.images?.[0] || '/placeholder-product.png';
                            const hasDiscount = v.original_price > v.price;
                            return (
                                <button
                                    key={v._id}
                                    type="button"
                                    onClick={() => onSelectVariant(v)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                                        isActive
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <img src={img} alt={v.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 truncate">{v.name}</span>
                                            {v.is_default && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">Mặc định</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600 mt-0.5">
                                            {v.unit}{v.quantity_per_unit ? ` • SL/ĐVT: ${v.quantity_per_unit}` : ''}
                                        </div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-red-500 font-semibold">{formatCurrency(v.price)}</span>
                                            {hasDiscount && (
                                                <span className="text-gray-400 line-through text-sm">{formatCurrency(v.original_price)}</span>
                                            )}
                                        </div>
                                        <div className={`text-xs mt-1 ${v.in_stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {v.in_stock > 0 ? `Còn hàng: ${v.in_stock}` : 'Hết hàng'}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-3">
                {/* Hàng 2: Thêm vào giỏ hàng (icon) và Mua ngay */}
                <div className="flex gap-3">
                    <button
                        onClick={onAddToCart}
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
                        onClick={onBuyNow}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                    >
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;