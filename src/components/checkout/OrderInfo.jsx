import { Package } from 'lucide-react';

const OrderInfo = ({ orderInfo }) => {
  if (!orderInfo || !orderInfo.id) return null;

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'cancelled': return 'Đã hủy';
      case 'failed': return 'Thanh toán thất bại';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'paid': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'vnpay': return 'VNPAY';
      case 'cod': return 'Thanh toán khi nhận hàng';
      default: return method;
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-6 flex flex-col gap-3 mb-4 shadow-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
        <Package className="w-5 h-5 text-[#06AEF4]" />
        Thông tin đơn hàng
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mã đơn hàng:</span>
          <span className="font-medium break-all text-right">{orderInfo.id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền:</span>
          <span className="font-bold text-green-600">
            {orderInfo.total_amount ? orderInfo.total_amount.toLocaleString() : '0'}đ
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Trạng thái:</span>
          <span className={`font-medium ${getStatusColor(orderInfo.order_status)}`}>
            {getStatusText(orderInfo.order_status)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phương thức:</span>
          <span className="font-medium">
            {getPaymentMethodText(orderInfo.payment_method)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Thời gian tạo:</span>
          <span className="font-medium text-right">{orderInfo.created_at}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Hạn thanh toán:</span>
          <span className="font-medium text-red-600 text-right">
            {orderInfo.payment_deadline.toLocaleString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo; 