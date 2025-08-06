import React, { useState } from 'react';

const ProductImages = ({ productData }) => {
    const [mainImage, setMainImage] = useState(null);

    return (
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
    );
};

export default ProductImages;