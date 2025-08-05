import { Clock, CreditCard, AlertCircle } from 'lucide-react';
import { usePaymentWaiting } from '../../hooks/usePaymentWaiting';
import PaymentTimer from '../../components/checkout/PaymentTimer';
import OrderInfo from '../../components/checkout/OrderInfo';
import PaymentActions from '../../components/checkout/PaymentActions';

const PaymentWaiting = () => {
  const {
    orderId,
    timeLeft,
    orderInfo,
    loading,
    isVnpayCallback,
    callbackMessage,
    isPaymentFailed,
    handleRetryPayment,
    handleCancelOrder,
    handleChangePaymentMethod
  } = usePaymentWaiting();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4 px-2">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col gap-6">
          {/* Cột trái: Countdown + Order Info + Actions */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gradient-to-r from-[#06AEF4] to-[#70d9ff] rounded-full flex items-center justify-center mb-2 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chờ thanh toán</h1>
              <p className="text-gray-600 text-sm sm:text-base">Vui lòng hoàn tất thanh toán trong thời gian quy định</p>
            </div>

            {/* Callback Message */}
            {isVnpayCallback && callbackMessage && (
              <div className={`rounded-xl p-4 sm:p-6 border ${
                callbackMessage.includes('thành công') 
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : isPaymentFailed || callbackMessage.includes('thất bại') || callbackMessage.includes('lỗi') || callbackMessage.includes('Thanh toán thất bại') || callbackMessage.includes('Giao dịch không thành công')
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {callbackMessage.includes('thành công') ? (
                    <div className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${
                      isPaymentFailed || callbackMessage.includes('thất bại') || callbackMessage.includes('lỗi') || callbackMessage.includes('Thanh toán thất bại') || callbackMessage.includes('Giao dịch không thành công')
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`} />
                  )}
                  <span className="font-medium">Thông báo từ VNPAY</span>
                </div>
                <p className="text-sm">{callbackMessage}</p>
              </div>
            )}

            {/* Countdown Timer */}
            <PaymentTimer timeLeft={timeLeft} />

            {/* Order Info */}
            <OrderInfo orderInfo={orderInfo} />

            {/* Actions */}
            <PaymentActions 
              orderInfo={orderInfo}
              onCancelOrder={handleCancelOrder}
              onRetryPayment={handleRetryPayment}
              onChangePaymentMethod={handleChangePaymentMethod}
            />
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-[#06AEF4]/10 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-[#06AEF4]" />
              Hướng dẫn thanh toán
            </h3>
            <div className="flex flex-col gap-2 text-sm text-blue-800">
              {(orderInfo?.order_status === 'failed' || orderInfo?.order_status === "failed") ? (
                <>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                    <p>Đơn hàng đã thất bại. Bạn có 10 phút để thử lại thanh toán.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                    <p>Sử dụng nút "Thử lại thanh toán" để tạo thanh toán mới với VNPAY.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                    <p>Hoặc sử dụng "Đổi phương thức thanh toán" để thử cách khác.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                    <p>Tab thanh toán VNPAY đã được mở. Vui lòng chuyển sang tab đó để hoàn tất thanh toán.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                    <p>Sau khi thanh toán thành công, bạn sẽ được chuyển về trang này và thấy thông báo thành công.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                    <p>Nếu thanh toán thất bại, bạn có thể thử lại hoặc đổi phương thức thanh toán.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 sm:p-6 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                {orderInfo?.order_status === 'cancelled' ? (
                  <>
                    <p>• Đơn hàng đã bị hủy</p>
                    <p>• Bạn có thể thử lại thanh toán bằng nút "Thử lại thanh toán"</p>
                    <p>• Hoặc tạo đơn hàng mới từ giỏ hàng</p>
                  </>
                ) : orderInfo?.order_status === 'failed' ? (
                  <>
                    <p>• Thanh toán thất bại, nhưng bạn vẫn có thời gian để thử lại</p>
                    <p>• Sử dụng nút "Thử lại thanh toán" để thanh toán lại</p>
                    <p>• Hoặc "Đổi phương thức thanh toán" để thử cách khác</p>
                  </>
                ) : (
                  <>
                    <p>• Không đóng tab thanh toán VNPAY cho đến khi hoàn tất</p>
                    <p>• Nếu hết thời gian, đơn hàng sẽ tự động hủy</p>
                    <p>• Bạn có thể thử lại bằng cách tạo đơn hàng mới</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWaiting; 