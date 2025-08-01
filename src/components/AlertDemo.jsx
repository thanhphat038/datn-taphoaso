import React from 'react';
import { useAlertContext } from './AlertProvider';
import { useToast } from './ToastContainer';

const AlertDemo = () => {
  const { showAlert, showSuccess, showError, showWarning, showInfo, showConfirm } = useAlertContext();
  const { showSuccess: showToastSuccess, showError: showToastError, showWarning: showToastWarning, showInfo: showToastInfo } = useToast();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Alert & Toast Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Alert Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Alert Components</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => showSuccess('Thao tác thành công!', 'Thành công')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Success Alert
            </button>
            
            <button
              onClick={() => showError('Có lỗi xảy ra!', 'Lỗi')}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Error Alert
            </button>
            
            <button
              onClick={() => showWarning('Cảnh báo!', 'Cảnh báo')}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Warning Alert
            </button>
            
            <button
              onClick={() => showInfo('Thông tin mới!', 'Thông báo')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Info Alert
            </button>
            
            <button
              onClick={() => showConfirm({
                title: 'Xác nhận xóa',
                message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
                onConfirm: () => showSuccess('Đã xóa sản phẩm!'),
                onCancel: () => showInfo('Đã hủy thao tác!'),
                confirmText: 'Xóa',
                cancelText: 'Hủy'
              })}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Confirm Alert
            </button>
            
            <button
              onClick={() => showAlert({
                title: 'Alert tùy chỉnh',
                message: 'Đây là một alert với các tùy chọn tùy chỉnh',
                type: 'info',
                actions: [
                  {
                    label: 'Hủy',
                    variant: 'secondary',
                    onClick: () => showInfo('Đã hủy!')
                  },
                  {
                    label: 'Lưu',
                    variant: 'primary',
                    onClick: () => showSuccess('Đã lưu!')
                  }
                ],
                autoClose: false
              })}
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Custom Alert
            </button>
          </div>
        </div>

        {/* Toast Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Toast Components</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => showToastSuccess('Thao tác thành công!')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Success Toast
            </button>
            
            <button
              onClick={() => showToastError('Có lỗi xảy ra!')}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Error Toast
            </button>
            
            <button
              onClick={() => showToastWarning('Cảnh báo!')}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Warning Toast
            </button>
            
            <button
              onClick={() => showToastInfo('Thông tin mới!')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Info Toast
            </button>
            
            <button
              onClick={() => {
                showToastSuccess('Toast 1');
                setTimeout(() => showToastInfo('Toast 2'), 500);
                setTimeout(() => showToastWarning('Toast 3'), 1000);
                setTimeout(() => showToastError('Toast 4'), 1500);
              }}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Multiple Toasts
            </button>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Cách sử dụng:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Alert (Modal):</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`// Import
import { useAlertContext } from './AlertProvider';

// Sử dụng
const { showSuccess, showError, showWarning, showInfo, showConfirm } = useAlertContext();

// Hiển thị
showSuccess('Thành công!');
showError('Lỗi!');
showWarning('Cảnh báo!');
showInfo('Thông tin!');`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-600 mb-2">Toast (Notification):</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`// Import
import { useToast } from './ToastContainer';

// Sử dụng
const { showSuccess, showError, showWarning, showInfo } = useToast();

// Hiển thị
showSuccess('Thành công!');
showError('Lỗi!');
showWarning('Cảnh báo!');
showInfo('Thông tin!');`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDemo; 