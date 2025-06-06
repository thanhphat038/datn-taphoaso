# Services Documentation

## Overview

Services là các lớp xử lý logic nghiệp vụ của ứng dụng. Mỗi service kế thừa từ `DBService` và cung cấp các phương thức đặc thù cho từng model.

## Base Service

### DBService

Lớp cơ sở cung cấp các phương thức CRUD cơ bản:

- `findAll(options)`: Lấy tất cả bản ghi
- `findById(id)`: Lấy bản ghi theo ID
- `findOne(query)`: Lấy một bản ghi theo điều kiện
- `find(query, options)`: Tìm kiếm bản ghi theo điều kiện
- `create(data)`: Tạo bản ghi mới
- `updateById(id, data)`: Cập nhật bản ghi theo ID
- `deleteById(id)`: Xóa bản ghi theo ID
- `countDocuments(query)`: Đếm số lượng bản ghi
- `aggregate(pipeline)`: Thực hiện aggregation

## Model Services

### UserService

Xử lý các thao tác liên quan đến người dùng:

- `findByEmail(email)`: Tìm user theo email
- `findByUsername(username)`: Tìm user theo username
- `createUser(userData)`: Tạo user mới với mật khẩu đã mã hóa
- `updateUser(id, userData)`: Cập nhật thông tin user
- `changePassword(id, oldPassword, newPassword)`: Đổi mật khẩu
- `verifyPassword(user, password)`: Xác thực mật khẩu

### ProductService

Xử lý các thao tác liên quan đến sản phẩm:

- `findByCategory(categoryId, options)`: Tìm sản phẩm theo danh mục
- `searchProducts(query, options)`: Tìm kiếm sản phẩm
- `updateStock(productId, quantity, operation)`: Cập nhật số lượng tồn kho
- `getTopRated(limit)`: Lấy sản phẩm đánh giá cao
- `getNewArrivals(limit)`: Lấy sản phẩm mới
- `getRelatedProducts(productId, limit)`: Lấy sản phẩm liên quan

### OrderService

Xử lý các thao tác liên quan đến đơn hàng:

- `createOrder(orderData)`: Tạo đơn hàng và cập nhật số lượng sản phẩm
- `updateOrderStatus(id, status)`: Cập nhật trạng thái đơn hàng
- `getUserOrders(userId, options)`: Lấy đơn hàng của user
- `getOrderDetails(id)`: Lấy chi tiết đơn hàng
- `calculateOrderStats()`: Tính toán thống kê đơn hàng
- `getRecentOrders(limit)`: Lấy đơn hàng gần đây

### CartService

Xử lý các thao tác liên quan đến giỏ hàng:

- `getOrCreateCart(userId)`: Lấy hoặc tạo giỏ hàng
- `addToCart(userId, productId, quantity)`: Thêm sản phẩm vào giỏ
- `updateCartItem(userId, productId, quantity)`: Cập nhật số lượng sản phẩm
- `removeFromCart(userId, productId)`: Xóa sản phẩm khỏi giỏ
- `clearCart(userId)`: Xóa toàn bộ giỏ hàng
- `calculateCartTotal(userId)`: Tính tổng tiền giỏ hàng

### VoucherService

Xử lý các thao tác liên quan đến voucher:

- `validateVoucher(code, userId, totalAmount)`: Kiểm tra tính hợp lệ của voucher
- `applyVoucher(code, userId, totalAmount)`: Áp dụng voucher
- `getActiveVouchers()`: Lấy voucher đang hoạt động
- `getVoucherStats()`: Lấy thống kê sử dụng voucher

### ReviewService

Xử lý các thao tác liên quan đến đánh giá:

- `createReview(reviewData)`: Tạo đánh giá mới
- `getProductReviews(productId, options)`: Lấy đánh giá của sản phẩm
- `updateReview(id, reviewData)`: Cập nhật đánh giá
- `deleteReview(id)`: Xóa đánh giá
- `calculateProductRating(productId)`: Tính toán rating trung bình

### CommentService

Xử lý các thao tác liên quan đến bình luận:

- `createComment(commentData)`: Tạo bình luận mới
- `getProductComments(productId, options)`: Lấy bình luận của sản phẩm
- `updateComment(id, commentData)`: Cập nhật bình luận
- `deleteComment(id)`: Xóa bình luận

### FavoriteService

Xử lý các thao tác liên quan đến sản phẩm yêu thích:

- `addToFavorites(userId, productId)`: Thêm vào yêu thích
- `removeFromFavorites(userId, productId)`: Xóa khỏi yêu thích
- `getUserFavorites(userId, options)`: Lấy danh sách yêu thích
- `checkFavorite(userId, productId)`: Kiểm tra đã yêu thích chưa

### CategoryService

Xử lý các thao tác liên quan đến danh mục:

- `createCategory(categoryData)`: Tạo danh mục mới
- `updateCategory(id, categoryData)`: Cập nhật danh mục
- `deleteCategory(id)`: Xóa danh mục
- `getCategoryWithProducts(id)`: Lấy danh mục kèm sản phẩm

### AddressService

Xử lý các thao tác liên quan đến địa chỉ:

- `createAddress(addressData)`: Tạo địa chỉ mới
- `getUserAddresses(userId)`: Lấy địa chỉ của user
- `updateAddress(id, addressData)`: Cập nhật địa chỉ
- `deleteAddress(id)`: Xóa địa chỉ
- `setDefaultAddress(userId, addressId)`: Đặt địa chỉ mặc định

## Error Handling

Tất cả các service đều sử dụng `AppError` để xử lý lỗi với các mã lỗi được định nghĩa trong `ERROR_CODES`. Các lỗi phổ biến bao gồm:

- `RESOURCE_NOT_FOUND`: Không tìm thấy tài nguyên
- `RESOURCE_ALREADY_EXISTS`: Tài nguyên đã tồn tại
- `AUTH_INVALID_CREDENTIALS`: Thông tin đăng nhập không hợp lệ
- `BUSINESS_INSUFFICIENT_STOCK`: Không đủ số lượng tồn kho
- `BUSINESS_INVALID_ORDER_STATUS`: Trạng thái đơn hàng không hợp lệ
- `BUSINESS_VOUCHER_EXPIRED`: Voucher đã hết hạn
- `BUSINESS_VOUCHER_MIN_ORDER_NOT_MET`: Không đủ điều kiện sử dụng voucher

## Best Practices

1. **Validation**: Kiểm tra dữ liệu đầu vào trước khi xử lý
2. **Error Handling**: Sử dụng try-catch và AppError để xử lý lỗi
3. **Transaction**: Sử dụng transaction khi cần đảm bảo tính toàn vẹn dữ liệu
4. **Pagination**: Hỗ trợ phân trang cho các API danh sách
5. **Populate**: Sử dụng populate để lấy dữ liệu liên quan
6. **Indexing**: Tạo index cho các trường thường xuyên tìm kiếm
7. **Caching**: Cân nhắc sử dụng cache cho dữ liệu ít thay đổi 