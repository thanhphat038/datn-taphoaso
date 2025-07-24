import React, { useState } from 'react';

const Order = () => {
  const [orders] = useState([
    {
      id: '#123',
      date: 'Mua lúc 06/06, 2024',
      address: '29-31 Vườn Lài, Phường An Phú Đông, Quận 12, Thành phố Hồ Chí Minh, Việt Nam',
      status: 'Giao hàng thành công',
      products: [
        { id: 1, name: 'Rau củ quả tươi', image: '/images/about-12.jpg', quantity: 2, price: 100000 },
        { id: 2, name: 'Sữa tươi', image: '/images/about-11.jpg', quantity: 1, price: 50000 }
      ],
      total: 100000,
      originalTotal: 100000
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleOpenPopup = (product) => {
    setSelectedProduct(product);
    setRating(0);
    setComment('');
    setShowPopup(true);
  };

  const handleSubmitReview = () => {
    console.log('Đánh giá:', {
      product: selectedProduct,
      rating,
      comment
    });
    setShowPopup(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="space-y-6">
        {currentOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-medium text-lg">Đơn hàng {order.id}</span>
                  <span className="text-gray-600">{order.date}</span>
                  <span className="text-blue-500 text-sm cursor-pointer hover:underline">Xem chi tiết</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{order.address}</p>
                <p className="text-green-600 font-medium">{order.status}</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {order.products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h4>
                    <p className="text-red-500 font-medium">{product.price.toLocaleString()}đ</p>
                    <button
                      className="mt-2 px-4 py-1.5 text-sm rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => handleOpenPopup(product)}
                    >
                      Đánh giá
                    </button>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="w-8 text-center font-medium">{product.quantity}</span>
                  </div>
                  <div className="text-right flex-shrink-0 w-24">
                    <div className="font-semibold text-gray-800">{(product.price * product.quantity).toLocaleString()}đ</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tổng tiền</p>
                  <p className="font-semibold text-gray-800">{order.total.toLocaleString()}đ</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Đã thanh toán</p>
                  <p className="font-semibold text-green-600">{order.originalTotal.toLocaleString()}đ</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-1">Tiền cần đổi trả</p>
                  <p className="font-semibold text-red-600">0đ</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors">Liên hệ hỗ trợ</button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup đánh giá */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/5 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowPopup(false)}
            >
              &times;
            </button>
            <div className="flex items-center gap-6 mb-6">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 rounded-xl object-cover" />
              <div>
                <h3 className="font-semibold text-2xl text-gray-800">{selectedProduct.name}</h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-base text-gray-600 mb-2">Chọn số sao:</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-base text-gray-600 mb-2">Nội dung đánh giá:</p>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-3 text-base"
                placeholder="Nhập nội dung đánh giá..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmitReview}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-base font-semibold"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Order;
