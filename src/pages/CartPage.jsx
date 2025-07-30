import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../service/Cart.service';
import { dataProduct } from '../service/Product.service';
import { updateCartItem, removeCartItem } from '../service/Cart.service';
import { CartContext } from '../context/CartContext';
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  Tag, 
  CreditCard,
  ArrowRight
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, setInitialCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const debounceTimers = useRef({});

  // Chỉ fetchCart 1 lần khi load trang
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
    // eslint-disable-next-line
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

  // Hàm xử lý áp dụng mã giảm giá
  const handleApplyVoucher = () => {
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

  // Chỉ cập nhật state cartItems trực tiếp sau khi thao tác thành công
  const updateCartItemQty = async (itemId, newQty) => {
    try {
      await updateCartItem(itemId, newQty);
      window.dispatchEvent(new Event('cart-updated'));
      setInitialCartItems(prev => prev.map(item => item._id === itemId ? { ...item, qty: newQty } : item));
    } catch (err) {
      // Nếu lỗi, có thể fetch lại cart để đồng bộ
      try {
        const res = await getCart();
        setInitialCartItems(res.data.data.items);
      } catch {}
      console.error('Lỗi cập nhật số lượng:', err);
    }
  };

  const changeQuantity = (productId, qty, itemId) => {
    if (qty <= 0) return;
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }
    debounceTimers.current[productId] = setTimeout(() => {
      updateCartItemQty(productId, qty);
      delete debounceTimers.current[productId];
    }, 400);
    setInitialCartItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, qty } : item
      )
    );
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      window.dispatchEvent(new Event('cart-updated'));
      setInitialCartItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      // Nếu lỗi, có thể fetch lại cart để đồng bộ
      try {
        const res = await getCart();
        setInitialCartItems(res.data.data.items);
      } catch {}
      console.error("Error removing item:", err);
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingFee = 15000;
  const total = Math.max(subtotal + shippingFee - voucherDiscount, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link 
              to="/product"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          </div>
          <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
            {cartItems.length} sản phẩm
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-w-0 flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Sản phẩm đã chọn</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => {
                  const product = item.product_id;
                  if (!product) return null;
                  return (
                    <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <Link to={`/product/${product._id}`}>
                            <img
                              src={product.images?.[0] || '/images/image_product.png'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors">
                              {product.name}
                            </Link>
                          </h3>
                          <div className="text-red-600 font-bold text-lg">
                            {product.price?.toLocaleString()}đ
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => changeQuantity(product._id, item.qty - 1, item._id)}
                            disabled={item.qty <= 1}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.qty}</span>
                          <button
                            onClick={() => changeQuantity(product._id, item.qty + 1, item._id)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="font-bold text-lg text-gray-900">
                            {(product.price * item.qty).toLocaleString()}đ
                          </div>
                          <button
                            onClick={() => removeItem(product._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 min-w-[320px] max-w-sm w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4 w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Tổng đơn hàng</h2>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Mã giảm giá</span>
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mã giảm giá"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    onClick={handleApplyVoucher}
                  >
                    Áp dụng
                  </button>
                </div>
                {voucherMessage && (
                  <div className={`text-sm mt-2 ${voucherDiscount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {voucherMessage}
                  </div>
                )}
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium text-gray-900">
                    {subtotal.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium text-gray-900">{shippingFee.toLocaleString()}đ</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-green-600">-{voucherDiscount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-600">
                    {total.toLocaleString()}đ
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tiến hành thanh toán
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/product">
                <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors">
                  Tiếp tục mua sắm
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
