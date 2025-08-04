import React from 'react';

const ImageSizeSelector = ({ onSizeSelect, currentSize = 'medium' }) => {
  const sizes = [
    { 
      key: 'small', 
      label: 'Nhỏ', 
      width: 300, 
      height: 200,
      description: 'Phù hợp cho ảnh nhỏ, icon'
    },
    { 
      key: 'medium', 
      label: 'Vừa', 
      width: 600, 
      height: 400,
      description: 'Kích thước mặc định'
    },
    { 
      key: 'large', 
      label: 'Lớn', 
      width: 900, 
      height: 600,
      description: 'Ảnh lớn, chi tiết'
    },
    { 
      key: 'full', 
      label: 'Đầy đủ', 
      width: '100%', 
      height: 'auto',
      description: 'Toàn bộ chiều rộng'
    }
  ];

  return (
    <div className="image-size-selector">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Chọn kích thước ảnh:
      </label>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map((size) => (
          <button
            key={size.key}
            onClick={() => onSizeSelect(size)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              currentSize === size.key
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="text-center">
              <div className={`font-semibold text-sm mb-1 ${
                currentSize === size.key ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {size.label}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {size.width} × {size.height}
              </div>
              <div className="text-xs text-gray-400">
                {size.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          💡 <strong>Lưu ý:</strong> Kích thước ảnh sẽ được áp dụng cho tất cả ảnh trong bài viết. 
          Để thay đổi kích thước cho từng ảnh riêng biệt, hãy click vào ảnh đó trước khi chọn kích thước.
        </p>
      </div>
    </div>
  );
};

export default ImageSizeSelector; 