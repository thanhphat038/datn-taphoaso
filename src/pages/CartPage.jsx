import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../service/Cart.service';
import { dataProduct } from '../service/Product.service';
import { updateCartItem, removeCartItem } from '../service/Cart.service';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, setInitialCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  // State cho mã giảm giá, thông báo và giá trị giảm giá
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Ref để lưu debounce timer cho từng item
  const debounceTimers = useRef({});
  // Ref để lưu fetchCart
  const fetchCartRef = useRef();

  // Định nghĩa fetchCart bằng useCallback
  // Định nghĩa fetchCart bằng useCallback
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        setInitialCartItems(res.data.data.items);
      } catch (err) {
        setInitialCartItems([]);
      }
    };
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await dataProduct();
        setProducts(Array.isArray(res.data) ? res.data : (res.data.data || res.data.products || []));
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // // Hàm xử lý áp dụng mã giảm giá
  // const handleApplyVoucher = () => {
  //   // Ví dụ: mã 'GIAM10' giảm 10%, 'GIAM50K' giảm 50k
  //   if (voucherCode.trim().toUpperCase() === 'GIAM10') {
  //     setVoucherDiscount(
  //       Math.floor(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 0.1)
  //     );
  //     setVoucherMessage('Áp dụng mã giảm giá 10% thành công!');
  //   } else if (voucherCode.trim().toUpperCase() === 'GIAM50K') {
  //     setVoucherDiscount(50000);
  //     setVoucherMessage('Áp dụng mã giảm giá 50.000đ thành công!');
  //   } else {
  //     setVoucherDiscount(0);
  //     setVoucherMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
  //   }
  // };

  // Sửa updateCartItemQty để dùng fetchCartRef
  const updateCartItemQty = async (itemId, newQty) => {
    try {
      await updateCartItem(itemId, newQty);
      window.dispatchEvent(new Event('cart-updated')); // Phát sự kiện cho Header
      // Dùng ref để gọi fetchCart
      if (fetchCartRef.current) await fetchCartRef.current();
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
    }
  };

  const changeQuantity = (productId, qty, itemId) => {
    if (qty <= 0) return;
    // Nếu đã có timer cho item này thì clear
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }
    // Set timer mới
    debounceTimers.current[productId] = setTimeout(() => {
      updateCartItemQty(productId, qty);
      // Xóa timer sau khi gọi xong
      delete debounceTimers.current[productId];
    }, 400);
    // Cập nhật UI ngay (nếu muốn UX mượt hơn)
    setInitialCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, qty } : item
      )
    );
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId); // Gọi API xóa
      window.dispatchEvent(new Event('cart-updated')); // Phát sự kiện cho Header
      await fetchCartRef.current();
    } catch (err) {
      console.error("Error removing item:", err);
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
        {cartItems.map((item) => {
          const product = item.product_id;
          if (!product) return null;

          return (
            <div key={item._id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800 mb-1 cursor-pointer">
                    <Link to={`/product/${product._id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <div className="text-red-500 font-medium">
                    {product.price?.toLocaleString()}đ
                  </div>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeQuantity(product._id, item.qty - 1, item._id)}
                    className="cursor-pointer w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-[#06AEF4] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button
                    onClick={() => changeQuantity(product._id, item.qty + 1, item._id)}
                    className="cursor-pointer w-8 h-8 rounded-full bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-[#06AEF4] transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="flex flex-col items-end justify-between">
                  <div className="font-semibold text-gray-800">
                    {(product.price * item.qty).toLocaleString()}đ
                  </div>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phần nhập mã giảm giá */}
      {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="mb-2 font-medium text-gray-700">Mã giảm giá</div>
        <div className="flex">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#06AEF4]"
            placeholder="Nhập mã giảm giá (chỉ áp dụng 1 lần)"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 rounded-lg text-white font-semibold transition-colors bg-[#06AEF4] hover:bg-[#70d9ff]"
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
      </div> */}

      {/* Cart Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium text-gray-800">
            {cartItems.reduce((total, item) => total + item.price * item.qty, 0).toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Phí vận chuyển:</span>
<span className="font-medium text-gray-800">0đ</span>
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
                  cartItems.reduce((total, item) => total + item.price * item.qty, 0) - voucherDiscount,
                  0
                ).toLocaleString()
              )}đ
            </span>
          </div>
          <Link to={`/checkout`}><button className="w-full bg-[#06AEF4] cursor-pointer hover:bg-[#06AEF4]/80 text-white font-medium py-3 rounded-lg transition-colors">
            Tiến hành thanh toán
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
