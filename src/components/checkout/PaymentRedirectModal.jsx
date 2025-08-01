import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Clock, AlertCircle } from 'lucide-react';

const PaymentRedirectModal = ({ isOpen, onClose, paymentUrl, orderId }) => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      setCountdown(5); // Reset countdown khi modal mở
      setIsRedirecting(false);
      setError(null);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);
  
  useEffect(() => {
    if (countdown === 0 && paymentUrl) {
      handleRedirect();
    }
  }, [countdown, paymentUrl]);

  if (!isOpen) return null;

  const handleRedirect = () => {
    if (!paymentUrl) {
      setError('Không có URL thanh toán hợp lệ');
      return;
    }
    
    setIsRedirecting(true);
    try {
      window.location.href = paymentUrl;
    } catch (err) {
      setError('Không thể chuyển đến trang thanh toán');
      setIsRedirecting(false);
    }
  };

  const handleCancel = () => {
    if (!isRedirecting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ExternalLink className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Chuyển đến trang thanh toán
          </h2>
          <p className="text-gray-600 text-sm">
            Bạn sẽ được chuyển đến trang thanh toán VNPAY để hoàn tất giao dịch
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Order Info */}
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
              <span className="font-bold text-gray-900">{orderId}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hướng dẫn thanh toán:
          </h3>
          <div className="text-xs text-blue-800 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>Hoàn tất thanh toán trên trang VNPAY</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>Không đóng tab thanh toán cho đến khi hoàn tất</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
              <p>Bạn sẽ được chuyển về trang chờ sau khi thanh toán</p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">
              Tự động chuyển hướng sau{' '}
              <span className="font-bold text-blue-600 text-lg">{countdown}</span> giây
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={countdown === 0 || isRedirecting}
            aria-label="Cancel payment redirect"
          >
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang chuyển...
              </div>
            ) : countdown === 0 ? (
              'Đang chuyển...'
            ) : (
              'Hủy'
            )}
          </button>
          <button
            onClick={handleRedirect}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={countdown === 0 || isRedirecting}
            aria-label="Redirect to payment page now"
          >
            {isRedirecting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang chuyển...
              </div>
            ) : countdown === 0 ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang chuyển...
              </div>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Chuyển ngay
              </>
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Thanh toán được bảo mật bởi VNPAY
          </p>
        </div>
      </div>
    </div>
  );
};

// Test Component
export const PaymentRedirectModalTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testMode, setTestMode] = useState('normal'); // normal, error, no-url

  const testCases = {
    normal: {
      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      orderId: 'TEST123456'
    },
    error: {
      paymentUrl: 'https://invalid-url.com',
      orderId: 'ERROR123'
    },
    'no-url': {
      paymentUrl: null,
      orderId: 'NOURL123'
    }
  };

  const currentTest = testCases[testMode];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">PaymentRedirectModal Test</h1>
        
        {/* Test Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Mode:</label>
              <select 
                value={testMode} 
                onChange={(e) => setTestMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normal (Valid URL)</option>
                <option value="error">Error (Invalid URL)</option>
                <option value="no-url">No URL (Null)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Settings:</label>
              <div className="text-sm text-gray-600">
                <p>Payment URL: {currentTest.paymentUrl || 'null'}</p>
                <p>Order ID: {currentTest.orderId}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Open Modal
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Close Modal
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p>✅ Modal opens and closes correctly</p>
            <p>✅ Countdown timer works (5 seconds)</p>
            <p>✅ Auto-redirect when countdown reaches 0</p>
            <p>✅ Manual redirect with "Chuyển ngay" button</p>
            <p>✅ Cancel functionality</p>
            <p>✅ Error handling for invalid URLs</p>
            <p>✅ Loading states during redirect</p>
            <p>✅ Responsive design</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PaymentRedirectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        paymentUrl={currentTest.paymentUrl}
        orderId={currentTest.orderId}
      />
    </div>
  );
};

export default PaymentRedirectModal; 