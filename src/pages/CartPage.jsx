import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../service/Cart.service';
import { dataProduct } from '../service/Product.service';
import { updateCartItem, removeCartItem } from '../service/Cart.service';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaTrash, FaTruck, FaCreditCard } from 'react-icons/fa';
import { calculateSubtotal, calculateTotal } from '../utils/price';
import VoucherSection from '../components/VoucherSection';
import { useVoucher } from '../hooks/useVoucher';

const CartPage = () => {
  const { cartItems, setInitialCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  // Sử dụng custom hook cho voucher
  const subtotal = calculateSubtotal(cartItems);
  const {
    voucherCode,
    voucherMessage,
    voucherDiscount,
    voucher,
    showVoucherDropdown,
    availableVouchers,
    loadingVouchers,
    setVoucherCode,
    setVoucherMessage,
    setVoucherDiscount,
    setVoucher,
    setShowVoucherDropdown,
    handleApplyVoucher,
    handleSelectVoucher,
    handleRemoveVoucher,
  } = useVoucher(subtotal);

  // Ref để lưu debounce timer cho từng item
  const debounceTimers = useRef({});
  // Ref để lưu fetchCart
  const fetchCartRef = useRef();

  // Định nghĩa fetchCart bằng useCallback
  const fetchCart = useCallback(async () => {
    try {
      const res = await getCart();
      setInitialCartItems(res.data.data.items);
    } catch (err) {
      setInitialCartItems([]);
    }
  }, []);

  // Gán fetchCart vào ref
  useEffect(() => {
    fetchCartRef.current = fetchCart;
  }, [fetchCart]);

  // Gọi fetchCart lần đầu - chỉ gọi 1 lần khi mount
  useEffect(() => {
    fetchCart();
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

  // Sửa updateCartItemQty để dùng fetchCartRef
  const updateCartItemQty = async (itemId, newQty) => {
    try {
      await updateCartItem(itemId, newQty);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
      if (fetchCartRef.current) await fetchCartRef.current();
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
      setInitialCartItems(prev => prev.filter(item => item._id !== itemId));
      await removeCartItem(itemId);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error("Error removing item:", err);
      await fetchCartRef.current();
    }
  };

  // Tính tổng tiền sử dụng imported functions
  const shippingFee = 0;
  const total = calculateTotal(subtotal, shippingFee, voucherDiscount);

  return (
    <div className="min-h-screen bg-[#F5FBFB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-600">{cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Chưa có sản phẩm nào trong giỏ hàng
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
            </p>
            <Link 
              to="/product" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <FaShoppingCart className="w-5 h-5" />
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Sản phẩm trong giỏ hàng</h2>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const product = item.product_id;
                    if (!product) return null;

                    return (
                      <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
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
                            <Link to={`/product/${product._id}`} className="hover:text-blue-600 transition-colors">
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
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.qty}</span>
                          <button
                            onClick={() => changeQuantity(product._id, item.qty + 1, item._id)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
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
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Xóa sản phẩm"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VoucherSection component */}
              <VoucherSection
                voucherCode={voucherCode}
                voucherMessage={voucherMessage}
                voucherDiscount={voucherDiscount}
                voucher={voucher}
                showVoucherDropdown={showVoucherDropdown}
                availableVouchers={availableVouchers}
                loadingVouchers={loadingVouchers}
                onVoucherCodeChange={setVoucherCode}
                onApplyVoucher={handleApplyVoucher}
                onSelectVoucher={handleSelectVoucher}
                onRemoveVoucher={handleRemoveVoucher}
                onToggleDropdown={setShowVoucherDropdown}
              />
            </div>

            {/* Sidebar - Tổng tiền */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaTruck className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium text-gray-800">
                      {subtotal.toLocaleString()} đ
                    </span>
                  </div>
                  
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-medium text-green-600">- {voucherDiscount.toLocaleString()} đ</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Thành tiền:</span>
                    <span className="text-2xl font-bold text-red-500">
                      {total.toLocaleString()} đ
                    </span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout" 
                  state={{ 
                    appliedVoucher: voucher ? {
                      code: voucher.code,
                      discount_type: voucher.discount_type,
                      discount_value: voucher.discount_value,
                      max_discount: voucher.max_discount,
                      min_order_value: voucher.min_order_value
                    } : null,
                    voucherDiscount: voucherDiscount,
                    voucherCode: voucherCode
                  }}
                >
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" disabled={cartItems.length === 0}>
                    <FaCreditCard className="w-5 h-5" />
                    Tiến hành thanh toán
                  </button>
                </Link>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Bằng việc tiếp tục, bạn đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản sử dụng</span> và <span className="text-blue-600 cursor-pointer hover:underline">Chính sách bảo mật</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;