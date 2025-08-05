import { X } from 'lucide-react';

const PaymentActions = ({ 
  orderInfo, 
  onCancelOrder, 
  onRetryPayment, 
  onChangePaymentMethod 
}) => {
  const isFailed = orderInfo?.order_status === 'failed' || orderInfo?.order_status === "failed";

  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#06AEF4] rounded-full"></div>
        Thao tác
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Nút hủy đơn hàng - luôn hiển thị */}
        <button
          onClick={onCancelOrder}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <X className="w-4 h-4" />
          Hủy đơn hàng
        </button>
        
        {/* Hiển thị nút Thử lại nếu đã thất bại */}
        {isFailed && (
          <button
            onClick={onRetryPayment}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
          >
            Thử lại thanh toán
          </button>
        )}
        
        {/* Hiển thị nút Đổi phương thức nếu đã thất bại */}
        {isFailed && (
          <button
            onClick={onChangePaymentMethod}
            className="bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] text-white py-3 px-4 rounded-lg font-medium hover:from-[#70d9ff] hover:to-[#06AEF4] transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
          >
            Đổi phương thức thanh toán
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentActions; 