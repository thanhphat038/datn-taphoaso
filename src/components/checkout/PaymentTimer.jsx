import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const PaymentTimer = ({ timeLeft, onTimeExpired }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired?.();
      return;
    }

    const timer = setInterval(() => {
      // Timer logic sẽ được xử lý ở component cha
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 sm:p-6 flex flex-col items-center gap-2 shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-5 h-5 text-red-600" />
        <span className="text-sm font-medium text-red-600">Thời gian còn lại</span>
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-red-600 tracking-widest mb-1">
        {formatTime(timeLeft)}
      </div>
      <p className="text-xs sm:text-sm text-red-500 text-center">
        Sau khi hết thời gian, đơn hàng sẽ tự động hủy
      </p>
    </div>
  );
};

export default PaymentTimer; 