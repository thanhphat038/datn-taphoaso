import UserService from './user.service.js';
import ProductService from './product.service.js';
import OrderService from './order.service.js';
import CartService from './cart.service.js';
import VoucherService from './voucher.service.js';
import ReviewService from './review.service.js';
import CommentService from './comment.service.js';
import FavoriteService from './favorite.service.js';
import CategoryService from './category.service.js';
import AddressService from './address.service.js';
import AuthService from './auth.service.js';

// Create instances
const userService = new UserService();
const productService = new ProductService();
const orderService = new OrderService();
const cartService = new CartService();
const voucherService = new VoucherService();
const reviewService = new ReviewService();
const commentService = new CommentService();
const favoriteService = new FavoriteService();
const categoryService = new CategoryService();
const addressService = new AddressService();
const authService = new AuthService();

// Export instances
export {
  userService,
  productService,
  orderService,
  cartService,
  voucherService,
  reviewService,
  commentService,
  favoriteService,
  categoryService,
  addressService,
  authService
}; 