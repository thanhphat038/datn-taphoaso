import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="mb-3">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center mb-3">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="ml-2 w-8 h-3 bg-gray-200 rounded"></div>
        </div>

        {/* Price skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton; 