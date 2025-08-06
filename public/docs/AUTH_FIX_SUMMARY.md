# Sửa lỗi Duplicate Functions trong user.service

## Vấn đề gặp phải

### 1. Lỗi Duplicate Functions
```
Identifier 'resetPassword' has already been declared. (355:22)
```

### 2. Lỗi Import
```
The requested module does not provide an export named 'forgotPassword'
```

## Nguyên nhân

Trong quá trình tối ưu hóa, tôi đã thêm các function mới vào user.service nhưng quên xóa các function cũ duplicate:

1. **resetPassword**: Có 2 version
   - Version 1: `resetPassword({ token, newPassword })` (dòng 140)
   - Version 2: `resetPassword(token, newPassword)` (dòng 355)

2. **forgotPassword**: Bị duplicate với `requestPasswordReset`
   - `forgotPassword(email)` 
   - `requestPasswordReset({ email })`

3. **updateUser**: Bị duplicate với `updateUserById`
   - `updateUser(id, userData)`
   - `updateUserById(userId, userData)`

## Giải pháp đã thực hiện

### 1. Xóa Duplicate Functions

#### Xóa `resetPassword` duplicate
```javascript
// Xóa function này
export async function resetPassword(token, newPassword) {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
  }
}
```

#### Xóa `forgotPassword` duplicate
```javascript
// Xóa function này
export async function forgotPassword(email) {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu');
  }
}
```

#### Xóa `updateUser` duplicate
```javascript
// Xóa function này
export async function updateUser(id, userData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token found");
    const response = await axios.put(`${BASE_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Cập nhật người dùng thất bại");
  }
}
```

### 2. Sửa Import Statements

#### LoginPage.jsx
```javascript
// Trước
import { forgotPassword } from '../service/user.service';

// Sau
import { requestPasswordReset } from '../service/user.service';
```

#### ResetPasswordPage.jsx
```javascript
// Trước
await resetPassword(token, formData.newPassword);

// Sau
await resetPassword({ token, newPassword: formData.newPassword });
```

#### AdminUser.jsx
```javascript
// Trước
import { fetchUsers, updateUser, deleteUser, toggleUserStatus } from '../../service/user.service';

// Sau
import { fetchUsers, updateUserById, deleteUser, toggleUserStatus } from '../../service/user.service';
```

### 3. Sửa Function Calls

#### AdminUser.jsx
```javascript
// Trước
await updateUser(currentEditUser._id, { ... });

// Sau
await updateUserById(currentEditUser._id, { ... });
```

#### LoginPage.jsx
```javascript
// Trước
await forgotPassword(forgotEmail);

// Sau
await requestPasswordReset({ email: forgotEmail });
```

## Functions được giữ lại

### 1. Password Management
- `requestPasswordReset({ email })` - Gửi email reset password
- `resetPassword({ token, newPassword })` - Reset password với token
- `changePassword({ currentPassword, newPassword })` - Đổi password

### 2. User Management
- `getUserById(userId)` - Lấy user theo ID
- `updateUserById(userId, userData)` - Cập nhật user theo ID
- `deleteUserById(userId)` - Xóa user theo ID
- `getAllUsers(params)` - Lấy tất cả users

### 3. Profile Management
- `getProfile()` - Lấy thông tin profile
- `updateProfile(userData)` - Cập nhật profile

### 4. Address Management
- `getAddresses()` - Lấy danh sách địa chỉ
- `createAddress(addressData)` - Tạo địa chỉ mới
- `updateAddress(id, addressData)` - Cập nhật địa chỉ
- `deleteAddress(id)` - Xóa địa chỉ

### 5. Order & Review Management
- `getMyOrders(page, limit)` - Lấy đơn hàng của user
- `createReview(data)` - Tạo đánh giá

## Kết quả

### ✅ Đã sửa
- [x] Xóa duplicate function `resetPassword`
- [x] Xóa duplicate function `forgotPassword`
- [x] Xóa duplicate function `updateUser`
- [x] Sửa import statements
- [x] Sửa function calls
- [x] Đồng bộ API signatures

### ✅ Không còn lỗi
- [x] Không còn duplicate function declarations
- [x] Không còn import errors
- [x] Tất cả function calls đều đúng signature

### ✅ API Consistency
- [x] Tất cả password functions nhận object parameters
- [x] Tất cả user management functions có tên rõ ràng
- [x] Consistent error handling

## Lưu ý khi sử dụng

1. **Password functions**: Luôn truyền object parameters
   ```javascript
   // ✅ Đúng
   await requestPasswordReset({ email: 'user@example.com' });
   await resetPassword({ token: 'token', newPassword: 'password' });
   
   // ❌ Sai
   await requestPasswordReset('user@example.com');
   await resetPassword('token', 'password');
   ```

2. **User management**: Sử dụng functions có tên rõ ràng
   ```javascript
   // ✅ Đúng
   await updateUserById(userId, userData);
   await getUserById(userId);
   
   // ❌ Sai (không còn tồn tại)
   await updateUser(userId, userData);
   ```

3. **Error handling**: Tất cả functions đều throw Error với message rõ ràng 