# Alert & Toast Components

Bộ component thông báo đẹp và hiện đại cho ứng dụng React.

## 🚀 Tính năng

### Alert Component
- Modal thông báo với backdrop blur
- 4 loại thông báo: Success, Error, Warning, Info
- Hỗ trợ custom actions (buttons)
- Auto close với timer
- Animation mượt mà
- Responsive design

### Toast Component
- Thông báo nhỏ gọn ở góc màn hình
- 6 vị trí hiển thị khác nhau
- Progress bar hiển thị thời gian
- Hỗ trợ hiển thị nhiều toast cùng lúc
- Auto dismiss

## 📦 Cài đặt

Các component đã được tích hợp sẵn trong dự án. Chỉ cần import và sử dụng:

```jsx
import { useAlertContext } from './components/AlertProvider';
import { useToast } from './components/ToastContainer';
```

## 🎯 Cách sử dụng

### 1. Alert (Modal)

```jsx
import { useAlertContext } from './components/AlertProvider';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo, showConfirm } = useAlertContext();

  const handleSuccess = () => {
    showSuccess('Thao tác thành công!', 'Thành công');
  };

  const handleError = () => {
    showError('Có lỗi xảy ra!', 'Lỗi');
  };

  const handleConfirm = () => {
    showConfirm({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa?',
      onConfirm: () => {
        // Xử lý khi xác nhận
        showSuccess('Đã xóa thành công!');
      },
      onCancel: () => {
        // Xử lý khi hủy
        showInfo('Đã hủy thao tác!');
      },
      confirmText: 'Xóa',
      cancelText: 'Hủy'
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success Alert</button>
      <button onClick={handleError}>Error Alert</button>
      <button onClick={handleConfirm}>Confirm Alert</button>
    </div>
  );
}
```

### 2. Toast (Notification)

```jsx
import { useToast } from './components/ToastContainer';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Thao tác thành công!');
  };

  const handleError = () => {
    showError('Có lỗi xảy ra!');
  };

  const handleMultipleToasts = () => {
    showSuccess('Toast 1');
    setTimeout(() => showInfo('Toast 2'), 500);
    setTimeout(() => showWarning('Toast 3'), 1000);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success Toast</button>
      <button onClick={handleError}>Error Toast</button>
      <button onClick={handleMultipleToasts}>Multiple Toasts</button>
    </div>
  );
}
```

## 🎨 Customization

### Alert Props

```jsx
showAlert({
  title: 'Tiêu đề',                    // Tiêu đề alert
  message: 'Nội dung thông báo',       // Nội dung
  type: 'info',                        // 'success' | 'error' | 'warning' | 'info'
  actions: [                           // Custom buttons
    {
      label: 'Hủy',
      variant: 'secondary',            // 'primary' | 'secondary' | 'danger'
      onClick: () => {}
    }
  ],
  autoClose: true,                     // Tự động đóng
  autoCloseDelay: 3000,               // Thời gian tự đóng (ms)
  showIcon: true,                      // Hiển thị icon
  showCloseButton: true               // Hiển thị nút đóng
});
```

### Toast Props

```jsx
showToast({
  message: 'Nội dung toast',
  type: 'info',                        // 'success' | 'error' | 'warning' | 'info'
  duration: 3000,                      // Thời gian hiển thị (ms)
  position: 'top-right'                // Vị trí hiển thị
});
```

## 📍 Vị trí Toast

- `top-right` (mặc định)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

## 🎭 Loại thông báo

### Success (Thành công)
- Màu: Xanh lá
- Icon: ✓
- Dùng cho: Thao tác thành công, lưu dữ liệu

### Error (Lỗi)
- Màu: Đỏ
- Icon: ✕
- Dùng cho: Lỗi hệ thống, thao tác thất bại

### Warning (Cảnh báo)
- Màu: Vàng
- Icon: ⚠
- Dùng cho: Cảnh báo, xác nhận thao tác

### Info (Thông tin)
- Màu: Xanh dương
- Icon: ℹ
- Dùng cho: Thông tin, hướng dẫn

## 🔧 Setup trong App.jsx

```jsx
import { AlertProvider } from './components/AlertProvider';
import { ToastProvider } from './components/ToastContainer';

function App() {
  return (
    <AlertProvider>
      <ToastProvider>
        {/* Your app components */}
      </ToastProvider>
    </AlertProvider>
  );
}
```

## 📱 Responsive

- Alert: Responsive trên tất cả thiết bị
- Toast: Tự động điều chỉnh kích thước
- Mobile-friendly với touch gestures

## 🎨 Styling

Các component sử dụng Tailwind CSS với:
- Border radius: `rounded-2xl` (Alert), `rounded-lg` (Toast)
- Shadow: `shadow-2xl` (Alert), `shadow-lg` (Toast)
- Colors: Semantic colors cho từng loại thông báo
- Transitions: Smooth animations

## 🚀 Performance

- Lazy loading cho icons
- Optimized re-renders
- Memory leak prevention
- Efficient state management

## 📝 Ví dụ thực tế

### Thông báo đăng nhập
```jsx
const handleLoginRequired = () => {
  showWarning(
    'Vui lòng đăng nhập để sử dụng tính năng này',
    'Yêu cầu đăng nhập'
  );
};
```

### Thông báo thêm vào giỏ hàng
```jsx
const handleAddToCart = async () => {
  try {
    await addToCart(productId);
    showToastSuccess('Đã thêm vào giỏ hàng!');
  } catch (error) {
    showToastError('Không thể thêm vào giỏ hàng!');
  }
};
```

### Xác nhận xóa
```jsx
const handleDelete = () => {
  showConfirm({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
    onConfirm: async () => {
      try {
        await deleteProduct(productId);
        showSuccess('Đã xóa sản phẩm!');
      } catch (error) {
        showError('Không thể xóa sản phẩm!');
      }
    },
    confirmText: 'Xóa',
    cancelText: 'Hủy'
  });
};
```

## 🐛 Troubleshooting

### Alert không hiển thị
- Kiểm tra AlertProvider đã được wrap đúng chưa
- Kiểm tra import useAlertContext

### Toast không hiển thị
- Kiểm tra ToastProvider đã được wrap đúng chưa
- Kiểm tra import useToast

### Multiple toasts không hoạt động
- Đảm bảo mỗi toast có unique ID
- Kiểm tra position có đúng không

## 📄 License

MIT License - Sử dụng tự do trong dự án. 