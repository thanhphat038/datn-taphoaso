# Hệ thống Bảo mật Admin

## Tổng quan
Hệ thống đã được cấu hình để chỉ admin mới có thể truy cập vào các trang và API quản trị.

## Frontend Protection

### 1. AdminProtected Component
- **File**: `src/components/admin/AdminProtected.jsx`
- **Chức năng**: Bảo vệ tất cả route admin
- **Kiểm tra**: 
  - Token authentication
  - User role = 'admin'
  - Lưu trữ thông tin user trong localStorage

### 2. useAdminAuth Hook
- **File**: `src/hooks/useAdminAuth.js`
- **Chức năng**: Hook để kiểm tra quyền admin
- **Features**:
  - Kiểm tra token
  - Validate role admin
  - Refresh user data
  - Logout function

### 3. AdminForbidden Component
- **File**: `src/components/admin/AdminForbidden.jsx`
- **Chức năng**: Hiển thị trang 403 khi không có quyền admin
- **UI**: Giao diện đẹp với thông báo rõ ràng

## Backend Protection

### 1. Middleware Authentication
- **File**: `be/src/middlewares/auth.middleware.js`
- **Chức năng**:
  - `authMiddleware`: Kiểm tra token và user status
  - `isAdmin`: Kiểm tra role admin
  - `isUser`: Kiểm tra role user

### 2. Protected Routes

#### User Routes (`/api/users`)
```javascript
// Public
POST / - Create user (register)

// Admin only
GET / - Get all users
GET /:id - Get user by ID
PUT /:id - Update user
DELETE /:id - Delete user
```

#### Product Routes (`/api/products`)
```javascript
// Public
GET / - Get all products
GET /search - Search products
GET /category/:id - Get products by category
GET /top-rated - Get top rated products
GET /new-arrivals - Get new arrivals
GET /:id - Get product by ID
GET /:id/related - Get related products
GET /:id/reviews - Get product reviews

// Admin only
POST / - Create product
PUT /:id - Update product
DELETE /:id - Delete product
PATCH /:id/activate - Activate product
PATCH /:id/deactivate - Deactivate product
```

## Cách hoạt động

### 1. Frontend Flow
1. User truy cập `/admin/*`
2. `AdminProtected` component được trigger
3. `useAdminAuth` hook kiểm tra:
   - Token trong cookies
   - User data trong localStorage
   - API call để validate nếu cần
4. Nếu không phải admin → Hiển thị `AdminForbidden`
5. Nếu là admin → Render admin pages

### 2. Backend Flow
1. Request đến protected API
2. `authMiddleware` kiểm tra token
3. `isAdmin` middleware kiểm tra role
4. Nếu pass → Controller xử lý
5. Nếu fail → Return 403 Forbidden

## Security Features

### 1. Token-based Authentication
- JWT token stored in cookies
- Automatic token validation
- Token expiration handling

### 2. Role-based Access Control
- Admin role required for admin routes
- User role for public routes
- Clear separation of concerns

### 3. Frontend Protection
- Route-level protection
- Component-level protection
- Automatic redirect for unauthorized access

### 4. Backend Protection
- Middleware-level protection
- API-level protection
- Database-level role validation

## Error Handling

### Frontend Errors
- 401 Unauthorized: Token invalid/expired
- 403 Forbidden: Not admin role
- Network errors: Connection issues

### Backend Errors
- 401: Invalid/missing token
- 403: Insufficient permissions
- 404: Resource not found
- 500: Server errors

## Testing Scenarios

### 1. Admin Access
- ✅ Admin user can access `/admin/*`
- ✅ Admin can use all admin features
- ✅ Admin can modify user roles

### 2. User Access
- ❌ Regular user cannot access `/admin/*`
- ❌ User gets 403 Forbidden page
- ❌ User cannot use admin APIs

### 3. Unauthenticated Access
- ❌ No token → Redirect to login
- ❌ Invalid token → Clear data and redirect
- ❌ Expired token → Refresh or logout

## Maintenance

### Adding New Admin Routes
1. Wrap route with `AdminProtected` in `App.jsx`
2. Add middleware in backend route
3. Test with both admin and user accounts

### Adding New Admin APIs
1. Import `authMiddleware` and `isAdmin`
2. Add middleware to route definition
3. Test API with Postman/Thunder Client

## Best Practices

### 1. Security
- Always validate on both frontend and backend
- Never trust client-side data
- Use HTTPS in production
- Implement rate limiting

### 2. User Experience
- Clear error messages
- Loading states during auth checks
- Smooth redirects
- Consistent UI/UX

### 3. Code Organization
- Separate admin and user logic
- Reusable components
- Clear file structure
- Comprehensive documentation 