import React from 'react';
const ProductFavorite = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm yêu thích</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Example favorite product cards */}
        <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img src="/images/image_product.png" alt="Sản phẩm 1" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 truncate">Sản phẩm yêu thích 1</h3>
          <p className="text-red-500 font-semibold mb-3">100,000đ</p>
          <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img src="/images/image_product.png" alt="Sản phẩm 2" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 truncate">Sản phẩm yêu thích 2</h3>
          <p className="text-red-500 font-semibold mb-3">150,000đ</p>
          <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img src="/images/image_product.png" alt="Sản phẩm 3" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 truncate">Sản phẩm yêu thích 3</h3>
          <p className="text-red-500 font-semibold mb-3">200,000đ</p>
          <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img src="/images/image_product.png" alt="Sản phẩm 4" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 truncate">Sản phẩm yêu thích 4</h3>
          <p className="text-red-500 font-semibold mb-3">250,000đ</p>
          <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex flex-col">
          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
            <img src="/images/image_product.png" alt="Sản phẩm 5" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-gray-800 mb-1 truncate">Sản phẩm yêu thích 5</h3>
          <p className="text-red-500 font-semibold mb-3">300,000đ</p>
          <button className="mt-auto px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Xóa</button>
        </div>
      </div>
    </div>
  );
};
export default ProductFavorite; 