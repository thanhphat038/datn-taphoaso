import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../service/Cart.service';
import { dataProduct } from '../service/Product.service';
import { updateCartItem, removeCartItem } from '../service/Cart.service';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaTrash, FaGift, FaTruck, FaCreditCard, FaChevronDown } from 'react-icons/fa';
import { getAllVouchers } from '../service/Admin.Service';

const CartPage = () => {
  const { cartItems, setInitialCartItems } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  // State cho mã giảm giá, thông báo và giá trị giảm giá
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // State cho dropdown voucher
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

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
  }, []); // Bỏ dependency setInitialCartItems

  // Gán fetchCart vào ref
  useEffect(() => {
    fetchCartRef.current = fetchCart;
  }, [fetchCart]);

  // Gọi fetchCart lần đầu - chỉ gọi 1 lần khi mount
  useEffect(() => {
    fetchCart();
  }, []); // Bỏ dependency fetchCart

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

  // Fetch available vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoadingVouchers(true);
        const response = await getAllVouchers();
        const allVouchers = response.data.data || [];
        
        // Lọc chỉ những voucher có status active
        const activeVouchers = allVouchers.filter(voucher => voucher.status === 'active');
        setAvailableVouchers(activeVouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setAvailableVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    };
    fetchVouchers();
  }, []);

  // Hàm xử lý áp dụng mã giảm giá
  const handleApplyVoucher = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    
    // Ví dụ: mã 'GIAM10' giảm 10%, 'GIAM50K' giảm 50k, 'GIAM20K' giảm 20k
    const voucher = voucherCode.trim().toUpperCase();
    
    if (voucher === 'GIAM10') {
      const discount = Math.floor(subtotal * 0.1);
      setVoucherDiscount(discount);
      setVoucherMessage('Áp dụng mã giảm giá 10% thành công!');
      setIsVoucherApplied(true);
      setAppliedVoucher({ code: voucher, type: 'percentage', value: 10, discount });
    } else if (voucher === 'GIAM50K') {
      const discount = Math.min(50000, subtotal);
      setVoucherDiscount(discount);
      setVoucherMessage('Áp dụng mã giảm giá 50.000đ thành công!');
      setIsVoucherApplied(true);
      setAppliedVoucher({ code: voucher, type: 'fixed', value: 50000, discount });
    } else if (voucher === 'GIAM20K') {
      const discount = Math.min(20000, subtotal);
      setVoucherDiscount(discount);
      setVoucherMessage('Áp dụng mã giảm giá 20.000đ thành công!');
      setIsVoucherApplied(true);
      setAppliedVoucher({ code: voucher, type: 'fixed', value: 20000, discount });
    } else {
      setVoucherDiscount(0);
      setVoucherMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      setIsVoucherApplied(false);
      setAppliedVoucher(null);
    }
  };

  // Hàm xóa voucher
  const handleRemoveVoucher = () => {
    setVoucherDiscount(0);
    setVoucherMessage('');
    setIsVoucherApplied(false);
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  // Hàm chọn voucher từ dropdown
  const handleSelectVoucher = (voucher) => {
    setVoucherCode(voucher.code);
    setShowVoucherDropdown(false);
  };

  // Sửa updateCartItemQty để dùng fetchCartRef
  const updateCartItemQty = async (itemId, newQty) => {
    try {
      await updateCartItem(itemId, newQty);
      window.dispatchEvent(new Event('cart-updated')); // Phát sự kiện cho Header
      // Không cần gọi lại fetchCart vì UI đã được cập nhật trong changeQuantity
      // Header sẽ tự động cập nhật thông qua event cart-updated
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err);
      // Nếu lỗi thì refresh lại để khôi phục trạng thái
      if (fetchCartRef.current) await fetchCartRef.current();
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
      // Cập nhật UI ngay lập tức để UX mượt hơn
      setInitialCartItems(prev => prev.filter(item => item._id !== itemId));
      
      await removeCartItem(itemId); // Gọi API xóa
      window.dispatchEvent(new Event('cart-updated')); // Phát sự kiện cho Header
      
      // Không cần gọi lại fetchCart vì đã cập nhật UI rồi
      // Header sẽ tự động cập nhật thông qua event cart-updated
    } catch (err) {
      console.error("Error removing item:", err);
      // Nếu lỗi thì refresh lại để khôi phục trạng thái
      await fetchCartRef.current();
    }
  };

  // Tính tổng tiền
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee - voucherDiscount;

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
            {/* Empty Cart Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            
            {/* Empty Cart Message */}
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              Chưa có sản phẩm nào trong giỏ hàng
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
            </p>
            
            {/* Shop Now Button */}
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

              {/* Mã giảm giá */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FaGift className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Mã giảm giá</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nhập mã giảm giá..."
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyVoucher()}
                        onFocus={() => setShowVoucherDropdown(true)}
                      />
                      <button
                        onClick={() => setShowVoucherDropdown(!showVoucherDropdown)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaChevronDown className={`w-4 h-4 transition-transform ${showVoucherDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Vouchers */}
                      {showVoucherDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                          {loadingVouchers ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                              <p className="mt-2 text-sm">Đang tải voucher...</p>
                            </div>
                          ) : availableVouchers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <p className="text-sm">Không có voucher nào khả dụng</p>
                            </div>
                          ) : (
                            <div className="py-2">
                              {availableVouchers.map((voucher) => (
                                <button
                                  key={voucher._id}
                                  onClick={() => handleSelectVoucher(voucher)}
                                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-800">{voucher.code}</div>
                                      <div className="text-sm text-gray-600">
                                        {voucher.discount_type === 'percentage' 
                                          ? `Giảm ${voucher.discount_value}%` 
                                          : `Giảm ${voucher.discount_value?.toLocaleString()}đ`
                                        }
                                      </div>
                                      {voucher.min_order_value && (
                                        <div className="text-xs text-gray-500">
                                          Đơn hàng tối thiểu: {voucher.min_order_value?.toLocaleString()}đ
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-green-600 font-medium">
                                      {voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Số tiền'}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleApplyVoucher}
                      disabled={!voucherCode.trim()}
                    >
                      Áp dụng
                    </button>
                  </div>
                  
                  {voucherMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
                      voucherDiscount > 0 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {voucherDiscount > 0 ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {voucherMessage}
                    </div>
                  )}
                  
                  {isVoucherApplied && appliedVoucher && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-800">Mã {appliedVoucher.code} đã áp dụng!</div>
                          <div className="text-sm text-green-600">
                            {appliedVoucher.type === 'percentage' 
                              ? `Giảm ${appliedVoucher.value}%` 
                              : `Giảm ${appliedVoucher.value?.toLocaleString()}đ`
                            }
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveVoucher}
                          className="text-green-600 hover:text-green-700 transition-colors"
                          title="Xóa mã giảm giá"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                  
                  {/* <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div> */}
                  
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
                
                <Link to="/checkout">
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
