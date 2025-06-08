import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDetailPage = () => {
  const navigate = useNavigate();
  
  // Sample order data - in real app this would come from API/props
  const order = {
    id: '#123',
    date: 'Mua lúc 06/06, 2024',
    status: 'Giao hàng thành công',
    address: '29-31 Vườn Lài, Phường An Phú Đông, Quận 12, Thành phố Hồ Chí Minh, Việt Nam',
    products: [
      {
        id: 1,
        name: 'Rau củ quả tươi',
        image: '/images/about-12.jpg',
        quantity: 2,
        price: 100000
      },
      {
        id: 2,
        name: 'Sữa tươi',
        image: '/images/about-11.jpg',
        quantity: 1,
        price: 50000
      }
    ],
    total: 250000,
    originalTotal: 250000,
    paymentMethod: 'Thanh toán khi nhận hàng',
    deliveryMethod: 'Giao hàng nhanh',
    timeline: [
      {
        status: 'Đã đặt hàng',
        date: '06/06/2024 16:30',
        description: 'Đơn hàng đã được đặt thành công'
      },
      {
        status: 'Đã xác nhận',
        date: '06/06/2024 18:45',
        description: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'Đang vận chuyển',
        date: '07/06/2024 14:20',
        description: 'Đơn hàng đang được vận chuyển'
      },
      {
        status: 'Đang giao hàng',
        date: '08/06/2024 09:15',
        description: 'Đơn hàng đang được giao đến địa chỉ người nhận'
      },
      {
        status: 'Đã giao hàng',
        date: '08/06/2024 15:30',
        description: 'Đơn hàng đã được giao thành công'
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Chi tiết đơn hàng {order.id}</h1>
          <p className="text-gray-600">{order.date}</p>
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại
        </button>
      </div>

      {/* Order Status Timeline */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
        <div className="relative px-8">
          <div className="grid grid-cols-5 gap-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white ring-2 ring-blue-500 flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 text-sm mb-1">{event.status}</div>
                  <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                  <div className="text-xs text-gray-600 leading-tight">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Connecting Line */}
          <div className="absolute top-5 left-16 right-16 h-0.5 bg-blue-200" style={{ zIndex: 0 }}></div>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Products */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.products.map((product) => (
                <div key={product.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      x{product.quantity}
                    </div>
                    <div className="mt-1 font-medium text-red-500">
                      {product.price.toLocaleString()}đ
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <div className="font-semibold text-gray-900">
                      {(product.price * product.quantity).toLocaleString()}đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</div>
                <div className="text-gray-900">{order.address}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Phương thức giao hàng</div>
                <div className="text-gray-900">{order.deliveryMethod}</div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Thông tin thanh toán</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
                <div className="text-gray-900">{order.paymentMethod}</div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{order.total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">0đ</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Tổng tiền</span>
                  <span className="font-semibold text-xl text-red-500">
                    {order.total.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 bg-[#06AEF4] text-white py-3 rounded-full hover:bg-blue-700 transition-colors font-medium">
              Mua lại
            </button>
            <button className="flex-1 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
