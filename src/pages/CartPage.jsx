import React from 'react';

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Sữa tươi Vinamilk 100% Organic',
      image: '/images/about-2.png',
      price: 35000,
      quantity: 2
    },
    {
      id: 2,
      name: 'Bánh mì sandwich',
      image: '/images/about-3.png',
      price: 15000,
      quantity: 1
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Giỏ hàng của bạn</h1>
        <span className="text-gray-500">{cartItems.length} sản phẩm</span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all"
          >
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">
                  {item.name}
                </h3>
                <div className="text-red-500 font-medium">
                  {item.price.toLocaleString()}đ
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
                  +
                </button>
              </div>

              {/* Total & Remove */}
              <div className="flex flex-col items-end justify-between">
                <div className="font-semibold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium text-gray-800">85.000đ</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium text-gray-800">15.000đ</span>
        </div>
        <div className="border-t border-dashed pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-800 font-medium">Tổng cộng:</span>
            <span className="text-xl font-bold text-red-500">100.000đ</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full transition-colors">
            Tiến hành thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
