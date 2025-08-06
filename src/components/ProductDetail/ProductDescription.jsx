import React from 'react';

const ProductDescription = ({ productData }) => {
    return (
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
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {productData.description || 'Chưa có mô tả cho sản phẩm này.'}
                    </p>

                    {productData.category && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-medium">Danh mục:</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {productData.category.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;