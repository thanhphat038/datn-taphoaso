# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
API sử dụng JWT (JSON Web Token) để xác thực. Token được gửi trong header của request:

```
Authorization: Bearer <token>
```

### Auth Endpoints

```http
# Register new user
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string"
}

# Login
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

# Get user profile
GET /auth/profile
Authorization: Bearer <token>

# Update profile
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "string",
  "phone": "string"
}

# Change password
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}
```

## API Endpoints

### Users
```http
# Create new user
POST /users
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "email": "string",
  "full_name": "string",
  "phone": "string",
  "role": "user" | "admin",
  "status": "active" | "inactive"
}

# Get all users
GET /users
Query params:
  - role: filter by role
  - status: filter by status

# Get user by id
GET /users/:id

# Update user
PUT /users/:id
Content-Type: application/json

{
  "full_name": "string",
  "phone": "string",
  "status": "active" | "inactive"
}

# Delete user
DELETE /users/:id
```

### Products
```http
# Create new product
POST /products
Content-Type: application/json

{
  "category_id": "string",
  "name": "string",
  "price": number,
  "status": "active" | "inactive",
  "description": "string",
  "images": string[]
}

# Get all products
GET /products
Query params:
  - category_id: filter by category
  - status: filter by status
  - search: search by name

# Get product by id
GET /products/:id

# Update product
PUT /products/:id
Content-Type: application/json

{
  "name": "string",
  "price": number,
  "status": "active" | "inactive",
  "description": "string",
  "images": string[]
}

# Delete product
DELETE /products/:id
```

### Categories
```http
# Create new category
POST /categories
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "status": "active" | "inactive"
}

# Get all categories
GET /categories
Query params:
  - status: filter by status

# Get category by id
GET /categories/:id

# Update category
PUT /categories/:id
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "status": "active" | "inactive"
}

# Delete category
DELETE /categories/:id
```

### Orders
```http
# Create new order
POST /orders
Content-Type: application/json

{
  "user_id": "string",
  "voucher_id": "string",
  "total_amount": number,
  "payment_method": "cod" | "banking",
  "address": {
    "district": "string",
    "ward": "string",
    "chitlet": "string",
    "sdt": "string",
    "ten_nguoi_nhan": "string"
  },
  "order_status": "pending" | "processing" | "delivered" | "cancelled",
  "receiver": "string",
  "sdt": "string",
  "orderDetails": [
    {
      "product_id": "string",
      "qty": number,
      "current_price": number
    }
  ]
}

# Get all orders
GET /orders
Query params:
  - user_id: filter by user
  - status: filter by status
  - from_date: filter by start date
  - to_date: filter by end date

# Get order by id
GET /orders/:id

# Update order
PUT /orders/:id
Content-Type: application/json

{
  "status": "pending" | "processing" | "delivered" | "cancelled",
  "payment_status": "pending" | "paid" | "failed",
  "shipping_status": "processing" | "delivered"
}

# Delete order
DELETE /orders/:id
```

### Addresses
```http
# Create new address
POST /addresses
Content-Type: application/json

{
  "user_id": "string",
  "district": "string",
  "ward": "string",
  "chitlet": "string",
  "sdt": "string",
  "ten_nguoi_nhan": "string"
}

# Get all addresses
GET /addresses
Query params:
  - user_id: filter by user

# Get address by id
GET /addresses/:id

# Update address
PUT /addresses/:id
Content-Type: application/json

{
  "district": "string",
  "ward": "string",
  "chitlet": "string",
  "sdt": "string",
  "ten_nguoi_nhan": "string"
}

# Delete address
DELETE /addresses/:id
```

### Reviews
```http
# Create new review
POST /reviews
Content-Type: application/json

{
  "user_id": "string",
  "product_id": "string",
  "rating": number,
  "user_review": "string"
}

# Get all reviews
GET /reviews
Query params:
  - user_id: filter by user
  - product_id: filter by product

# Get review by id
GET /reviews/:id

# Update review
PUT /reviews/:id
Content-Type: application/json

{
  "rating": number,
  "user_review": "string"
}

# Delete review
DELETE /reviews/:id
```

### Comments
```http
# Create new comment
POST /comments
Content-Type: application/json

{
  "user_id": "string",
  "product_id": "string",
  "comment": "string"
}

# Get all comments
GET /comments
Query params:
  - user_id: filter by user
  - product_id: filter by product

# Get comment by id
GET /comments/:id

# Update comment
PUT /comments/:id
Content-Type: application/json

{
  "comment": "string"
}

# Delete comment
DELETE /comments/:id
```

### Favorites
```http
# Add to favorites
POST /favorites
Content-Type: application/json

{
  "user_id": "string",
  "product_id": "string"
}

# Get all favorites
GET /favorites
Query params:
  - user_id: filter by user

# Get favorite by id
GET /favorites/:id

# Delete favorite
DELETE /favorites/:id
```

### Cart
```http
# Create new cart
POST /carts
Content-Type: application/json

{
  "user_id": "string"
}

# Get cart by user id
GET /carts/user/:userId

# Add item to cart
POST /carts/items
Content-Type: application/json

{
  "cart_id": "string",
  "product_id": "string",
  "qty": number
}

# Update cart item qty
PUT /carts/items/:id
Content-Type: application/json

{
  "qty": number
}

# Remove item from cart
DELETE /carts/items/:id

# Clear cart
DELETE /carts/:cartId/items
```

### Cart Items
```http
# Get all cart items
GET /cart-items
Query params:
  - cart_id: filter by cart

# Get cart item by id
GET /cart-items/:id

# Create new cart item
POST /cart-items
Content-Type: application/json

{
  "cart_id": "string",
  "product_id": "string",
  "qty": number
}

# Update cart item
PUT /cart-items/:id
Content-Type: application/json

{
  "qty": number
}

# Delete cart item
DELETE /cart-items/:id

# Delete all items in a cart
DELETE /cart-items/cart/:cartId
```

### Vouchers
```http
# Create new voucher
POST /vouchers
Content-Type: application/json

{
  "code": "string",
  "discount_type": "percentage" | "fixed",
  "discount_value": number,
  "max_discount": number,
  "min_order_value": number,
  "start_date": "date",
  "end_date": "date",
  "status": "active" | "inactive"
}

# Get all vouchers
GET /vouchers
Query params:
  - status: filter by status
  - code: search by code

# Get voucher by id
GET /vouchers/:id

# Get voucher by code
GET /vouchers/code/:code

# Update voucher
PUT /vouchers/:id
Content-Type: application/json

{
  "discount_value": number,
  "max_discount": number,
  "min_order_value": number,
  "start_date": "date",
  "end_date": "date",
  "status": "active" | "inactive"
}

# Delete voucher
DELETE /vouchers/:id
```

## Response Format
Tất cả các response đều có format như sau:

```json
// Success response
{
  "data": object | array,
  "message": "string" // optional
}

// Error response
{
  "message": "string",
  "error": "string" // optional
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Notes
1. Tất cả các ID đều là MongoDB ObjectId
2. Các date format nên sử dụng ISO 8601
3. Các số tiền nên được gửi dưới dạng số nguyên
4. Các file ảnh nên được upload trước và sử dụng URL trong request 