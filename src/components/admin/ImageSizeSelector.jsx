import React from 'react';

const ImageSizeSelector = ({ onSizeSelect, currentSize = 'medium' }) => {
  const sizes = [
    { key: 'small', label: 'Nhỏ', width: 300, height: 200 },
    { key: 'medium', label: 'Vừa', width: 600, height: 400 },
    { key: 'large', label: 'Lớn', width: 900, height: 600 },
    { key: 'full', label: 'Đầy đủ', width: '100%', height: 'auto' }
  ];

  return (
    <div className="image-size-selector">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Kích thước ảnh:
      </label>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size.key}
            onClick={() => onSizeSelect(size)}
            className={`px-3 py-1 text-xs rounded border transition-colors ${
              currentSize === size.key
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSizeSelector; 