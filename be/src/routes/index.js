import express from 'express';

import userRouter from './user.route.js';

import productRouter from './product.route.js';
import categoryRouter from './category.route.js';
import orderRouter from './order.route.js';
import addressRouter from './address.route.js';

import reviewRouter from './review.route.js';
import commentRouter from './comment.route.js';
import favoriteRouter from './favorite.route.js';

import cartRouter from './cart.route.js';
import cartItemRouter from './cartItem.route.js';

import voucherRouter from './voucher.route.js';
import authRouter from './auth.route.js';

const router = express.Router();

// Auth routes
router.use('/auth', authRouter);

// Protected routes
router.use('/products', productRouter);
router.use('/categories', categoryRouter);

router.use('/users', userRouter);
router.use('/orders', orderRouter);
router.use('/addresses', addressRouter);

router.use('/reviews', reviewRouter);
router.use('/comments', commentRouter);
router.use('/favorites', favoriteRouter);

router.use('/carts', cartRouter);
router.use('/cart-items', cartItemRouter);

router.use('/vouchers', voucherRouter);

export default router;
