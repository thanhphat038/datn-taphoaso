import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productsData from '../data/db.json';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, setInitialCartItems, incrementQuantity, decrementQuantity, removeItem } = useContext(CartContext);

  // useEffect(() => {
  //   if (cartItems.length === 0) {
  //     // Initialize cart items from products data with quantity 1
  //     const items = productsData.products.map(product => ({
  //       id: product.id,
  //       name: product.name,
  //       image: product.images && product.images.length > 0 ? product.images[0] : '',
  //       price: product.price,
  //       quantity: 1
  //     }));
  //     setInitialCartItems(items);
  //   }
  // }, [cartItems, setInitialCartItems]);

  // State cho mã giảm giá, thông báo và giá trị giảm giá
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Hàm xử lý áp dụng mã giảm giá
  const handleApplyVoucher = () => {
    // Ví dụ: mã 'GIAM10' giảm 10%, 'GIAM50K' giảm 50k
    if (voucherCode.trim().toUpperCase() === 'GIAM10') {
      setVoucherDiscount(
        Math.floor(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 0.1)
      );
      setVoucherMessage('Áp dụng mã giảm giá 10% thành công!');
    } else if (voucherCode.trim().toUpperCase() === 'GIAM50K') {
      setVoucherDiscount(50000);
      setVoucherMessage('Áp dụng mã giảm giá 50.000đ thành công!');
    } else {
      setVoucherDiscount(0);
      setVoucherMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

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
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                </Link>
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 mb-1 hover:text-blue-600 cursor-pointer">
                  <Link to={`/product/${item.id}`}>
                    {item.name}
                  </Link>
                </h3>
                <div className="text-red-500 font-medium">
                  {item.price.toLocaleString()}đ
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decrementQuantity(item.id)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => incrementQuantity(item.id)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Total & Remove */}
              <div className="flex flex-col items-end justify-between">
                <div className="font-semibold text-gray-800">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phần nhập mã giảm giá */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="mb-2 font-medium text-gray-700">Mã giảm giá</div>
        <div className="flex">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400"
            placeholder="Nhập mã giảm giá (chỉ áp dụng 1 lần)"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleApplyVoucher}
          >
            Áp dụng
          </button>
        </div>
        {voucherMessage && (
          <div
            className={`text-sm mt-2 ${voucherDiscount > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {voucherMessage}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium text-gray-800">
            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium text-gray-800">15.000đ</span>
        </div>
        {/* Hiển thị giảm giá nếu có */}
        {voucherDiscount > 0 && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Giảm giá:</span>
            <span className="font-medium text-green-600">- {voucherDiscount.toLocaleString()}đ</span>
          </div>
        )}
        <div className="border-t border-dashed pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-800 font-medium">Tổng cộng:</span>
            <span className="text-xl font-bold text-red-500">
              {/* Tính tổng cộng sau khi trừ giảm giá */}
              {(
                Math.max(
                  cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + 15000 - voucherDiscount,
                  0
                ).toLocaleString()
              )}đ
            </span>
          </div>
          <Link to={`/checkout`}><button className="w-full bg-[#c4c4c47d] hover:bg-[#06AEF4] text-white font-medium py-3 rounded-lg transition-colors">
            Tiến hành thanh toán
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
