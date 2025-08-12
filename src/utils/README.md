# Utility Functions & Custom Hooks

Thư mục này chứa các utility functions và custom hooks được tạo ra để tối ưu hóa code và tránh lặp lại logic giữa các component.

## 📁 Cấu trúc thư mục

```
src/
├── utils/
│   ├── price.js          # Utility cho tính toán giá và giảm giá
│   ├── orderStatus.js    # Utility cho xử lý trạng thái đơn hàng
│   └── index.js          # Export tất cả utilities
├── hooks/
│   ├── useVoucher.js     # Hook xử lý voucher
│   ├── useShipping.js    # Hook xử lý phí vận chuyển
│   ├── useAddress.js     # Hook xử lý địa chỉ
│   └── index.js          # Export tất cả hooks
└── README.md             # Hướng dẫn sử dụng
```

## 🚀 Cách sử dụng

### 1. Import utilities

```javascript
// Import từng utility riêng lẻ
import { calculateTotalPrice, formatCurrency } from '../utils/price';
import { getOrderStatusText, getOrderStatusColor } from '../utils/orderStatus';

// Hoặc import tất cả từ index
import { 
  calculateTotalPrice, 
  formatCurrency,
  getOrderStatusText 
} from '../utils';
```

### 2. Import custom hooks

```javascript
// Import từng hook riêng lẻ
import { useVoucher } from '../hooks/useVoucher';
import { useShipping } from '../hooks/useShipping';

// Hoặc import tất cả từ index
import { useVoucher, useShipping, useAddress } from '../hooks';
```

## 📊 Utility Functions

### Price Utilities (`src/utils/price.js`)

#### `calculateTotalPrice(items, priceField, quantityField)`
Tính tổng tiền sản phẩm

```javascript
const total = calculateTotalPrice(products, 'price', 'quantity');
```

#### `calculateVoucherDiscount(voucher, totalAmount)`
Tính giảm giá voucher

```javascript
const discount = calculateVoucherDiscount(voucher, 100000);
```

#### `calculateFinalTotal(subtotal, shippingFee, voucherDiscount)`
Tính tổng tiền cuối cùng

```javascript
const finalTotal = calculateFinalTotal(100000, 15000, 10000);
```

#### `formatCurrency(amount)`
Format tiền tệ theo định dạng Việt Nam

```javascript
const formattedPrice = formatCurrency(100000); // "100,000 đ"
```

### Order Status Utilities (`src/utils/orderStatus.js`)

#### `getOrderStatusText(status)`
Lấy text hiển thị cho trạng thái

```javascript
const statusText = getOrderStatusText('pending'); // "Chờ thanh toán"
```

#### `getOrderStatusStyles(status)`
Lấy tất cả thông tin styling cho trạng thái

```javascript
const styles = getOrderStatusStyles('paid');
// {
//   text: 'Đã thanh toán',
//   color: 'text-green-600',
//   bgColor: 'bg-green-50',
//   borderColor: 'border-green-200'
// }
```

## 🪝 Custom Hooks

### useVoucher Hook

```javascript
const {
  voucher,
  voucherCode,
  voucherMessage,
  voucherDiscount,
  applyVoucher,
  removeVoucher
} = useVoucher(totalAmount);

// Áp dụng voucher
await applyVoucher('GIAM10');

// Xóa voucher
removeVoucher();
```

### useShipping Hook

```javascript
const {
  shippingFee,
  isCalculatingShipping,
  calculateShippingFeeForAddress,
  shippingFeeDisplay,
  isFreeShipping
} = useShipping();

// Tính phí vận chuyển
await calculateShippingFeeForAddress(userAddress);
```

### useAddress Hook

```javascript
const {
  addresses,
  selectedAddress,
  loading,
  fetchAddresses,
  selectAddress,
  hasAddresses
} = useAddress();

// Chọn địa chỉ
selectAddress(address);
```

## 🔄 Migration từ code cũ

### Thay thế logic tính tổng tiền

**Trước:**
```javascript
const total = productsToDisplay.reduce((total, item) => 
  total + (item.price || item.product_id.price) * (item.quantity || item.qty), 0
);
```

**Sau:**
```javascript
import { calculateTotalPrice } from '../utils/price';

const total = calculateTotalPrice(productsToDisplay);
```

### Thay thế logic voucher

**Trước:**
```javascript
const [voucher, setVoucher] = useState(null);
const [voucherCode, setVoucherCode] = useState('');
const [voucherMessage, setVoucherMessage] = useState('');

const handleApplyVoucher = async () => {
  // Logic phức tạp...
};
```

**Sau:**
```javascript
import { useVoucher } from '../hooks/useVoucher';

const {
  voucher,
  voucherCode,
  voucherMessage,
  applyVoucher
} = useVoucher(totalAmount);
```

## ✅ Lợi ích

1. **Giảm code duplication**: Logic không bị lặp lại giữa các component
2. **Dễ maintain**: Chỉ cần sửa ở một nơi
3. **Reusable**: Có thể sử dụng ở nhiều component khác
4. **Testing**: Dễ dàng test các utility functions riêng biệt
5. **Consistency**: Đảm bảo logic nhất quán giữa các component
6. **Type safety**: JSDoc comments giúp IDE hiểu rõ parameters và return values

## 🧪 Testing

Các utility functions có thể được test dễ dàng:

```javascript
import { calculateTotalPrice, calculateVoucherDiscount } from '../utils/price';

describe('Price Utilities', () => {
  test('calculateTotalPrice should calculate correctly', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ];
    expect(calculateTotalPrice(items)).toBe(250);
  });
});
```
