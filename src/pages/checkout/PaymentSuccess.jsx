import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Đặt hàng thành công!</h2>
        <div className="text-gray-600 text-base mb-3 text-center max-w-xs">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng và giao đến bạn sớm nhất có thể.
        </div>
        <div className="text-gray-400 text-sm mb-8 text-center">
          Bạn có thể theo dõi đơn hàng trong phần <span className="font-semibold text-blue-500">Đơn hàng của tôi</span>.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
            onClick={() => navigate('/profile/order')}
          >
            Xem đơn hàng
          </button>
          <button
            className="flex-1 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
            onClick={() => navigate('/')}
          >
            Về Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 